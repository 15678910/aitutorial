interface LevelProgressProps {
  totalCompleted: number
}

const LEVELS = [
  { name: '입문자', min: 0, icon: '🌱', color: '#22c55e' },
  { name: '탐험가', min: 3, icon: '🧭', color: '#3b82f6' },
  { name: '학습자', min: 8, icon: '📚', color: '#8b5cf6' },
  { name: '실력자', min: 15, icon: '⚡', color: '#f59e0b' },
  { name: '전문가', min: 25, icon: '🏆', color: '#ef4444' },
  { name: '마스터', min: 40, icon: '👑', color: '#eab308' },
]

export function getLevel(completed: number) {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (completed >= LEVELS[i].min) return { ...LEVELS[i], index: i }
  }
  return { ...LEVELS[0], index: 0 }
}

export default function LevelProgress({ totalCompleted }: LevelProgressProps) {
  const current = getLevel(totalCompleted)
  const next = LEVELS[current.index + 1]
  const progress = next
    ? ((totalCompleted - current.min) / (next.min - current.min)) * 100
    : 100

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{current.icon}</span>
          <div>
            <div className="text-sm text-gray-500">현재 레벨</div>
            <div className="text-lg font-extrabold" style={{ color: current.color }}>{current.name}</div>
          </div>
        </div>
        {next && (
          <div className="text-right">
            <div className="text-sm text-gray-400">다음 레벨</div>
            <div className="text-sm font-bold text-gray-600">{next.icon} {next.name}</div>
          </div>
        )}
      </div>
      <div className="w-full bg-gray-100 rounded-full h-3">
        <div
          className="h-3 rounded-full transition-all duration-700"
          style={{ width: `${Math.min(progress, 100)}%`, backgroundColor: current.color }}
        />
      </div>
      <div className="text-xs text-gray-400 mt-2 text-right">
        {totalCompleted}개 섹션 완료 {next ? `• ${next.min - totalCompleted}개 더 하면 레벨업!` : '• 최고 레벨 달성!'}
      </div>
    </div>
  )
}
