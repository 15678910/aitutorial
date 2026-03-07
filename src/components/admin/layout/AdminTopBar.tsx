import { useLocation } from 'react-router-dom'
import { useAuthStore } from '../../../store/authStore'

const pageTitles: Record<string, string> = {
  '/admin': '대시보드',
  '/admin/users': '사용자 관리',
  '/admin/content': '콘텐츠 관리',
  '/admin/monitoring': '시스템 모니터링',
  '/admin/partners': '파트너 관리',
}

export default function AdminTopBar() {
  const location = useLocation()
  const { user } = useAuthStore()

  const currentPage = (() => {
    // Exact match first
    if (pageTitles[location.pathname]) return pageTitles[location.pathname]
    // Check for sub-paths (e.g., /admin/users/123 → 사용자 관리)
    const parentPath = Object.keys(pageTitles).find(
      (path) => path !== '/admin' && location.pathname.startsWith(path)
    )
    if (parentPath) return pageTitles[parentPath]
    return '대시보드'
  })()

  const today = new Date().toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  })

  return (
    <header className="flex items-center justify-between h-16 px-6 bg-white border-b border-gray-200 shrink-0">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <span className="text-gray-400">관리자</span>
        <span className="text-gray-300">/</span>
        <span className="font-semibold text-gray-900">{currentPage}</span>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-400">{today}</span>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-sm">
            {(user?.name || user?.email || 'A')[0].toUpperCase()}
          </div>
          <div className="text-sm">
            <div className="font-medium text-gray-900">{user?.name || '관리자'}</div>
            <div className="text-xs text-gray-400">{user?.email}</div>
          </div>
        </div>
      </div>
    </header>
  )
}
