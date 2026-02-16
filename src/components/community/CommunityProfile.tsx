import { useCommunityStore } from '../../store/communityStore'
import ReputationBadge from './ReputationBadge'
import SkillTag from './SkillTag'

interface CommunityProfileProps {
  userId: string
  compact?: boolean
}

const AVATAR_COLORS = [
  'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-pink-500',
  'bg-indigo-500', 'bg-teal-500', 'bg-orange-500', 'bg-red-500',
]

function getAvatarColor(name: string) {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

export default function CommunityProfile({ userId, compact = false }: CommunityProfileProps) {
  const profile = useCommunityStore((s) => s.getProfile(userId))

  if (!profile) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-400">
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs">?</div>
        <span>알 수 없는 사용자</span>
      </div>
    )
  }

  const initial = profile.displayName.charAt(0)
  const avatarColor = getAvatarColor(profile.displayName)

  if (compact) {
    return (
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-full ${avatarColor} flex items-center justify-center text-white text-sm font-bold`}>
          {initial}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-900">{profile.displayName}</span>
          <ReputationBadge reputation={profile.reputation} showLabel={false} />
        </div>
        <span className="text-xs text-gray-400">{profile.reputation}P</span>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-start gap-4">
        <div className={`w-14 h-14 rounded-full ${avatarColor} flex items-center justify-center text-white text-xl font-bold shrink-0`}>
          {initial}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-base font-bold text-gray-900">{profile.displayName}</span>
            <ReputationBadge reputation={profile.reputation} />
          </div>
          {profile.bio && (
            <p className="text-sm text-gray-600 mb-2">{profile.bio}</p>
          )}
          {profile.skills.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {profile.skills.map((skill) => (
                <SkillTag key={skill} skill={skill} size="sm" />
              ))}
            </div>
          )}
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span>{profile.reputation} 포인트</span>
            <span>{profile.projectCount} 프로젝트</span>
            <span>{profile.answerCount} 답변</span>
            <span>{profile.wikiContributions} 위키</span>
          </div>
        </div>
      </div>
    </div>
  )
}
