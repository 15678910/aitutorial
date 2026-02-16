import type { Challenge } from '../../types/community'
import Button from '../ui/Button'

interface ChallengeCardProps {
  challenge: Challenge
}

const STATUS_CONFIG = {
  upcoming: { label: '예정', bg: 'bg-yellow-100', text: 'text-yellow-800' },
  active: { label: '진행중', bg: 'bg-green-100', text: 'text-green-800' },
  voting: { label: '투표중', bg: 'bg-blue-100', text: 'text-blue-800' },
  completed: { label: '완료', bg: 'bg-gray-100', text: 'text-gray-600' },
}

const DIFFICULTY_CONFIG = {
  beginner: { label: '초급', bg: 'bg-green-50', text: 'text-green-700' },
  intermediate: { label: '중급', bg: 'bg-yellow-50', text: 'text-yellow-700' },
  advanced: { label: '고급', bg: 'bg-red-50', text: 'text-red-700' },
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('ko-KR', {
    month: 'short',
    day: 'numeric',
  })
}

export default function ChallengeCard({ challenge }: ChallengeCardProps) {
  const status = STATUS_CONFIG[challenge.status]
  const difficulty = DIFFICULTY_CONFIG[challenge.difficulty]

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-2 mb-3">
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${status.bg} ${status.text}`}>
          {status.label}
        </span>
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${difficulty.bg} ${difficulty.text}`}>
          {difficulty.label}
        </span>
      </div>

      <h3 className="text-lg font-bold text-gray-900 mb-2">{challenge.title}</h3>
      <p className="text-sm text-gray-600 line-clamp-2 mb-4">{challenge.description}</p>

      <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
        <span>
          {formatDate(challenge.startDate)} ~ {formatDate(challenge.endDate)}
        </span>
        <span>{challenge.participants}명 참여</span>
        <span>{challenge.submissions.length}개 제출</span>
      </div>

      {challenge.status === 'active' && (
        <Button size="sm">참여하기</Button>
      )}
      {challenge.status === 'upcoming' && (
        <span className="text-sm text-gray-400 font-medium">곧 시작됩니다</span>
      )}
      {challenge.status === 'voting' && (
        <Button size="sm" variant="outline">투표하기</Button>
      )}
      {challenge.status === 'completed' && (
        <span className="text-sm text-gray-400 font-medium">종료됨</span>
      )}
    </div>
  )
}
