import { create } from 'zustand'
import { supabase } from '../lib/supabase'

const STORAGE_KEY = 'ai-learning-essays'

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

export interface Essay {
  id: string
  userId: string
  courseId: string
  chapterId: string
  prompt: string
  content: string
  status: 'submitted' | 'reviewing' | 'reviewed'
  averageScore?: number
  reviewCount: number
  createdAt: string
}

export interface PeerReview {
  id: string
  essayId: string
  reviewerId: string
  clarityScore: number
  accuracyScore: number
  depthScore: number
  feedback: string
  createdAt: string
}

export type EssayStatus = 'not_submitted' | 'submitted' | 'needs_reviews' | 'passed' | 'failed'

interface StoredData {
  essays: Record<string, Essay>
  reviews: Record<string, PeerReview[]>
}

interface EssayState {
  essays: Map<string, Essay>
  reviews: Map<string, PeerReview[]>
  loading: boolean
  submitEssay: (userId: string, courseId: string, chapterId: string, prompt: string, content: string) => Promise<boolean>
  fetchMyEssays: (userId: string) => Promise<void>
  fetchEssaysToReview: (userId: string, courseId: string) => Promise<Essay[]>
  submitReview: (essayId: string, reviewerId: string, clarity: number, accuracy: number, depth: number, feedback: string) => Promise<boolean>
  fetchReviewsForEssay: (essayId: string) => Promise<PeerReview[]>
  getEssayStatus: (courseId: string, chapterId: string) => EssayStatus
}

