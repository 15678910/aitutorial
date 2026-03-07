export interface AdminKPIData {
  totalUsers: number
  totalUsersDelta: number
  dailyActiveUsers: number
  dailyActiveUsersDelta: number
  completionRate: number
  completionRateDelta: number
  avgQuizScore: number | null
  avgQuizScoreDelta: number | null
  totalInquiries: number
  pendingInquiries: number
}

export interface TimeSeriesPoint {
  date: string  // YYYY-MM-DD
  value: number
}

export interface CourseAnalytics {
  slug: string
  title: string
  icon: string
  difficulty: string
  totalSections: number
  completedSections: number
  completionRate: number
  learnerCount: number
  avgQuizScore: number | null
}

export interface AdminUserRow {
  id: string
  email: string
  name: string | null
  role: string
  createdAt: string
  completedSections: number
  avgQuizScore: number | null
  lastActivity: string | null
}

export interface EditableCourse {
  slug: string
  title: string
  description: string
  icon: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  estimatedHours: number
  isPublished: boolean
  chapters: EditableChapter[]
  isDirty: boolean
}

export interface EditableChapter {
  id: string
  slug: string
  title: string
  description: string
  orderNum: number
  sections: EditableSection[]
}

export interface EditableSection {
  id: string
  slug: string
  title: string
  content: string
  contentType: 'text' | 'video' | 'interactive'
  estimatedMinutes: number
  orderNum: number
  quizzes: EditableQuiz[]
}

export interface EditableQuiz {
  id: string
  type: 'multiple_choice' | 'true_false' | 'fill_blank'
  question: string
  options?: string[]
  correctAnswer: string
  explanation: string
  orderNum: number
}

export type AdminPage = 'overview' | 'users' | 'content' | 'monitoring' | 'partners'

export interface AdminSidebarItem {
  key: AdminPage
  label: string
  icon: string
  path: string
}

export interface RecentActivity {
  id: string
  type: 'signup' | 'completion' | 'quiz' | 'discussion'
  userName: string
  description: string
  timestamp: string
}

export interface SystemStatus {
  supabaseConnected: boolean
  responseTimeMs: number
  activeUsers: number
  errorRate: number
}
