import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAdminStore } from '../../../store/adminStore'
import { useAuthStore } from '../../../store/authStore'

const navItems = [
  { label: '대시보드', icon: '📊', path: '/admin' },
  { label: '사용자 관리', icon: '👥', path: '/admin/users' },
  { label: '콘텐츠 관리', icon: '📚', path: '/admin/content' },
  { label: '시스템 모니터링', icon: '🖥️', path: '/admin/monitoring' },
  { label: '파트너 관리', icon: '🏢', path: '/admin/partners' },
]

export default function AdminSidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { sidebarCollapsed, toggleSidebar } = useAdminStore()
  const { signOut } = useAuthStore()

  const isActive = (path: string) => {
    if (path === '/admin') return location.pathname === '/admin'
    return location.pathname.startsWith(path)
  }

  const handleSignOut = async () => {
    sessionStorage.removeItem('admin_token')
    await signOut()
    navigate('/')
  }

  return (
    <aside
      className={`flex flex-col h-full bg-[#29264c] text-white transition-all duration-300 ${
        sidebarCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Logo area */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-white/10 shrink-0">
        <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center shrink-0">
          <span className="text-white font-bold text-sm">AI</span>
        </div>
        {!sidebarCollapsed && (
          <span className="text-lg font-bold text-white whitespace-nowrap">AI 학습 관리자</span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const active = isActive(item.path)
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                active
                  ? 'bg-white/10 border-l-[3px] border-accent text-white'
                  : 'text-white/60 hover:bg-white/5 hover:text-white border-l-[3px] border-transparent'
              }`}
              title={sidebarCollapsed ? item.label : undefined}
            >
              <span className="text-lg shrink-0">{item.icon}</span>
              {!sidebarCollapsed && <span>{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Bottom section */}
      <div className="border-t border-white/10 p-2 space-y-1 shrink-0">
        <Link
          to="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/60 hover:bg-white/5 hover:text-white transition-all"
          title={sidebarCollapsed ? '사이트로 돌아가기' : undefined}
        >
          <span className="text-lg shrink-0">🏠</span>
          {!sidebarCollapsed && <span>사이트로 돌아가기</span>}
        </Link>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/60 hover:bg-white/5 hover:text-red-300 transition-all w-full text-left"
          title={sidebarCollapsed ? '로그아웃' : undefined}
        >
          <span className="text-lg shrink-0">🚪</span>
          {!sidebarCollapsed && <span>로그아웃</span>}
        </button>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={toggleSidebar}
        className="flex items-center justify-center h-10 border-t border-white/10 text-white/40 hover:text-white hover:bg-white/5 transition-all shrink-0"
        title={sidebarCollapsed ? '사이드바 펼치기' : '사이드바 접기'}
      >
        <span className="text-sm">{sidebarCollapsed ? '▶' : '◀'}</span>
      </button>
    </aside>
  )
}
