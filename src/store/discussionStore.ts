import { create } from 'zustand'
import { supabase } from '../lib/supabase'
import type { Discussion, Reply } from '../types/discussion'

interface DiscussionState {
  discussions: Map<string, Discussion[]>
  loading: boolean
  currentPage: Map<string, number>
  fetchDiscussions: (sectionId: string) => Promise<void>
  addDiscussion: (sectionId: string, userId: string, userName: string, content: string) => Promise<void>
  addReply: (discussionId: string, userId: string, userName: string, content: string) => Promise<void>
  toggleLike: (discussionId: string, userId: string) => Promise<void>
  getDiscussions: (sectionId: string) => Discussion[]
  getPagedDiscussions: (sectionId: string, page: number, pageSize?: number) => { discussions: Discussion[], totalPages: number, totalCount: number }
  setCurrentPage: (sectionId: string, page: number) => void
}

const STORAGE_KEY = 'ai-platform-discussions'

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

const loadInitialDiscussions = (): Map<string, Discussion[]> => {
  const stored = loadFromStorage<Record<string, Discussion[]>>(STORAGE_KEY, {})
  if (Object.keys(stored).length > 0) {
    return new Map(Object.entries(stored))
  }
  // Return sample data if localStorage is empty
  return getSampleDiscussions()
}

const saveDiscussionsToStorage = (discussions: Map<string, Discussion[]>) => {
  const obj = Object.fromEntries(discussions.entries())
  saveToStorage(STORAGE_KEY, obj)
}

