interface Badge {
  id: string
  icon: string
  title: string
  description: string
  color: string
}

const BADGES: Badge[] = [
  { id: 'first-section', icon: '🌱', title: '첫 발자국', description: '첫 번째 섹션 완료', color: '#22c55e' },
  { id: 'first-quiz', icon: '🎯', title: '퀴즈 도전자', description: '첫 퀴즈 풀기', color: '#3b82f6' },
  { id: 'perfect-quiz', icon: '💎', title: '완벽한 답', description: '퀴즈 100점 달성', color: '#8b5cf6' },
  { id: 'chapter-done', icon: '📖', title: '챕터 마스터', description: '챕터 1개 완료', color: '#f59e0b' },
  { id: 'streak-3', icon: '🔥', title: '3일 연속', description: '3일 연속 학습', color: '#ef4444' },
  { id: 'streak-7', icon: '⚡', title: '일주일 불꽃', description: '7일 연속 학습', color: '#f97316' },
  { id: 'half-course', icon: '🏔️', title: '중반 돌파', description: '코스 50% 완료', color: '#06b6d4' },
  { id: 'course-done', icon: '🎓', title: '졸업생', description: '코스 완료', color: '#10b981' },
  { id: 'multi-course', icon: '🌟', title: '다재다능', description: '2개 코스 시작', color: '#eab308' },
  { id: 'code-master', icon: '💻', title: '코딩 마스터', description: '코드 실습 완료', color: '#6366f1' },
]

export function getBadgesForProgress(completedSections: Set<string>, quizScores: Map<string, number>): string[] {
  const earned: string[] = []
  if (completedSections.size >= 1) earned.push('first-section')
  if (quizScores.size >= 1) earned.push('first-quiz')
  if ([...quizScores.values()].some(s => s === 100)) earned.push('perfect-quiz')
  if (completedSections.size >= 3) earned.push('chapter-done')
  if (completedSections.size >= 8) earned.push('half-course')
  if (completedSections.size >= 15) earned.push('course-done')
  return earned
}

interface AchievementBadgeProps {
  badgeId: string
  earned: boolean
  size?: 'sm' | 'md' | 'lg'
}

export default function AchievementBadge({ badgeId, earned, size = 'md' }: AchievementBadgeProps) {
  const badge = BADGES.find(b => b.id === badgeId)
  if (!badge) return null

  const sizes = {
    sm: 'w-12 h-12 text-lg',
    md: 'w-16 h-16 text-2xl',
    lg: 'w-20 h-20 text-3xl',
  }

  return (
    <div className="flex flex-col items-center gap-1 group">
      <div
        className={`${sizes[size]} rounded-2xl flex items-center justify-center transition-all ${
          earned
            ? 'shadow-lg hover:scale-110 cursor-pointer'
            : 'grayscale opacity-30'
        }`}
        style={earned ? { backgroundColor: badge.color + '20', border: `2px solid ${badge.color}` } : { backgroundColor: '#f3f4f6', border: '2px solid #e5e7eb' }}
        title={badge.description}
        role="img"
        aria-label={`${badge.title}: ${badge.description}${earned ? ' (획득함)' : ' (미획득)'}`}
      >
        <span aria-hidden="true">{badge.icon}</span>
      </div>
      <span className={`text-xs font-bold text-center leading-tight ${earned ? 'text-gray-700' : 'text-gray-300'}`}>
        {badge.title}
      </span>
    </div>
  )
}

export { BADGES }
export type { Badge }
