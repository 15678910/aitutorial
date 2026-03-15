import { useState, type FormEvent } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import AdminLayout from '../../components/admin/layout/AdminLayout'
import AdminLogin from './AdminLogin'

/** /admin 페이지 내 계정 로그인 폼 (리다이렉트 없이 /admin에서 직접 로그인) */
function AdminAccountLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { signIn, loading } = useAuthStore()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    const result = await signIn(email, password)
    if (result.error) setError(result.error)
    // 로그인 성공 시 AdminDashboard가 re-render되어 다음 단계로 진행
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#29264c] z-[9999]" style={{ isolation: 'isolate', pointerEvents: 'auto' }}>
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm" style={{ pointerEvents: 'auto' }}>
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-accent rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-xl">AI</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900">관리자 로그인</h2>
          <p className="text-sm text-gray-500 mt-1">관리자 계정으로 로그인하세요</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{error}</div>}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="이메일"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
            required
            disabled={loading}
          />
          <input
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError('') }}
            placeholder="비밀번호"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
            required
            autoFocus
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  const { user, initialized } = useAuthStore()
  const [adminAuthed, setAdminAuthed] = useState(() => !!sessionStorage.getItem('admin_token'))

  // Loading state
  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Not logged in → /admin 페이지에서 직접 로그인 (리다이렉트 없음)
  if (!user) return <AdminAccountLogin />

  // Not admin role
  if (user.role !== 'admin') return <Navigate to="/" replace />

  // Admin password gate
  if (!adminAuthed) {
    return <AdminLogin onAuthenticated={() => setAdminAuthed(true)} />
  }

  // Authenticated admin - render layout with nested routes
  return <AdminLayout />
}
