import { create } from 'zustand'
import type { Discussion, Reply } from '../types/discussion'

interface DiscussionState {
  discussions: Map<string, Discussion[]>
  addDiscussion: (sectionId: string, userId: string, userName: string, content: string) => void
  addReply: (discussionId: string, userId: string, userName: string, content: string) => void
  toggleLike: (discussionId: string, userId: string) => void
  getDiscussions: (sectionId: string) => Discussion[]
}

const STORAGE_KEY = 'ai-platform-discussions'

// Sample discussions in Korean
const getSampleDiscussions = (): Map<string, Discussion[]> => {
  const sampleData: Discussion[] = [
    {
      id: 'sample-1',
      sectionId: 'intro-what-is-ai',
      userId: 'sample-user-1',
      userName: '김민수',
      content: '인공지능의 발전 속도가 정말 놀랍네요. 특히 ChatGPT 같은 대화형 AI가 나오면서 일상생활에서도 많이 활용되고 있는 것 같아요. 앞으로 어떤 분야에서 가장 큰 변화가 있을까요?',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
      likes: 5,
      likedBy: ['user-a', 'user-b', 'user-c', 'user-d', 'user-e'],
      replies: [
        {
          id: 'reply-1',
          discussionId: 'sample-1',
          userId: 'sample-user-2',
          userName: '이지은',
          content: '저는 의료 분야가 가장 큰 변화를 겪을 것 같아요. AI가 질병 진단과 신약 개발에 많은 도움을 줄 수 있을 것 같습니다.',
          createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
        },
      ],
    },
    {
      id: 'sample-2',
      sectionId: 'intro-what-is-ai',
      userId: 'sample-user-3',
      userName: '박준영',
      content: '머신러닝과 딥러닝의 차이가 처음에는 헷갈렸는데, 이 강의를 통해 명확하게 이해할 수 있었습니다. 딥러닝은 머신러닝의 한 분야로, 인공신경망을 사용한다는 점이 핵심이네요.',
      createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
      likes: 3,
      likedBy: ['user-x', 'user-y', 'user-z'],
      replies: [],
    },
    {
      id: 'sample-3',
      sectionId: 'intro-what-is-ai',
      userId: 'sample-user-4',
      userName: '최서연',
      content: 'AI 윤리에 대한 내용도 중요하다고 생각해요. 편향된 데이터로 학습하면 AI도 편향된 결과를 낼 수 있다는 점을 항상 염두에 두어야 할 것 같습니다.',
      createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(), // 10 minutes ago
      likes: 7,
      likedBy: ['user-1', 'user-2', 'user-3', 'user-4', 'user-5', 'user-6', 'user-7'],
      replies: [
        {
          id: 'reply-2',
          discussionId: 'sample-3',
          userId: 'sample-user-5',
          userName: '정민호',
          content: '맞아요. 공정성과 투명성이 정말 중요한 이슈인 것 같습니다.',
          createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
        },
        {
          id: 'reply-3',
          discussionId: 'sample-3',
          userId: 'sample-user-6',
          userName: '강하늘',
          content: 'AI 설명 가능성(Explainable AI)도 앞으로 더 발전해야 할 부분이라고 생각합니다.',
          createdAt: new Date(Date.now() - 1000 * 60 * 3).toISOString(), // 3 minutes ago
        },
      ],
    },
  ]

  const map = new Map<string, Discussion[]>()
  map.set('intro-what-is-ai', sampleData)
  return map
}

const loadFromStorage = (): Map<string, Discussion[]> => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      return new Map(Object.entries(parsed))
    }
  } catch (error) {
    console.error('Failed to load discussions from localStorage:', error)
  }
  return getSampleDiscussions()
}

const saveToStorage = (discussions: Map<string, Discussion[]>) => {
  try {
    const obj = Object.fromEntries(discussions.entries())
    localStorage.setItem(STORAGE_KEY, JSON.stringify(obj))
  } catch (error) {
    console.error('Failed to save discussions to localStorage:', error)
  }
}

export const useDiscussionStore = create<DiscussionState>((set, get) => ({
  discussions: loadFromStorage(),

  addDiscussion: (sectionId, userId, userName, content) => {
    const newDiscussion: Discussion = {
      id: `discussion-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      sectionId,
      userId,
      userName,
      content,
      createdAt: new Date().toISOString(),
      likes: 0,
      likedBy: [],
      replies: [],
    }

    set((state) => {
      const newDiscussions = new Map(state.discussions)
      const sectionDiscussions = newDiscussions.get(sectionId) || []
      newDiscussions.set(sectionId, [newDiscussion, ...sectionDiscussions])
      saveToStorage(newDiscussions)
      return { discussions: newDiscussions }
    })
  },

  addReply: (discussionId, userId, userName, content) => {
    const newReply: Reply = {
      id: `reply-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      discussionId,
      userId,
      userName,
      content,
      createdAt: new Date().toISOString(),
    }

    set((state) => {
      const newDiscussions = new Map(state.discussions)

      for (const [sectionId, discussions] of newDiscussions.entries()) {
        const updatedDiscussions = discussions.map((discussion) => {
          if (discussion.id === discussionId) {
            return {
              ...discussion,
              replies: [...discussion.replies, newReply],
            }
          }
          return discussion
        })
        newDiscussions.set(sectionId, updatedDiscussions)
      }

      saveToStorage(newDiscussions)
      return { discussions: newDiscussions }
    })
  },

  toggleLike: (discussionId, userId) => {
    set((state) => {
      const newDiscussions = new Map(state.discussions)

      for (const [sectionId, discussions] of newDiscussions.entries()) {
        const updatedDiscussions = discussions.map((discussion) => {
          if (discussion.id === discussionId) {
            const hasLiked = discussion.likedBy.includes(userId)
            return {
              ...discussion,
              likes: hasLiked ? discussion.likes - 1 : discussion.likes + 1,
              likedBy: hasLiked
                ? discussion.likedBy.filter((id) => id !== userId)
                : [...discussion.likedBy, userId],
            }
          }
          return discussion
        })
        newDiscussions.set(sectionId, updatedDiscussions)
      }

      saveToStorage(newDiscussions)
      return { discussions: newDiscussions }
    })
  },

  getDiscussions: (sectionId) => {
    const discussions = get().discussions.get(sectionId) || []
    return discussions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  },
}))
