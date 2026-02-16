import { create } from 'zustand'
import { supabase } from '../lib/supabase'
import type { WhyQuestion, WhyAnswer } from '../types/whyQuestion'

interface WhyQuestionState {
  questions: Map<string, WhyQuestion[]>
  loading: boolean
  fetchQuestions: (sectionId: string) => Promise<void>
  addQuestion: (sectionId: string, userId: string, userName: string, question: string, tags: string[]) => Promise<void>
  toggleQuestionLike: (questionId: string, userId: string) => Promise<void>
  toggleAnswerLike: (questionId: string, answerId: string, userId: string) => Promise<void>
  addAnswer: (questionId: string, userId: string, userName: string, content: string) => Promise<void>
  acceptAnswer: (questionId: string, answerId: string) => Promise<void>
  getQuestions: (sectionId: string) => WhyQuestion[]
}

const STORAGE_KEY = 'ai-platform-why-questions'

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

// Sample questions in Korean
const getSampleQuestions = (): Map<string, WhyQuestion[]> => {
  const sampleData: WhyQuestion[] = [
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
          content: 'AI는 이미 우리 일상에 깊숙이 들어와 있어요. 스마트폰 추천, 넷플릭스 알고리즘, 자율주행차 등 모든 곳에서 AI가 작동하고 있습니다. 프로그래밍을 못해도 AI의 원리와 한계를 이해하면 더 현명하게 기술을 활용할 수 있어요.',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
          likes: 8,
          likedBy: ['user-x', 'user-y', 'user-z', 'user-w', 'user-v', 'user-u', 'user-t', 'user-s'],
          isAccepted: true,
        },
        {
          id: 'answer-2',
          questionId: 'why-sample-1',
          userId: 'sample-user-3',
          userName: '박데이터',
          content: 'AI 리터러시(AI literacy)는 21세기 필수 역량이에요. 마치 읽고 쓰기를 배우듯이, AI를 이해하는 것은 미래 사회에서 살아가기 위한 기본 소양입니다.',
          createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
          likes: 5,
          likedBy: ['user-1', 'user-2', 'user-3', 'user-4', 'user-5'],
          isAccepted: false,
        },
      ],
      tags: ['실생활', '기초', '미래'],
      isFeatured: true,
    },
    {
      id: 'why-sample-2',
      sectionId: 'intro-what-is-ai',
      userId: 'sample-user-4',
      userName: '최궁금',
      question: '왜 딥러닝이 갑자기 유명해졌나요? 예전에는 왜 잘 안 됐던 건가요?',
      createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      likes: 6,
      likedBy: ['user-a', 'user-b', 'user-c', 'user-d', 'user-e', 'user-f'],
      answers: [
        {
          id: 'answer-3',
          questionId: 'why-sample-2',
          userId: 'sample-user-5',
          userName: '정교수',
          content: '세 가지 이유가 있어요: 1) 빅데이터의 등장 (인터넷에서 엄청난 양의 데이터 수집 가능), 2) GPU의 발전 (병렬 연산 능력 향상), 3) 알고리즘 개선 (ReLU, Dropout 등). 2000년대 초반까지는 이런 조건이 갖춰지지 않았어요.',
          createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
          likes: 4,
          likedBy: ['user-p', 'user-q', 'user-r', 'user-s'],
          isAccepted: false,
        },
      ],
      tags: ['원리', '기초'],
      isFeatured: false,
    },
    {
      id: 'why-sample-3',
      sectionId: 'intro-what-is-ai',
      userId: 'sample-user-6',
      userName: '강미래',
      question: '왜 AI 윤리가 중요한가요? 그냥 기술만 배우면 안 되나요?',
      createdAt: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
      likes: 9,
      likedBy: ['user-1', 'user-2', 'user-3', 'user-4', 'user-5', 'user-6', 'user-7', 'user-8', 'user-9'],
      answers: [],
      tags: ['윤리', '미래'],
      isFeatured: false,
    },
  ]

  const map = new Map<string, WhyQuestion[]>()
  map.set('intro-what-is-ai', sampleData)
  return map
}

const loadInitialQuestions = (): Map<string, WhyQuestion[]> => {
  const stored = loadFromStorage<Record<string, WhyQuestion[]>>(STORAGE_KEY, {})
  if (Object.keys(stored).length > 0) {
    return new Map(Object.entries(stored))
  }
  // Return sample data if localStorage is empty
  return getSampleQuestions()
}

const saveQuestionsToStorage = (questions: Map<string, WhyQuestion[]>) => {
  const obj = Object.fromEntries(questions.entries())
  saveToStorage(STORAGE_KEY, obj)
}

