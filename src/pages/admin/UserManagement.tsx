import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useAdminUsers } from '../../hooks/useAdminUsers'
import type { AdminUserRow } from '../../types/admin'
import { supabase } from '../../lib/supabase'

type SortField = 'name' | 'role' | 'createdAt' | 'completedSections' | 'avgQuizScore' | 'lastActivity'
type SortDirection = 'asc' | 'desc'

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

function getScoreColor(score: number | null): string {
  if (score === null) return 'text-gray-400'
  if (score >= 80) return 'text-emerald-600'
  if (score >= 60) return 'text-amber-600'
  return 'text-red-600'
}

function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gray-200" />
          <div className="space-y-1.5">
            <div className="h-4 w-24 bg-gray-200 rounded" />
            <div className="h-3 w-32 bg-gray-200 rounded" />
          </div>
        </div>
      </td>
      <td className="px-6 py-4"><div className="h-5 w-12 bg-gray-200 rounded-full" /></td>
      <td className="px-6 py-4"><div className="h-4 w-20 bg-gray-200 rounded" /></td>
      <td className="px-6 py-4"><div className="h-4 w-8 bg-gray-200 rounded" /></td>
      <td className="px-6 py-4"><div className="h-4 w-10 bg-gray-200 rounded" /></td>
      <td className="px-6 py-4"><div className="h-4 w-16 bg-gray-200 rounded" /></td>
      <td className="px-6 py-4"><div className="h-8 w-12 bg-gray-200 rounded" /></td>
    </tr>
  )
}

function SortIcon({ field, currentField, direction }: { field: SortField; currentField: SortField | null; direction: SortDirection }) {
  if (currentField !== field) {
    return <span className="ml-1 text-gray-300">&#8597;</span>
  }
  return <span className="ml-1 text-indigo-500">{direction === 'asc' ? '&#9650;' : '&#9660;'}</span>
}

