export interface UserProfile {
  id: string
  email: string
  name: string | null
  avatarUrl: string | null
  createdAt: string
  role: 'admin' | 'user'
}

export interface Progress {
  id: string
  userId: string
  sectionId: string
  completed: boolean
  completedAt: string | null
  quizScore: number | null
  quizAttempts: number
}