export const useEssayStore = create<EssayState>((set, get) => {
  const storedData = loadFromStorage<StoredData>(STORAGE_KEY, { essays: {}, reviews: {} })

  return {
    essays: new Map(Object.entries(storedData.essays)),
    reviews: new Map(Object.entries(storedData.reviews)),
    loading: false,

    submitEssay: async (userId: string, courseId: string, chapterId: string, prompt: string, content: string) => {
      const key = `${courseId}-${chapterId}`
      const newEssay: Essay = {
        id: `essay-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        userId,
        courseId,
        chapterId,
        prompt,
        content,
        status: 'submitted',
        reviewCount: 0,
        createdAt: new Date().toISOString(),
      }

      // Save to local state
      const updatedEssays = new Map(get().essays)
      updatedEssays.set(key, newEssay)
      set({ essays: updatedEssays })

      // Save to localStorage
      const storedData = loadFromStorage<StoredData>(STORAGE_KEY, { essays: {}, reviews: {} })
      storedData.essays[key] = newEssay
      saveToStorage(STORAGE_KEY, storedData)

      // Try to sync with Supabase
      try {
        const { error } = await supabase.from('essays').insert({
          id: newEssay.id,
          user_id: userId,
          course_id: courseId,
          chapter_id: chapterId,
          prompt,
          content,
          status: 'submitted',
        })
        return !error
      } catch {
        // DB sync failed, but localStorage has the data
        return true
      }
    },

    fetchMyEssays: async (userId: string) => {
      set({ loading: true })
      try {
        const { data } = await supabase
          .from('essays')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })

        if (data && data.length > 0) {
          const essaysMap = new Map<string, Essay>()
          data.forEach(essay => {
            const key = `${essay.course_id}-${essay.chapter_id}`
            essaysMap.set(key, {
              id: essay.id,
              userId: essay.user_id,
              courseId: essay.course_id,
              chapterId: essay.chapter_id,
              prompt: essay.prompt,
              content: essay.content,
              status: essay.status,
              reviewCount: 0,
              createdAt: essay.created_at,
            })
          })

          // Merge with local data
          const localData = loadFromStorage<StoredData>(STORAGE_KEY, { essays: {}, reviews: {} })
          Object.entries(localData.essays).forEach(([key, essay]) => {
            if (!essaysMap.has(key)) {
              essaysMap.set(key, essay)
            }
          })

          set({ essays: essaysMap })

          // Save merged data to localStorage
          const mergedEssays = Object.fromEntries(essaysMap)
          saveToStorage(STORAGE_KEY, { ...localData, essays: mergedEssays })
        }
      } catch {
        // DB not available - use localStorage data (already loaded in initial state)
      } finally {
        set({ loading: false })
      }
    },

    fetchEssaysToReview: async (userId: string, courseId: string) => {
      try {
        // Fetch essays that need reviews (not from current user, not already reviewed by user)
        const { data } = await supabase
          .from('essays')
          .select(`
            *,
            peer_reviews!left(reviewer_id)
          `)
          .eq('course_id', courseId)
          .neq('user_id', userId)
          .limit(3)

        if (data) {
          return data
            .filter(essay => !essay.peer_reviews.some((r: { reviewer_id: string }) => r.reviewer_id === userId))
            .map(essay => ({
              id: essay.id,
              userId: essay.user_id,
              courseId: essay.course_id,
              chapterId: essay.chapter_id,
              prompt: essay.prompt,
              content: essay.content,
              status: essay.status,
              reviewCount: essay.peer_reviews.length,
              createdAt: essay.created_at,
            }))
            .slice(0, 3)
        }
      } catch {
        // DB not available - return empty array
      }
      return []
    },

    submitReview: async (essayId: string, reviewerId: string, clarity: number, accuracy: number, depth: number, feedback: string) => {
      const newReview: PeerReview = {
        id: `review-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        essayId,
        reviewerId,
        clarityScore: clarity,
        accuracyScore: accuracy,
        depthScore: depth,
        feedback,
        createdAt: new Date().toISOString(),
      }

      // Save to local state
      const updatedReviews = new Map(get().reviews)
      const essayReviews = updatedReviews.get(essayId) || []
      essayReviews.push(newReview)
      updatedReviews.set(essayId, essayReviews)
      set({ reviews: updatedReviews })

      // Save to localStorage
      const storedData = loadFromStorage<StoredData>(STORAGE_KEY, { essays: {}, reviews: {} })
      storedData.reviews[essayId] = essayReviews
      saveToStorage(STORAGE_KEY, storedData)

      // Try to sync with Supabase
      try {
        const { error } = await supabase.from('peer_reviews').insert({
          id: newReview.id,
          essay_id: essayId,
          reviewer_id: reviewerId,
          clarity_score: clarity,
          accuracy_score: accuracy,
          depth_score: depth,
          feedback,
        })
        return !error
      } catch {
        // DB sync failed, but localStorage has the data
        return true
      }
    },

    fetchReviewsForEssay: async (essayId: string) => {
      try {
        const { data } = await supabase
          .from('peer_reviews')
          .select('*')
          .eq('essay_id', essayId)

        if (data && data.length > 0) {
          const reviews = data.map(review => ({
            id: review.id,
            essayId: review.essay_id,
            reviewerId: review.reviewer_id,
            clarityScore: review.clarity_score,
            accuracyScore: review.accuracy_score,
            depthScore: review.depth_score,
            feedback: review.feedback,
            createdAt: review.created_at,
          }))

          // Update local state
          const updatedReviews = new Map(get().reviews)
          updatedReviews.set(essayId, reviews)
          set({ reviews: updatedReviews })

          // Save to localStorage
          const storedData = loadFromStorage<StoredData>(STORAGE_KEY, { essays: {}, reviews: {} })
          storedData.reviews[essayId] = reviews
          saveToStorage(STORAGE_KEY, storedData)

          return reviews
        }
      } catch {
        // DB not available - use localStorage data
        const localData = loadFromStorage<StoredData>(STORAGE_KEY, { essays: {}, reviews: {} })
        return localData.reviews[essayId] || []
      }
      return []
    },

    getEssayStatus: (courseId: string, chapterId: string): EssayStatus => {
      const key = `${courseId}-${chapterId}`
      const essay = get().essays.get(key)

      if (!essay) return 'not_submitted'

      const reviews = get().reviews.get(essay.id) || []
      if (reviews.length === 0) return 'needs_reviews'

      // Calculate average score
      const totalScore = reviews.reduce((sum, review) => {
        return sum + (review.clarityScore + review.accuracyScore + review.depthScore) / 3
      }, 0)
      const averageScore = totalScore / reviews.length

      return averageScore >= 3.0 ? 'passed' : 'failed'
    },
  }
})
