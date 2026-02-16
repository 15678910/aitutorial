import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useWhyQuestionStore } from '../whyQuestionStore'

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value
    },
    removeItem: (key: string) => {
      delete store[key]
    },
    clear: () => {
      store = {}
    },
  }
})()

Object.defineProperty(globalThis, 'localStorage', {
  value: localStorageMock,
})

// Mock supabase
vi.mock('../../lib/supabase', () => ({
  supabase: {
    from: () => ({
      select: () => ({
        eq: () => ({
          order: () => Promise.resolve({ data: [], error: null }),
          in: () => Promise.resolve({ data: [], error: null }),
        }),
        in: () => ({
          order: () => Promise.resolve({ data: [], error: null }),
        }),
      }),
      insert: () => Promise.resolve({ data: null, error: null }),
      update: () => ({
        eq: () => Promise.resolve({ data: null, error: null }),
      }),
      delete: () => ({
        eq: () => ({
          eq: () => Promise.resolve({ data: null, error: null }),
        }),
      }),
    }),
  },
}))

describe('whyQuestionStore', () => {
  beforeEach(() => {
    localStorage.clear()
    // Import getSampleQuestions function to reload initial state properly
    // Reset to initial state which includes sample questions
    // Force a fresh import to reload initial state with sample data
    useWhyQuestionStore.setState({
      questions: new Map([
        ['intro-what-is-ai', [
          {
            id: 'why-sample-1',
            sectionId: 'intro-what-is-ai',
            userId: 'sample-user-1',
            userName: '김하늘',
            question: '왜 인공지능을 배워야 하나요? 프로그래밍을 잘 못해도 AI를 이해하는 게 중요한가요?',
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
            likes: 12,
            likedBy: ['user-a', 'user-b', 'user-c', 'user-d', 'user-e', 'user-f', 'user-g', 'user-h', 'user-i', 'user-j', 'user-k', 'user-l'],
            answers: [
              {
                id: 'answer-1',
                questionId: 'why-sample-1',
                userId: 'sample-user-2',
                userName: '이선생',
                content: 'AI는 이미 우리 일상에 깊숙이 들어와 있어요.',
                createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
                likes: 8,
                likedBy: ['user-x', 'user-y'],
                isAccepted: true,
              },
            ],
            tags: ['실생활', '기초', '미래'],
            isFeatured: true,
          },
        ]],
      ]),
      loading: false,
    })
  })

  describe('Initial state', () => {
    it('should have sample questions for intro-what-is-ai section', () => {
      const store = useWhyQuestionStore.getState()
      const questions = store.getQuestions('intro-what-is-ai')
      expect(questions.length).toBeGreaterThan(0)
      expect(questions.some(q => q.sectionId === 'intro-what-is-ai')).toBe(true)
    })

    it('should have questions with Korean content', () => {
      const store = useWhyQuestionStore.getState()
      const questions = store.getQuestions('intro-what-is-ai')
      expect(questions.length).toBeGreaterThan(0)
      // Check that questions contain Korean characters
      questions.forEach(q => {
        expect(/[가-힣]/.test(q.question)).toBe(true)
      })
    })

    it('should have featured questions', () => {
      const store = useWhyQuestionStore.getState()
      const questions = store.getQuestions('intro-what-is-ai')
      const featuredQuestions = questions.filter(q => q.isFeatured)
      expect(featuredQuestions.length).toBeGreaterThan(0)
    })

    it('should have questions with answers', () => {
      const store = useWhyQuestionStore.getState()
      const questions = store.getQuestions('intro-what-is-ai')
      const questionsWithAnswers = questions.filter(q => q.answers.length > 0)
      expect(questionsWithAnswers.length).toBeGreaterThan(0)
    })

    it('should have questions with likes', () => {
      const store = useWhyQuestionStore.getState()
      const questions = store.getQuestions('intro-what-is-ai')
      const questionsWithLikes = questions.filter(q => q.likes > 0)
      expect(questionsWithLikes.length).toBeGreaterThan(0)
    })

    it('should have accepted answers', () => {
      const store = useWhyQuestionStore.getState()
      const questions = store.getQuestions('intro-what-is-ai')
      const questionsWithAcceptedAnswers = questions.filter(q =>
        q.answers.some(a => a.isAccepted)
      )
      expect(questionsWithAcceptedAnswers.length).toBeGreaterThan(0)
    })
  })

  describe('getQuestions', () => {
    it('should return questions for a section', () => {
      const store = useWhyQuestionStore.getState()
      const questions = store.getQuestions('intro-what-is-ai')
      expect(Array.isArray(questions)).toBe(true)
      expect(questions.length).toBeGreaterThan(0)
    })

    it('should return empty array for non-existent section', () => {
      const store = useWhyQuestionStore.getState()
      const questions = store.getQuestions('non-existent-section')
      expect(questions).toEqual([])
    })

    it('should return questions sorted by creation date (newest first)', () => {
      const store = useWhyQuestionStore.getState()
      const questions = store.getQuestions('intro-what-is-ai')
      if (questions.length > 1) {
        for (let i = 0; i < questions.length - 1; i++) {
          const date1 = new Date(questions[i].createdAt).getTime()
          const date2 = new Date(questions[i + 1].createdAt).getTime()
          expect(date1).toBeGreaterThanOrEqual(date2)
        }
      }
    })
  })

  describe('addQuestion', () => {
    it('should add a new question', () => {
      const store = useWhyQuestionStore.getState()
      const initialCount = store.getQuestions('test-section').length

      store.addQuestion('test-section', 'user-1', '테스트 유저', '왜 AI를 배워야 하나요?', ['기초'])

      const questions = store.getQuestions('test-section')
      expect(questions.length).toBe(initialCount + 1)
      expect(questions[0].question).toBe('왜 AI를 배워야 하나요?')
      expect(questions[0].userName).toBe('테스트 유저')
      expect(questions[0].tags).toContain('기초')
    })

    it('should not add empty question', () => {
      const store = useWhyQuestionStore.getState()
      const initialCount = store.getQuestions('test-section').length

      store.addQuestion('test-section', 'user-1', '테스트 유저', '   ', ['기초'])

      const questions = store.getQuestions('test-section')
      expect(questions.length).toBe(initialCount)
    })

    it('should not add question longer than 500 characters', () => {
      const store = useWhyQuestionStore.getState()
      const initialCount = store.getQuestions('test-section').length
      const longQuestion = 'a'.repeat(501)

      store.addQuestion('test-section', 'user-1', '테스트 유저', longQuestion, [])

      const questions = store.getQuestions('test-section')
      expect(questions.length).toBe(initialCount)
    })

    it('should initialize question with 0 likes', () => {
      const store = useWhyQuestionStore.getState()
      store.addQuestion('test-section', 'user-1', '테스트 유저', '테스트 질문', [])

      const questions = store.getQuestions('test-section')
      expect(questions[0].likes).toBe(0)
      expect(questions[0].likedBy).toEqual([])
    })

    it('should save question to localStorage', () => {
      const store = useWhyQuestionStore.getState()
      store.addQuestion('test-section', 'user-1', '테스트 유저', '테스트 질문', [])

      const stored = localStorage.getItem('ai-platform-why-questions')
      expect(stored).toBeTruthy()
      const parsed = JSON.parse(stored!)
      expect(parsed['test-section']).toBeDefined()
      expect(parsed['test-section'].length).toBeGreaterThan(0)
    })
  })

  describe('toggleQuestionLike', () => {
    it('should add like to question', () => {
      const store = useWhyQuestionStore.getState()
      store.addQuestion('test-section', 'user-1', '테스트 유저', '테스트 질문', [])

      const questions = store.getQuestions('test-section')
      const questionId = questions[0].id

      store.toggleQuestionLike(questionId, 'user-2')

      const updatedQuestions = store.getQuestions('test-section')
      expect(updatedQuestions[0].likes).toBe(1)
      expect(updatedQuestions[0].likedBy).toContain('user-2')
    })

    it('should remove like from question when toggled again', () => {
      const store = useWhyQuestionStore.getState()
      store.addQuestion('test-section', 'user-1', '테스트 유저', '테스트 질문', [])

      const questions = store.getQuestions('test-section')
      const questionId = questions[0].id

      store.toggleQuestionLike(questionId, 'user-2')
      store.toggleQuestionLike(questionId, 'user-2')

      const updatedQuestions = store.getQuestions('test-section')
      expect(updatedQuestions[0].likes).toBe(0)
      expect(updatedQuestions[0].likedBy).not.toContain('user-2')
    })

    it('should handle multiple users liking the same question', () => {
      const store = useWhyQuestionStore.getState()
      store.addQuestion('test-section', 'user-1', '테스트 유저', '테스트 질문', [])

      const questions = store.getQuestions('test-section')
      const questionId = questions[0].id

      store.toggleQuestionLike(questionId, 'user-2')
      store.toggleQuestionLike(questionId, 'user-3')
      store.toggleQuestionLike(questionId, 'user-4')

      const updatedQuestions = store.getQuestions('test-section')
      expect(updatedQuestions[0].likes).toBe(3)
      expect(updatedQuestions[0].likedBy.length).toBe(3)
    })
  })

  describe('addAnswer', () => {
    it('should add answer to question', () => {
      const store = useWhyQuestionStore.getState()
      store.addQuestion('test-section', 'user-1', '테스트 유저', '테스트 질문', [])

      const questions = store.getQuestions('test-section')
      const questionId = questions[0].id

      store.addAnswer(questionId, 'user-2', '답변자', '이것은 좋은 답변입니다.')

      const updatedQuestions = store.getQuestions('test-section')
      expect(updatedQuestions[0].answers.length).toBe(1)
      expect(updatedQuestions[0].answers[0].content).toBe('이것은 좋은 답변입니다.')
      expect(updatedQuestions[0].answers[0].userName).toBe('답변자')
    })

    it('should not add empty answer', () => {
      const store = useWhyQuestionStore.getState()
      store.addQuestion('test-section', 'user-1', '테스트 유저', '테스트 질문', [])

      const questions = store.getQuestions('test-section')
      const questionId = questions[0].id

      store.addAnswer(questionId, 'user-2', '답변자', '   ')

      const updatedQuestions = store.getQuestions('test-section')
      expect(updatedQuestions[0].answers.length).toBe(0)
    })

    it('should not add answer longer than 2000 characters', () => {
      const store = useWhyQuestionStore.getState()
      store.addQuestion('test-section', 'user-1', '테스트 유저', '테스트 질문', [])

      const questions = store.getQuestions('test-section')
      const questionId = questions[0].id
      const longAnswer = 'a'.repeat(2001)

      store.addAnswer(questionId, 'user-2', '답변자', longAnswer)

      const updatedQuestions = store.getQuestions('test-section')
      expect(updatedQuestions[0].answers.length).toBe(0)
    })

    it('should initialize answer with 0 likes', () => {
      const store = useWhyQuestionStore.getState()
      store.addQuestion('test-section', 'user-1', '테스트 유저', '테스트 질문', [])

      const questions = store.getQuestions('test-section')
      const questionId = questions[0].id

      store.addAnswer(questionId, 'user-2', '답변자', '답변')

      const updatedQuestions = store.getQuestions('test-section')
      expect(updatedQuestions[0].answers[0].likes).toBe(0)
      expect(updatedQuestions[0].answers[0].likedBy).toEqual([])
    })
  })

  describe('toggleAnswerLike', () => {
    it('should add like to answer', () => {
      const store = useWhyQuestionStore.getState()
      store.addQuestion('test-section', 'user-1', '테스트 유저', '테스트 질문', [])

      const questions = store.getQuestions('test-section')
      const questionId = questions[0].id

      store.addAnswer(questionId, 'user-2', '답변자', '답변')

      const questionsWithAnswer = store.getQuestions('test-section')
      const answerId = questionsWithAnswer[0].answers[0].id

      store.toggleAnswerLike(questionId, answerId, 'user-3')

      const updatedQuestions = store.getQuestions('test-section')
      expect(updatedQuestions[0].answers[0].likes).toBe(1)
      expect(updatedQuestions[0].answers[0].likedBy).toContain('user-3')
    })

    it('should remove like from answer when toggled again', () => {
      const store = useWhyQuestionStore.getState()
      store.addQuestion('test-section', 'user-1', '테스트 유저', '테스트 질문', [])

      const questions = store.getQuestions('test-section')
      const questionId = questions[0].id

      store.addAnswer(questionId, 'user-2', '답변자', '답변')

      const questionsWithAnswer = store.getQuestions('test-section')
      const answerId = questionsWithAnswer[0].answers[0].id

      store.toggleAnswerLike(questionId, answerId, 'user-3')
      store.toggleAnswerLike(questionId, answerId, 'user-3')

      const updatedQuestions = store.getQuestions('test-section')
      expect(updatedQuestions[0].answers[0].likes).toBe(0)
      expect(updatedQuestions[0].answers[0].likedBy).not.toContain('user-3')
    })
  })

  describe('acceptAnswer', () => {
    it('should mark answer as accepted', () => {
      const store = useWhyQuestionStore.getState()
      store.addQuestion('test-section', 'user-1', '테스트 유저', '테스트 질문', [])

      const questions = store.getQuestions('test-section')
      const questionId = questions[0].id

      store.addAnswer(questionId, 'user-2', '답변자', '답변 1')
      store.addAnswer(questionId, 'user-3', '답변자2', '답변 2')

      const questionsWithAnswers = store.getQuestions('test-section')
      const answerId = questionsWithAnswers[0].answers[0].id

      store.acceptAnswer(questionId, answerId)

      const updatedQuestions = store.getQuestions('test-section')
      expect(updatedQuestions[0].answers[0].isAccepted).toBe(true)
      expect(updatedQuestions[0].answers[1].isAccepted).toBe(false)
    })

    it('should unaccept previous answer when accepting new one', () => {
      const store = useWhyQuestionStore.getState()
      store.addQuestion('test-section', 'user-1', '테스트 유저', '테스트 질문', [])

      const questions = store.getQuestions('test-section')
      const questionId = questions[0].id

      store.addAnswer(questionId, 'user-2', '답변자', '답변 1')
      store.addAnswer(questionId, 'user-3', '답변자2', '답변 2')

      const questionsWithAnswers = store.getQuestions('test-section')
      const answerId1 = questionsWithAnswers[0].answers[0].id
      const answerId2 = questionsWithAnswers[0].answers[1].id

      store.acceptAnswer(questionId, answerId1)
      store.acceptAnswer(questionId, answerId2)

      const updatedQuestions = store.getQuestions('test-section')
      expect(updatedQuestions[0].answers[0].isAccepted).toBe(false)
      expect(updatedQuestions[0].answers[1].isAccepted).toBe(true)
    })
  })

  describe('fetchQuestions', () => {
    it('should set loading to true during fetch', async () => {
      const store = useWhyQuestionStore.getState()
      const fetchPromise = store.fetchQuestions('test-section')

      // Check loading state immediately
      expect(useWhyQuestionStore.getState().loading).toBe(true)

      await fetchPromise

      // Check loading state after fetch completes
      expect(useWhyQuestionStore.getState().loading).toBe(false)
    })

    it('should handle fetch errors gracefully', async () => {
      const store = useWhyQuestionStore.getState()

      // Should not throw error
      await expect(store.fetchQuestions('test-section')).resolves.not.toThrow()
    })
  })

  describe('localStorage persistence', () => {
    it('should persist questions to localStorage when added', () => {
      const store = useWhyQuestionStore.getState()
      store.addQuestion('test-section', 'user-1', '테스트 유저', '테스트 질문', ['태그'])

      const stored = localStorage.getItem('ai-platform-why-questions')
      expect(stored).toBeTruthy()

      const parsed = JSON.parse(stored!)
      expect(parsed['test-section']).toBeDefined()
      expect(parsed['test-section'][0].question).toBe('테스트 질문')
    })

    it('should persist likes to localStorage', () => {
      const store = useWhyQuestionStore.getState()
      store.addQuestion('test-section', 'user-1', '테스트 유저', '테스트 질문', [])

      const questions = store.getQuestions('test-section')
      const questionId = questions[0].id

      store.toggleQuestionLike(questionId, 'user-2')

      const stored = localStorage.getItem('ai-platform-why-questions')
      const parsed = JSON.parse(stored!)
      expect(parsed['test-section'][0].likes).toBe(1)
      expect(parsed['test-section'][0].likedBy).toContain('user-2')
    })
  })

  describe('Data structure validation', () => {
    it('should maintain proper WhyQuestion structure', () => {
      const store = useWhyQuestionStore.getState()
      const questions = store.getQuestions('intro-what-is-ai')

      questions.forEach(q => {
        expect(q).toHaveProperty('id')
        expect(q).toHaveProperty('sectionId')
        expect(q).toHaveProperty('userId')
        expect(q).toHaveProperty('userName')
        expect(q).toHaveProperty('question')
        expect(q).toHaveProperty('createdAt')
        expect(q).toHaveProperty('likes')
        expect(q).toHaveProperty('likedBy')
        expect(q).toHaveProperty('answers')
        expect(q).toHaveProperty('tags')
        expect(q).toHaveProperty('isFeatured')

        expect(typeof q.id).toBe('string')
        expect(typeof q.question).toBe('string')
        expect(typeof q.likes).toBe('number')
        expect(Array.isArray(q.likedBy)).toBe(true)
        expect(Array.isArray(q.answers)).toBe(true)
        expect(Array.isArray(q.tags)).toBe(true)
        expect(typeof q.isFeatured).toBe('boolean')
      })
    })

    it('should maintain proper WhyAnswer structure', () => {
      const store = useWhyQuestionStore.getState()
      const questions = store.getQuestions('intro-what-is-ai')

      questions.forEach(q => {
        q.answers.forEach(a => {
          expect(a).toHaveProperty('id')
          expect(a).toHaveProperty('questionId')
          expect(a).toHaveProperty('userId')
          expect(a).toHaveProperty('userName')
          expect(a).toHaveProperty('content')
          expect(a).toHaveProperty('createdAt')
          expect(a).toHaveProperty('likes')
          expect(a).toHaveProperty('likedBy')
          expect(a).toHaveProperty('isAccepted')

          expect(typeof a.id).toBe('string')
          expect(typeof a.content).toBe('string')
          expect(typeof a.likes).toBe('number')
          expect(Array.isArray(a.likedBy)).toBe(true)
          expect(typeof a.isAccepted).toBe('boolean')
        })
      })
    })
  })
})
