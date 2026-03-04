export const SITE_NAME = 'AI 학습 플랫폼'
export const SITE_DESCRIPTION = '누구나 무료로 배울 수 있는 인공지능 학습 플랫폼'

export const DIFFICULTY_LABELS: Record<string, string> = {
  beginner: '입문',
  intermediate: '중급',
  advanced: '고급',
}

export const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: 'bg-green-100 text-green-800',
  intermediate: 'bg-yellow-100 text-yellow-800',
  advanced: 'bg-red-100 text-red-800',
}

// Certificate eligibility thresholds
export const CERT_MIN_COMPLETION_RATE = 90
export const CERT_MIN_QUIZ_SCORE = 60