export default function UserManagement() {
  const { users, totalCount, loading, page, setPage, search, setSearch, perPage, refetch } = useAdminUsers()
  const [sortField, setSortField] = useState<SortField | null>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')
  const [approvalFilter, setApprovalFilter] = useState<'all' | 'pending'>('all')
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [inviteEmails, setInviteEmails] = useState('')
  const [inviting, setInviting] = useState(false)
  const [inviteResults, setInviteResults] = useState<{ email: string; success: boolean; error?: string; link?: string }[] | null>(null)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const handleApprove = async (userId: string) => {
    try {
      await supabase.from('profiles').update({ approved: true }).eq('id', userId)
      refetch()
    } catch (error) {
      console.error('Failed to approve user:', error)
    }
  }

  const handleInvite = async () => {
    const emailList = inviteEmails
      .split(/[\n,]+/)
      .map(e => e.trim())
      .filter(e => e.length > 0)

    if (emailList.length === 0) return

    setInviting(true)
    setInviteResults(null)

    try {
      const token = sessionStorage.getItem('admin_token')
      const res = await fetch('/api/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emails: emailList, token }),
      })
      const data = await res.json()
      if (data.results) {
        setInviteResults(data.results)
        // Refetch users list to show newly invited users
        refetch()
      } else {
        setInviteResults([{ email: '전체', success: false, error: data.error || '알 수 없는 오류' }])
      }
    } catch (err) {
      setInviteResults([{ email: '전체', success: false, error: '서버 연결에 실패했습니다.' }])
    } finally {
      setInviting(false)
    }
  }

  const sortedUsers = useMemo(() => {
    let filtered = users
    if (approvalFilter === 'pending') {
      filtered = users.filter(u => !u.approved)
    }
    if (!sortField) return filtered
    return [...filtered].sort((a, b) => {
      let aVal: string | number | null
      let bVal: string | number | null
      switch (sortField) {
        case 'name':
          aVal = a.name?.toLowerCase() ?? ''
          bVal = b.name?.toLowerCase() ?? ''
          break
        case 'role':
          aVal = a.role
          bVal = b.role
          break
        case 'createdAt':
          aVal = a.createdAt
          bVal = b.createdAt
          break
        case 'completedSections':
          aVal = a.completedSections
          bVal = b.completedSections
          break
        case 'avgQuizScore':
          aVal = a.avgQuizScore ?? -1
          bVal = b.avgQuizScore ?? -1
          break
        case 'lastActivity':
          aVal = a.lastActivity ?? ''
          bVal = b.lastActivity ?? ''
          break
        default:
          return 0
      }
      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1
      return 0
    })
  }, [users, sortField, sortDirection, approvalFilter])

  const totalPages = Math.max(1, Math.ceil(totalCount / perPage))
  const showingFrom = totalCount > 0 ? page * perPage + 1 : 0
  const showingTo = Math.min((page + 1) * perPage, totalCount)

  const columnHeaders: { label: string; field: SortField | null }[] = [
    { label: '사용자', field: 'name' },
    { label: '역할', field: 'role' },
    { label: '가입일', field: 'createdAt' },
    { label: '완료 섹션', field: 'completedSections' },
    { label: '평균 점수', field: 'avgQuizScore' },
    { label: '최근 활동', field: 'lastActivity' },
    { label: '상세', field: null },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <span role="img" aria-label="users">👥</span>
          사용자 관리
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {loading ? (
            <span className="inline-flex items-center gap-1">
              <span className="w-3 h-3 border-2 border-gray-300 border-t-indigo-500 rounded-full animate-spin" />
              불러오는 중...
            </span>
          ) : `전체 ${totalCount}명`}
        </p>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="검색: 이름 또는 이메일"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
            />
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => setApprovalFilter('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                approvalFilter === 'all'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              전체
            </button>
            <button
              onClick={() => setApprovalFilter('pending')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                approvalFilter === 'pending'
                  ? 'bg-amber-100 text-amber-700'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              승인 대기 {users.filter(u => !u.approved).length > 0 && (
                <span className="ml-1 bg-amber-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                  {users.filter(u => !u.approved).length}
                </span>
              )}
            </button>
          </div>
          <button
            onClick={() => setShowInviteModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-accent rounded-lg hover:bg-accent/90 transition-colors whitespace-nowrap"
          >
            <span>✉️</span>
            사용자 초대
          </button>
          {!loading && (
            <p className="text-sm text-gray-500 whitespace-nowrap">
              {totalCount > 0 ? `${showingFrom}~${showingTo} / ${totalCount}건` : '결과 없음'}
            </p>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                {columnHeaders.map((col) => (
                  <th
                    key={col.label}
                    scope="col"
                    className={`px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider ${
                      col.field ? 'cursor-pointer select-none hover:text-gray-700' : ''
                    }`}
                    onClick={() => col.field && handleSort(col.field)}
                  >
                    <span className="inline-flex items-center">
                      {col.label}
                      {col.field && (
                        <SortIcon field={col.field} currentField={sortField} direction={sortDirection} />
                      )}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
              ) : sortedUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-4xl" role="img" aria-label="search">🔍</span>
                      <p className="text-gray-500 text-sm">검색 결과가 없습니다</p>
                    </div>
                  </td>
                </tr>
              ) : (
                sortedUsers.map((user: AdminUserRow) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    {/* User (avatar + name + email) */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-semibold shrink-0 ${getAvatarColor(user.name)}`}
                        >
                          {(user.name ?? user.email)[0].toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {user.name ?? '이름 없음'}
                          </p>
                          <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Role + Approval */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        {user.role === 'admin' ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            admin
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                            user
                          </span>
                        )}
                        {!user.approved && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-100 text-amber-700">
                            대기
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Join date */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {formatDate(user.createdAt)}
                    </td>

                    {/* Completed sections */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      {user.completedSections}
                    </td>

                    {/* Avg quiz score */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-medium ${getScoreColor(user.avgQuizScore)}`}>
                        {user.avgQuizScore !== null ? `${user.avgQuizScore}점` : '-'}
                      </span>
                    </td>

                    {/* Last activity */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatRelativeTime(user.lastActivity)}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {!user.approved && (
                          <button
                            onClick={() => handleApprove(user.id)}
                            className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-white bg-accent rounded-lg hover:bg-accent/90 transition-colors"
                          >
                            승인
                          </button>
                        )}
                        <Link
                          to={`/admin/users/${user.id}`}
                          className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
                        >
                          상세
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalCount > 0 && (
          <div className="flex items-center justify-between px-6 py-3 border-t border-gray-200 bg-gray-50">
            <button
              onClick={() => setPage(Math.max(0, page - 1))}
              disabled={page === 0}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              이전
            </button>
            <span className="text-sm text-gray-600">
              {page + 1} / {totalPages} 페이지
            </span>
            <button
              onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
              disabled={page >= totalPages - 1}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              다음
            </button>
          </div>
        )}
      </div>
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">✉️ 사용자 초대</h2>
                <button onClick={() => { setShowInviteModal(false); setInviteResults(null); setInviteEmails('') }} className="text-gray-400 hover:text-gray-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <p className="text-sm text-gray-500 mb-4">초대할 이메일 주소를 입력하세요. 초대된 사용자는 자동으로 승인됩니다.</p>

              {!inviteResults ? (
                <>
                  <textarea
                    value={inviteEmails}
                    onChange={(e) => setInviteEmails(e.target.value)}
                    placeholder={"이메일 주소 (줄바꿈 또는 쉼표로 구분)\nexample1@gmail.com\nexample2@gmail.com"}
                    rows={5}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none"
                    disabled={inviting}
                  />
                  <div className="flex justify-end gap-2 mt-4">
                    <button onClick={() => { setShowInviteModal(false); setInviteEmails('') }} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                      취소
                    </button>
                    <button
                      onClick={handleInvite}
                      disabled={inviting || !inviteEmails.trim()}
                      className="px-4 py-2 text-sm font-medium text-white bg-accent rounded-lg hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {inviting ? '초대 중...' : '초대 보내기'}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-3 max-h-80 overflow-y-auto">
                    {inviteResults.map((r, i) => (
                      <div key={i} className={`px-3 py-2 rounded-lg text-sm ${r.success ? 'bg-green-50' : 'bg-red-50'}`}>
                        <div className={`flex items-center justify-between ${r.success ? 'text-green-700' : 'text-red-700'}`}>
                          <span className="truncate font-medium">{r.email}</span>
                          <span className="shrink-0 ml-2">{r.success ? '✅ 초대 완료' : `❌ ${r.error || '실패'}`}</span>
                        </div>
                        {r.success && r.link && (
                          <div className="mt-2 flex items-center gap-2">
                            <input
                              type="text"
                              value={r.link}
                              readOnly
                              className="flex-1 text-xs bg-white border border-green-200 rounded px-2 py-1.5 text-gray-600 truncate"
                              onClick={(e) => (e.target as HTMLInputElement).select()}
                            />
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(r.link!)
                                setCopiedIndex(i)
                                setTimeout(() => setCopiedIndex(null), 2000)
                              }}
                              className="shrink-0 px-3 py-1.5 text-xs font-medium bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                            >
                              {copiedIndex === i ? '복사됨!' : '링크 복사'}
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-3">
                    💡 초대 링크를 복사하여 카카오톡, 문자 등으로 직접 전달하세요.
                  </p>
                  <div className="flex justify-end gap-2 mt-4">
                    <button onClick={() => { setInviteResults(null); setInviteEmails(''); setCopiedIndex(null) }} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                      추가 초대
                    </button>
                    <button onClick={() => { setShowInviteModal(false); setInviteResults(null); setInviteEmails(''); setCopiedIndex(null) }} className="px-4 py-2 text-sm font-medium text-white bg-accent rounded-lg hover:bg-accent/90 transition-colors">
                      닫기
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