export const useWhyQuestionStore = create<WhyQuestionState>((set, get) => ({
  questions: loadInitialQuestions(),
  loading: false,

  fetchQuestions: async (sectionId: string) => {
    set({ loading: true })
    try {
      // Try to fetch from Supabase first
      const { data: questionsData } = await supabase
        .from('why_questions')
        .select('*')
        .eq('section_id', sectionId)
        .order('created_at', { ascending: false })

      if (questionsData && questionsData.length > 0) {
        // Fetch answers for all questions
        const questionIds = questionsData.map(q => q.id)
        const { data: answersData } = await supabase
          .from('why_answers')
          .select('*')
          .in('question_id', questionIds)
          .order('created_at', { ascending: true })

        // Map answers to questions
        const answersByQuestionId = new Map<string, WhyAnswer[]>()
        if (answersData) {
          answersData.forEach(answer => {
            const answers = answersByQuestionId.get(answer.question_id) || []
            answers.push({
              id: answer.id,
              questionId: answer.question_id,
              userId: answer.user_id,
              userName: answer.user_name,
              content: answer.content,
              createdAt: answer.created_at,
              likes: answer.likes || 0,
              likedBy: answer.liked_by || [],
              isAccepted: answer.is_accepted || false,
            })
            answersByQuestionId.set(answer.question_id, answers)
          })
        }

        // Fetch likes from junction table
        const { data: questionLikesData } = await supabase
          .from('why_question_likes')
          .select('question_id, user_id')
          .in('question_id', questionIds)

        const likesByQuestionId = new Map<string, string[]>()
        if (questionLikesData) {
          questionLikesData.forEach(like => {
            const likes = likesByQuestionId.get(like.question_id) || []
            likes.push(like.user_id)
            likesByQuestionId.set(like.question_id, likes)
          })
        }

        // Combine questions with their answers and likes
        const questions: WhyQuestion[] = questionsData.map(q => {
          const likedBy = likesByQuestionId.get(q.id) || q.liked_by || []
          return {
            id: q.id,
            sectionId: q.section_id,
            userId: q.user_id,
            userName: q.user_name,
            question: q.question,
            createdAt: q.created_at,
            likes: likedBy.length,
            likedBy: likedBy,
            answers: answersByQuestionId.get(q.id) || [],
            tags: q.tags || [],
            isFeatured: q.is_featured || false,
          }
        })

        // Update store and localStorage
        set((state) => {
          const newQuestions = new Map(state.questions)
          newQuestions.set(sectionId, questions)
          saveQuestionsToStorage(newQuestions)
          return { questions: newQuestions }
        })
      }
    } catch (error) {
      console.error('Failed to fetch why questions from Supabase:', error)
      // Fallback to localStorage (already loaded in initial state)
    } finally {
      set({ loading: false })
    }
  },

  addQuestion: async (sectionId, userId, userName, question, tags) => {
    // Validate question length
    const trimmedQuestion = question.trim()
    if (trimmedQuestion.length === 0 || trimmedQuestion.length > 500) return

    const newQuestion: WhyQuestion = {
      id: `why-question-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      sectionId,
      userId,
      userName,
      question: trimmedQuestion,
      createdAt: new Date().toISOString(),
      likes: 0,
      likedBy: [],
      answers: [],
      tags,
      isFeatured: false,
    }

    // Update localStorage immediately
    set((state) => {
      const newQuestions = new Map(state.questions)
      const sectionQuestions = newQuestions.get(sectionId) || []
      newQuestions.set(sectionId, [newQuestion, ...sectionQuestions])
      saveQuestionsToStorage(newQuestions)
      return { questions: newQuestions }
    })

    // Try to sync with Supabase
    try {
      await supabase.from('why_questions').insert({
        id: newQuestion.id,
        section_id: sectionId,
        user_id: userId,
        user_name: userName,
        question: trimmedQuestion,
        likes: 0,
        liked_by: [],
        tags,
        is_featured: false,
        created_at: newQuestion.createdAt,
      })
    } catch (error) {
      console.error('Failed to sync why question to Supabase:', error)
      // localStorage already has the data
    }
  },

  toggleQuestionLike: async (questionId, userId) => {
    let hasLiked = false

    // Update localStorage immediately (optimistic)
    set((state) => {
      const newQuestions = new Map(state.questions)

      for (const [sectionId, questions] of newQuestions.entries()) {
        const updatedQuestions = questions.map((question) => {
          if (question.id === questionId) {
            hasLiked = question.likedBy.includes(userId)
            const newLikedBy = hasLiked
              ? question.likedBy.filter((id) => id !== userId)
              : [...question.likedBy, userId]

            return {
              ...question,
              likes: newLikedBy.length,
              likedBy: newLikedBy,
            }
          }
          return question
        })
        newQuestions.set(sectionId, updatedQuestions)
      }

      saveQuestionsToStorage(newQuestions)
      return { questions: newQuestions }
    })

    // Sync with Supabase using junction table
    try {
      if (hasLiked) {
        // Remove like
        await supabase
          .from('why_question_likes')
          .delete()
          .eq('question_id', questionId)
          .eq('user_id', userId)
      } else {
        // Add like
        await supabase
          .from('why_question_likes')
          .insert({
            question_id: questionId,
            user_id: userId,
          })
      }

      // Update the likes count on the why_questions table
      const { count } = await supabase
        .from('why_question_likes')
        .select('*', { count: 'exact', head: true })
        .eq('question_id', questionId)

      await supabase
        .from('why_questions')
        .update({
          likes: count || 0,
          updated_at: new Date().toISOString(),
        })
        .eq('id', questionId)
    } catch (error) {
      console.error('Failed to sync question like toggle to Supabase:', error)
      // localStorage already has the data
    }
  },

  toggleAnswerLike: async (questionId, answerId, userId) => {
    let hasLiked = false

    // Update localStorage immediately (optimistic)
    set((state) => {
      const newQuestions = new Map(state.questions)

      for (const [sectionId, questions] of newQuestions.entries()) {
        const updatedQuestions = questions.map((question) => {
          if (question.id === questionId) {
            const updatedAnswers = question.answers.map((answer) => {
              if (answer.id === answerId) {
                hasLiked = answer.likedBy.includes(userId)
                const newLikedBy = hasLiked
                  ? answer.likedBy.filter((id) => id !== userId)
                  : [...answer.likedBy, userId]

                return {
                  ...answer,
                  likes: newLikedBy.length,
                  likedBy: newLikedBy,
                }
              }
              return answer
            })

            return {
              ...question,
              answers: updatedAnswers,
            }
          }
          return question
        })
        newQuestions.set(sectionId, updatedQuestions)
      }

      saveQuestionsToStorage(newQuestions)
      return { questions: newQuestions }
    })

    // Sync with Supabase
    try {
      if (hasLiked) {
        // Remove like
        await supabase
          .from('why_answer_likes')
          .delete()
          .eq('answer_id', answerId)
          .eq('user_id', userId)
      } else {
        // Add like
        await supabase
          .from('why_answer_likes')
          .insert({
            answer_id: answerId,
            user_id: userId,
          })
      }

      // Update the likes count on the why_answers table
      const { count } = await supabase
        .from('why_answer_likes')
        .select('*', { count: 'exact', head: true })
        .eq('answer_id', answerId)

      await supabase
        .from('why_answers')
        .update({
          likes: count || 0,
          updated_at: new Date().toISOString(),
        })
        .eq('id', answerId)
    } catch (error) {
      console.error('Failed to sync answer like toggle to Supabase:', error)
      // localStorage already has the data
    }
  },

  addAnswer: async (questionId, userId, userName, content) => {
    // Validate content length
    const trimmedContent = content.trim()
    if (trimmedContent.length === 0 || trimmedContent.length > 2000) return

    const newAnswer: WhyAnswer = {
      id: `why-answer-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      questionId,
      userId,
      userName,
      content: trimmedContent,
      createdAt: new Date().toISOString(),
      likes: 0,
      likedBy: [],
      isAccepted: false,
    }

    // Update localStorage immediately
    set((state) => {
      const newQuestions = new Map(state.questions)

      for (const [sectionId, questions] of newQuestions.entries()) {
        const updatedQuestions = questions.map((question) => {
          if (question.id === questionId) {
            return {
              ...question,
              answers: [...question.answers, newAnswer],
            }
          }
          return question
        })
        newQuestions.set(sectionId, updatedQuestions)
      }

      saveQuestionsToStorage(newQuestions)
      return { questions: newQuestions }
    })

    // Try to sync with Supabase
    try {
      await supabase.from('why_answers').insert({
        id: newAnswer.id,
        question_id: questionId,
        user_id: userId,
        user_name: userName,
        content: trimmedContent,
        likes: 0,
        liked_by: [],
        is_accepted: false,
        created_at: newAnswer.createdAt,
      })
    } catch (error) {
      console.error('Failed to sync why answer to Supabase:', error)
      // localStorage already has the data
    }
  },

  acceptAnswer: async (questionId, answerId) => {
    // Update localStorage immediately
    set((state) => {
      const newQuestions = new Map(state.questions)

      for (const [sectionId, questions] of newQuestions.entries()) {
        const updatedQuestions = questions.map((question) => {
          if (question.id === questionId) {
            const updatedAnswers = question.answers.map((answer) => ({
              ...answer,
              isAccepted: answer.id === answerId,
            }))

            return {
              ...question,
              answers: updatedAnswers,
            }
          }
          return question
        })
        newQuestions.set(sectionId, updatedQuestions)
      }

      saveQuestionsToStorage(newQuestions)
      return { questions: newQuestions }
    })

    // Sync with Supabase
    try {
      // First, unaccept all answers for this question
      await supabase
        .from('why_answers')
        .update({ is_accepted: false })
        .eq('question_id', questionId)

      // Then, accept the selected answer
      await supabase
        .from('why_answers')
        .update({ is_accepted: true })
        .eq('id', answerId)
    } catch (error) {
      console.error('Failed to sync answer acceptance to Supabase:', error)
      // localStorage already has the data
    }
  },

  getQuestions: (sectionId) => {
    const questions = get().questions.get(sectionId) || []
    return questions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  },
}))
