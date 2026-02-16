import { create } from 'zustand'
import { supabase } from '../lib/supabase'
import type { QAQuestion, QAAnswer } from '../types/community'

interface QAFilter {
  tag?: string
  search?: string
  sort?: 'newest' | 'popular' | 'unanswered'
}

interface QAState {
  questions: QAQuestion[]
  loading: boolean
  getQuestions: (filter?: QAFilter) => QAQuestion[]
  getQuestion: (id: string) => QAQuestion | null
  addQuestion: (title: string, content: string, tags: string[], authorId: string, authorName: string) => void
  addAnswer: (questionId: string, content: string, authorId: string, authorName: string) => void
  acceptAnswer: (questionId: string, answerId: string, userId: string) => void
  toggleQuestionLike: (questionId: string, userId: string) => void
  toggleAnswerLike: (questionId: string, answerId: string, userId: string) => void
  incrementViews: (questionId: string) => void
}

const STORAGE_KEY = 'ai-platform-qa'

// localStorage helpers
function loadFromStorage<T>(key: string, defaultVal: T): T {
  try {
    const data = localStorage.getItem(key)
    if (data) return JSON.parse(data)
  } catch { /* ignore */ }
  return defaultVal
}

function saveToStorage(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch { /* quota exceeded, ignore */ }
}

