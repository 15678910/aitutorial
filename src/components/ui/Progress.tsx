import { cn } from '../../lib/utils'

interface ProgressProps {
  value: number
  max?: number
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  className?: string
}

export default function Progress({ value, max = 100, size = 'md', showLabel = false, className }: ProgressProps) {
  const percentage = Math.min(Math.round((value / max) * 100), 100)
  const heights = { sm: 'h-1.5', md: 'h-2.5', lg: 'h-4' }

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium text-gray-700">진행률</span>
          <span className="text-sm font-medium text-accent">{percentage}%</span>
        </div>
      )}
      <div className={cn('w-full bg-gray-200 rounded-full', heights[size])}>
        <div
          className={cn('bg-accent rounded-full transition-all duration-500 ease-out', heights[size])}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
