import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAdminUsers } from '../../hooks/useAdminUsers'

function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}.${m}.${day}`
}

function formatRelativeTime(dateStr: string | null): string {
  if (!dateStr) return '-'
  const now = new Date()
  const then = new Date(dateStr)
  const diffMs = now.getTime() - then.getTime()
  const diffMinutes = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMinutes < 1) return '방금 전'
  if (diffMinutes < 60) return `${diffMinutes}분 전`
  if (diffHours < 24) return `${diffHours}시간 전`
  return `${diffDays}일 전`
}

const AVATAR_COLORS = [
  'bg-blue-500',
  'bg-emerald-500',
  'bg-violet-500',
  'bg-amber-500',
  'bg-rose-500',
  'bg-cyan-500',
  'bg-indigo-500',
  'bg-teal-500',
  'bg-orange-500',
  'bg-pink-500',
]

function getAvatarColor(name: string | null): string {
  if (!name) return AVATAR_COLORS[0]
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

interface StatCardProps {
  label: string
  value: string
  icon: string
  color: string
}

function StatCard({ label, value, icon, color }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
      <div className="flex items-center gap-3 mb-2">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg ${color}`}>
          {icon}
        </div>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  )
}

export default function UserDetail() {
  const { id } = useParams<{ id: string }>()
  const { users, loading } = useAdminUsers(100)

  const user = useMemo(() => {
    return users.find((u) => u.id === id) ?? null
  }, [users, id])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gray-200 animate-pulse" />
            <div className="space-y-2">
              <div className="h-6 w-40 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-56 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 animate-pulse">
              <div className="h-10 w-10 bg-gray-200 rounded-lg mb-2" />
              <div className="h-4 w-20 bg-gray-200 rounded mb-2" />
              <div className="h-8 w-16 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="space-y-6">
        <Link
          to="/admin/users"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          <span>&larr;</span> 사용자 목록으로
        </Link>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <p className="text-4xl mb-3" role="img" aria-label="not found">😕</p>
          <p className="text-gray-500">사용자를 찾을 수 없습니다.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Link
        to="/admin/users"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
      >
        <span>&larr;</span> 사용자 목록으로
      </Link>

      {/* User header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-4">
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold shrink-0 ${getAvatarColor(user.name)}`}
          >
            {(user.name ?? user.email)[0].toUpperCase()}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-xl font-bold text-gray-900">
                {user.name ?? '이름 없음'}
              </h2>
              {user.role === 'admin' ? (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  admin
                </span>
              ) : (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                  user
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-0.5">{user.email}</p>
            <p className="text-xs text-gray-400 mt-1">
              가입일: {formatDate(user.createdAt)}
            </p>
          </div>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="완료한 섹션 수"
          value={`${user.completedSections}개`}
          icon="📚"
          color="bg-blue-50"
        />
        <StatCard
          label="평균 퀴즈 점수"
          value={user.avgQuizScore !== null ? `${user.avgQuizScore}점` : '-'}
          icon="📝"
          color="bg-emerald-50"
        />
        <StatCard
          label="최근 활동일"
          value={formatRelativeTime(user.lastActivity)}
          icon="🕐"
          color="bg-amber-50"
        />
        <StatCard
          label="가입일"
          value={formatDate(user.createdAt)}
          icon="📅"
          color="bg-violet-50"
        />
      </div>

      {/* Detailed progress placeholder */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">학습 이력</h3>
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <span className="text-4xl mb-3" role="img" aria-label="construction">🚧</span>
          <p className="text-gray-500 text-sm">
            상세 학습 이력은 추후 업데이트 예정입니다.
          </p>
          <p className="text-gray-400 text-xs mt-1">
            섹션별 진행 상황, 퀴즈 결과, 활동 타임라인 등이 추가됩니다.
          </p>
        </div>
      </div>
    </div>
  )
}