const getSampleQuestions = (): QAQuestion[] => [
  {
    id: 'qa-1',
    title: 'RAG에서 청킹 사이즈는 얼마가 적절한가요?',
    content: 'RAG(Retrieval Augmented Generation) 파이프라인을 구축하고 있는데, 문서를 청킹할 때 적절한 사이즈가 궁금합니다. 토큰 기준으로 512가 좋은지, 1024가 좋은지, 아니면 의미 단위로 나누는 게 좋은지 경험 공유해주시면 감사하겠습니다.',
    tags: ['RAG', '벡터DB'],
    authorId: 'sample-user-1',
    authorName: '김민수',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    views: 42,
    likes: 8,
    likedBy: ['user-a', 'user-b', 'user-c', 'user-d', 'user-e', 'user-f', 'user-g', 'user-h'],
    acceptedAnswerId: null,
    answers: [
      {
        id: 'answer-1-1',
        questionId: 'qa-1',
        content: '경험적으로 512~1024 토큰이 가장 좋은 결과를 보입니다. 다만 문서 특성에 따라 다른데, 기술 문서는 더 큰 청크가, FAQ 같은 짧은 문서는 더 작은 청크가 좋습니다. 오버랩은 50~100 토큰 정도 주는 것을 추천합니다.',
        authorId: 'sample-user-5',
        authorName: '정민호',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
        likes: 5,
        likedBy: ['user-a', 'user-b', 'user-c', 'user-d', 'user-e'],
        isAccepted: false,
      },
      {
        id: 'answer-1-2',
        questionId: 'qa-1',
        content: 'LangChain의 RecursiveCharacterTextSplitter를 쓰면 의미 단위로 나눌 수 있어서 좋습니다. 제 경우에는 chunk_size=1000, overlap=200으로 설정했을 때 검색 정확도가 가장 높았습니다.',
        authorId: 'sample-user-6',
        authorName: '강하늘',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
        likes: 3,
        likedBy: ['user-f', 'user-g', 'user-h'],
        isAccepted: false,
      },
    ],
  },
  {
    id: 'qa-2',
    title: 'Scikit-learn vs PyTorch 초보자에게 뭐가 좋을까요?',
    content: 'ML 입문자인데 Scikit-learn과 PyTorch 중 어떤 것부터 배워야 할까요? 목표는 6개월 안에 간단한 분류 모델을 만들고 배포하는 것입니다.',
    tags: ['ML', 'Python'],
    authorId: 'sample-user-3',
    authorName: '박준영',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(),
    views: 89,
    likes: 15,
    likedBy: Array.from({ length: 15 }, (_, i) => `liker-q2-${i}`),
    acceptedAnswerId: 'answer-2-2',
    answers: [
      {
        id: 'answer-2-1',
        questionId: 'qa-2',
        content: 'Scikit-learn부터 시작하세요! API가 직관적이고, 전통적인 ML 알고리즘을 빠르게 실험해볼 수 있습니다. 데이터 전처리부터 모델 평가까지 일관된 인터페이스를 제공합니다.',
        authorId: 'sample-user-4',
        authorName: '최서연',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(),
        likes: 7,
        likedBy: Array.from({ length: 7 }, (_, i) => `liker-a21-${i}`),
        isAccepted: false,
      },
      {
        id: 'answer-2-2',
        questionId: 'qa-2',
        content: '6개월 목표라면 저도 Scikit-learn 추천합니다. 1~3개월: Scikit-learn으로 기초 ML, 4~5개월: PyTorch로 딥러닝 입문, 6개월: FastAPI나 Streamlit으로 배포. 이 순서가 효율적이에요.',
        authorId: 'sample-user-5',
        authorName: '정민호',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(),
        likes: 12,
        likedBy: Array.from({ length: 12 }, (_, i) => `liker-a22-${i}`),
        isAccepted: true,
      },
      {
        id: 'answer-2-3',
        questionId: 'qa-2',
        content: 'PyTorch가 요즘 트렌드이긴 하지만, 기초 없이 시작하면 텐서 연산에서 막힐 수 있습니다. Scikit-learn으로 ML 개념을 잡은 후 넘어가는 것이 좋습니다.',
        authorId: 'sample-user-9',
        authorName: '한지우',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
        likes: 4,
        likedBy: Array.from({ length: 4 }, (_, i) => `liker-a23-${i}`),
        isAccepted: false,
      },
    ],
  },
  {
    id: 'qa-3',
    title: 'Claude API 토큰 비용 절약 방법',
    content: 'Claude API를 사용하고 있는데, 토큰 비용이 꽤 나옵니다. 프롬프트 최적화 외에 비용을 절약할 수 있는 실질적인 방법이 있을까요?',
    tags: ['Claude', 'API'],
    authorId: 'sample-user-7',
    authorName: '윤서아',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    views: 56,
    likes: 10,
    likedBy: Array.from({ length: 10 }, (_, i) => `liker-q3-${i}`),
    acceptedAnswerId: null,
    answers: [
      {
        id: 'answer-3-1',
        questionId: 'qa-3',
        content: '1) 캐싱 레이어를 추가해서 동일 질의 반복 호출을 줄이세요. 2) Haiku 모델로 먼저 분류 후, 복잡한 것만 Opus로 보내는 라우팅 전략이 효과적입니다. 3) 시스템 프롬프트는 최대한 간결하게 유지하세요.',
        authorId: 'sample-user-10',
        authorName: '임도윤',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
        likes: 8,
        likedBy: Array.from({ length: 8 }, (_, i) => `liker-a31-${i}`),
        isAccepted: false,
      },
    ],
  },
  {
    id: 'qa-4',
    title: '딥러닝 GPU 없이 학습 가능한가요?',
    content: '학생이라 GPU가 없는데 딥러닝 프로젝트를 해야 합니다. CPU만으로도 학습이 가능한 방법이 있나요? Google Colab 무료 버전의 한계도 알고 싶습니다.',
    tags: ['딥러닝', 'GPU'],
    authorId: 'sample-user-11',
    authorName: '배수진',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    views: 23,
    likes: 6,
    likedBy: Array.from({ length: 6 }, (_, i) => `liker-q4-${i}`),
    acceptedAnswerId: null,
    answers: [],
  },
  {
    id: 'qa-5',
    title: 'AI 프로젝트 포트폴리오에 어떤 프로젝트를 넣어야 하나요?',
    content: 'AI/ML 엔지니어 취업을 준비하고 있는데, 포트폴리오에 어떤 종류의 프로젝트를 넣으면 좋을까요? 3~4개 정도의 프로젝트를 만들 계획입니다.',
    tags: ['포트폴리오', '취업'],
    authorId: 'sample-user-12',
    authorName: '오현석',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    views: 34,
    likes: 11,
    likedBy: Array.from({ length: 11 }, (_, i) => `liker-q5-${i}`),
    acceptedAnswerId: null,
    answers: [
      {
        id: 'answer-5-1',
        questionId: 'qa-5',
        content: '1) 데이터 수집~배포까지 End-to-End 프로젝트 1개, 2) 캐글 대회 Top 10% 1개, 3) 오픈소스 기여 1개, 4) 논문 구현 1개 - 이 조합이면 충분합니다. 각 프로젝트에 README, 데모, 블로그 포스팅을 꼭 추가하세요.',
        authorId: 'sample-user-5',
        authorName: '정민호',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
        likes: 9,
        likedBy: Array.from({ length: 9 }, (_, i) => `liker-a51-${i}`),
        isAccepted: false,
      },
      {
        id: 'answer-5-2',
        questionId: 'qa-5',
        content: '실무에서 가장 중요하게 보는 건 "문제 정의 → 해결" 과정입니다. 화려한 모델보다 왜 이 문제를 선택했고, 어떤 시도를 했으며, 결과를 어떻게 측정했는지가 중요합니다.',
        authorId: 'sample-user-9',
        authorName: '한지우',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        likes: 6,
        likedBy: Array.from({ length: 6 }, (_, i) => `liker-a52-${i}`),
        isAccepted: false,
      },
    ],
  },
]

