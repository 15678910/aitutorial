export interface Course {
  id: string
  slug: string
  title: string
  description: string
  thumbnailUrl?: string
  orderNum: number
  isPublished: boolean
  estimatedHours: number
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  chapters: Chapter[]
}

export interface Chapter {
  id: string
  courseId: string
  slug: string
  title: string
  description: string
  orderNum: number
  sections: Section[]
}

export interface Section {
  id: string
  chapterId: string
  slug: string
  title: string
  content: string
  contentType: 'text' | 'video' | 'interactive'
  orderNum: number
  estimatedMinutes: number
  quizzes: Quiz[]
}

export interface Quiz {
  id: string
  sectionId: string
  type: 'multiple_choice' | 'true_false' | 'fill_blank'
  question: string
  options?: string[]
  correctAnswer: string
  explanation: string
  orderNum: number
}