export const useDiscussionStore = create<DiscussionState>((set, get) => ({
  discussions: loadInitialDiscussions(),
  loading: false,
  currentPage: new Map(),

  fetchDiscussions: async (sectionId: string) => {
    set({ loading: true })
    try {
      // Try to fetch from Supabase first
      const { data: discussionsData } = await supabase
        .from('discussions')
        .select('*')
        .eq('section_id', sectionId)
        .order('created_at', { ascending: false })

      if (discussionsData && discussionsData.length > 0) {
        // Fetch replies for all discussions
        const discussionIds = discussionsData.map(d => d.id)
        const { data: repliesData } = await supabase
          .from('replies')
          .select('*')
          .in('discussion_id', discussionIds)
          .order('created_at', { ascending: true })

        // Map replies to discussions
        const repliesByDiscussionId = new Map<string, Reply[]>()
        if (repliesData) {
          repliesData.forEach(reply => {
            const replies = repliesByDiscussionId.get(reply.discussion_id) || []
            replies.push({
              id: reply.id,
              discussionId: reply.discussion_id,
              userId: reply.user_id,
              userName: reply.user_name,
              content: reply.content,
              createdAt: reply.created_at,
            })
            repliesByDiscussionId.set(reply.discussion_id, replies)
          })
        }

        // Fetch likes from junction table
        const { data: likesData } = await supabase
          .from('discussion_likes')
          .select('discussion_id, user_id')
          .in('discussion_id', discussionIds)

        const likesByDiscussionId = new Map<string, string[]>()
        if (likesData) {
          likesData.forEach(like => {
            const likes = likesByDiscussionId.get(like.discussion_id) || []
            likes.push(like.user_id)
            likesByDiscussionId.set(like.discussion_id, likes)
          })
        }

        // Combine discussions with their replies and likes
        const discussions: Discussion[] = discussionsData.map(d => {
          const likedBy = likesByDiscussionId.get(d.id) || d.liked_by || []
          return {
            id: d.id,
            sectionId: d.section_id,
            userId: d.user_id,
            userName: d.user_name,
            content: d.content,
            createdAt: d.created_at,
            likes: likedBy.length,
            likedBy: likedBy,
            replies: repliesByDiscussionId.get(d.id) || [],
          }
        })

        // Update store and localStorage
        set((state) => {
          const newDiscussions = new Map(state.discussions)
          newDiscussions.set(sectionId, discussions)
          saveDiscussionsToStorage(newDiscussions)
          return { discussions: newDiscussions }
        })
      }
    } catch (error) {
      console.error('Failed to fetch discussions from Supabase:', error)
      // Fallback to localStorage (already loaded in initial state)
    } finally {
      set({ loading: false })
    }
  },

  addDiscussion: async (sectionId, userId, userName, content) => {
    // Validate content length
    const trimmedContent = content.trim()
    if (trimmedContent.length === 0 || trimmedContent.length > 5000) return

    const newDiscussion: Discussion = {
      id: `discussion-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      sectionId,
      userId,
      userName,
      content: trimmedContent,
      createdAt: new Date().toISOString(),
      likes: 0,
      likedBy: [],
      replies: [],
    }

    // Update localStorage immediately
    set((state) => {
      const newDiscussions = new Map(state.discussions)
      const sectionDiscussions = newDiscussions.get(sectionId) || []
      newDiscussions.set(sectionId, [newDiscussion, ...sectionDiscussions])
      saveDiscussionsToStorage(newDiscussions)
      return { discussions: newDiscussions }
    })

    // Try to sync with Supabase
    try {
      await supabase.from('discussions').insert({
        id: newDiscussion.id,
        section_id: sectionId,
        user_id: userId,
        user_name: userName,
        content: content,
        likes: 0,
        liked_by: [],
        created_at: newDiscussion.createdAt,
      })
    } catch (error) {
      console.error('Failed to sync discussion to Supabase:', error)
      // localStorage already has the data
    }
  },

  addReply: async (discussionId, userId, userName, content) => {
    // Validate content length
    const trimmedContent = content.trim()
    if (trimmedContent.length === 0 || trimmedContent.length > 2000) return

    const newReply: Reply = {
      id: `reply-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      discussionId,
      userId,
      userName,
      content: trimmedContent,
      createdAt: new Date().toISOString(),
    }

    // Update localStorage immediately
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

      saveDiscussionsToStorage(newDiscussions)
      return { discussions: newDiscussions }
    })

    // Try to sync with Supabase
    try {
      await supabase.from('replies').insert({
        id: newReply.id,
        discussion_id: discussionId,
        user_id: userId,
        user_name: userName,
        content: content,
        created_at: newReply.createdAt,
      })
    } catch (error) {
      console.error('Failed to sync reply to Supabase:', error)
      // localStorage already has the data
    }
  },

  toggleLike: async (discussionId, userId) => {
    let hasLiked = false

    // Update localStorage immediately (optimistic)
    set((state) => {
      const newDiscussions = new Map(state.discussions)

      for (const [sectionId, discussions] of newDiscussions.entries()) {
        const updatedDiscussions = discussions.map((discussion) => {
          if (discussion.id === discussionId) {
            hasLiked = discussion.likedBy.includes(userId)
            const newLikedBy = hasLiked
              ? discussion.likedBy.filter((id) => id !== userId)
              : [...discussion.likedBy, userId]

            return {
              ...discussion,
              likes: newLikedBy.length,
              likedBy: newLikedBy,
            }
          }
          return discussion
        })
        newDiscussions.set(sectionId, updatedDiscussions)
      }

      saveDiscussionsToStorage(newDiscussions)
      return { discussions: newDiscussions }
    })

    // Sync with Supabase using junction table
    try {
      if (hasLiked) {
        // Remove like
        await supabase
          .from('discussion_likes')
          .delete()
          .eq('discussion_id', discussionId)
          .eq('user_id', userId)
      } else {
        // Add like
        await supabase
          .from('discussion_likes')
          .insert({
            discussion_id: discussionId,
            user_id: userId,
          })
      }

      // Update the likes count on the discussions table
      const { count } = await supabase
        .from('discussion_likes')
        .select('*', { count: 'exact', head: true })
        .eq('discussion_id', discussionId)

      await supabase
        .from('discussions')
        .update({
          likes: count || 0,
          updated_at: new Date().toISOString(),
        })
        .eq('id', discussionId)
    } catch (error) {
      console.error('Failed to sync like toggle to Supabase:', error)
      // localStorage already has the data
    }
  },

  getDiscussions: (sectionId) => {
    const discussions = get().discussions.get(sectionId) || []
    return discussions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  },

  getPagedDiscussions: (sectionId: string, page: number = 1, pageSize: number = 20) => {
    const discussions = get().discussions.get(sectionId) || []
    const sorted = [...discussions].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    const totalCount = sorted.length
    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize))
    const start = (page - 1) * pageSize
    const end = start + pageSize
    return {
      discussions: sorted.slice(start, end),
      totalPages,
      totalCount,
    }
  },

  setCurrentPage: (sectionId: string, page: number) => {
    set((state) => {
      const newPages = new Map(state.currentPage)
      newPages.set(sectionId, page)
      return { currentPage: newPages }
    })
  },
}))
