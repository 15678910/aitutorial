export type LearningLevel = 'beginner' | 'intermediate' | 'advanced'
export type LearningStyle = 'visual' | 'textual' | 'example-based'
export type GuideMode = 'local' | 'ai' | 'detecting'

export interface GuideMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  createdAt: string
  isTyping?: boolean
}

export interface DiagnosticQuestion {
  id: string
  question: string
  options: DiagnosticOption[]
  category: 'knowledge' | 'style' | 'preference'
}

export interface DiagnosticOption {
  label: string
  value: string
  levelScore?: Partial<Record<LearningLevel, number>>
  styleScore?: Partial<Record<LearningStyle, number>>
}

export interface DiagnosticResult {
  level: LearningLevel
  style: LearningStyle
  scores: Record<LearningLevel, number>
  styleScores: Record<LearningStyle, number>
  completedAt: string
}

export interface SectionContext {
  sectionId: string
  sectionTitle: string
  chapterTitle: string
  courseSlug: string
  sectionContent: string
}

export interface ChatRequest {
  message: string
  sectionContext: SectionContext
  conversationHistory: Pick<GuideMessage, 'role' | 'content'>[]
  diagnosticResult?: DiagnosticResult
  mode?: 'chat' | 'health'
}

export interface ChatResponse {
  message: string
  mode: 'ai'
  error?: string
}
