import { getCommunityRole, COMMUNITY_ROLES } from '../../types/community'

interface ReputationBadgeProps {
  reputation: number
  showLabel?: boolean
}

export default function ReputationBadge({ reputation, showLabel = true }: ReputationBadgeProps) {
  const current = getCommunityRole(reputation)
  const currentIndex = COMMUNITY_ROLES.findIndex((r) => r.role === current.role)
  const next = currentIndex < COMMUNITY_ROLES.length - 1 ? COMMUNITY_ROLES[currentIndex + 1] : null

  const progress = next
    ? ((reputation - current.min) / (next.min - current.min)) * 100
    : 100

  return (
    <div className="inline-flex items-center gap-2">
      <span className="text-lg" role="img" aria-label={current.name}>
        {current.icon}
      </span>
      {showLabel && (
        <div className="flex flex-col">
          <span className="text-sm font-medium" style={{ color: current.color }}>
            {current.name}
          </span>
          <div className="flex items-center gap-1.5">
            <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{ width: `${Math.min(progress, 100)}%`, backgroundColor: current.color }}
              />
            </div>
            {next && (
              <span className="text-xs text-gray-400">
                {reputation}/{next.min}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