const loadInitialQuestions = (): QAQuestion[] => {
  const stored = loadFromStorage<QAQuestion[]>(STORAGE_KEY, [])
  if (stored.length > 0) {
    return stored
  }
  return getSampleQuestions()
}

const saveQuestionsToStorage = (questions: QAQuestion[]) => {
  saveToStorage(STORAGE_KEY, questions)
}

export const useQAStore = create<QAState>((set, get) => ({
  questions: loadInitialQuestions(),
  loading: false,

  getQuestions: (filter?: QAFilter) => {
    let result = [...get().questions]

    if (filter?.tag) {
      result = result.filter((q) => q.tags.includes(filter.tag!))
    }
    if (filter?.search) {
      const search = filter.search.toLowerCase()
      result = result.filter(
        (q) =>
          q.title.toLowerCase().includes(search) ||
          q.content.toLowerCase().includes(search) ||
          q.tags.some((t) => t.toLowerCase().includes(search))
      )
    }

    const sort = filter?.sort ?? 'newest'
    switch (sort) {
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      case 'popular':
        result.sort((a, b) => b.likes - a.likes || b.views - a.views)
        break
      case 'unanswered':
        result = result.filter((q) => q.answers.length === 0)
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
    }

    return result
  },

  getQuestion: (id: string) => {
    return get().questions.find((q) => q.id === id) ?? null
  },

  addQuestion: (title: string, content: string, tags: string[], authorId: string, authorName: string) => {
    const newQuestion: QAQuestion = {
      id: `qa-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: title.trim(),
      content: content.trim(),
      tags,
      authorId,
      authorName,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      views: 0,
      likes: 0,
      likedBy: [],
      acceptedAnswerId: null,
      answers: [],
    }

    set((state) => {
      const newQuestions = [newQuestion, ...state.questions]
      saveQuestionsToStorage(newQuestions)
      return { questions: newQuestions }
    })

    try {
      supabase.from('qa_questions').insert({
        id: newQuestion.id,
        title: newQuestion.title,
        content: newQuestion.content,
        tags: newQuestion.tags,
        author_id: authorId,
        author_name: authorName,
        created_at: newQuestion.createdAt,
        updated_at: newQuestion.updatedAt,
      })
    } catch (error) {
      console.error('Failed to sync question to Supabase:', error)
    }
  },

  addAnswer: (questionId: string, content: string, authorId: string, authorName: string) => {
    const newAnswer: QAAnswer = {
      id: `answer-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      questionId,
      content: content.trim(),
      authorId,
      authorName,
      createdAt: new Date().toISOString(),
      likes: 0,
      likedBy: [],
      isAccepted: false,
    }

    set((state) => {
      const newQuestions = state.questions.map((q) => {
        if (q.id !== questionId) return q
        return {
          ...q,
          answers: [...q.answers, newAnswer],
          updatedAt: new Date().toISOString(),
        }
      })
      saveQuestionsToStorage(newQuestions)
      return { questions: newQuestions }
    })

    try {
      supabase.from('qa_answers').insert({
        id: newAnswer.id,
        question_id: questionId,
        content: newAnswer.content,
        author_id: authorId,
        author_name: authorName,
        created_at: newAnswer.createdAt,
      })
    } catch (error) {
      console.error('Failed to sync answer to Supabase:', error)
    }
  },

  acceptAnswer: (questionId: string, answerId: string, userId: string) => {
    set((state) => {
      const newQuestions = state.questions.map((q) => {
        if (q.id !== questionId) return q
        // Only the question author can accept
        if (q.authorId !== userId) return q
        return {
          ...q,
          acceptedAnswerId: answerId,
          answers: q.answers.map((a) => ({
            ...a,
            isAccepted: a.id === answerId,
          })),
          updatedAt: new Date().toISOString(),
        }
      })
      saveQuestionsToStorage(newQuestions)
      return { questions: newQuestions }
    })

    try {
      supabase
        .from('qa_questions')
        .update({ accepted_answer_id: answerId, updated_at: new Date().toISOString() })
        .eq('id', questionId)
    } catch (error) {
      console.error('Failed to sync accepted answer to Supabase:', error)
    }
  },

  toggleQuestionLike: (questionId: string, userId: string) => {
    set((state) => {
      const newQuestions = state.questions.map((q) => {
        if (q.id !== questionId) return q
        const wasLiked = q.likedBy.includes(userId)
        const newLikedBy = wasLiked
          ? q.likedBy.filter((id) => id !== userId)
          : [...q.likedBy, userId]
        return { ...q, likes: newLikedBy.length, likedBy: newLikedBy }
      })
      saveQuestionsToStorage(newQuestions)
      return { questions: newQuestions }
    })

    try {
      supabase.from('qa_question_likes').upsert({
        question_id: questionId,
        user_id: userId,
      })
    } catch (error) {
      console.error('Failed to sync question like to Supabase:', error)
    }
  },

  toggleAnswerLike: (questionId: string, answerId: string, userId: string) => {
    set((state) => {
      const newQuestions = state.questions.map((q) => {
        if (q.id !== questionId) return q
        return {
          ...q,
          answers: q.answers.map((a) => {
            if (a.id !== answerId) return a
            const wasLiked = a.likedBy.includes(userId)
            const newLikedBy = wasLiked
              ? a.likedBy.filter((id) => id !== userId)
              : [...a.likedBy, userId]
            return { ...a, likes: newLikedBy.length, likedBy: newLikedBy }
          }),
        }
      })
      saveQuestionsToStorage(newQuestions)
      return { questions: newQuestions }
    })

    try {
      supabase.from('qa_answer_likes').upsert({
        answer_id: answerId,
        user_id: userId,
      })
    } catch (error) {
      console.error('Failed to sync answer like to Supabase:', error)
    }
  },

  incrementViews: (questionId: string) => {
    set((state) => {
      const newQuestions = state.questions.map((q) => {
        if (q.id !== questionId) return q
        return { ...q, views: q.views + 1 }
      })
      saveQuestionsToStorage(newQuestions)
      return { questions: newQuestions }
    })

    try {
      supabase.rpc('increment_qa_views', { question_id: questionId })
    } catch (error) {
      console.error('Failed to sync view increment to Supabase:', error)
    }
  },
}))
