import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import AdminLayout from '../../components/admin/layout/AdminLayout'
import AdminLogin from './AdminLogin'

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

  // Admin password gate FIRST (관리자 비밀번호 화면이 먼저 나와야 함)
  if (!adminAuthed) {
    return <AdminLogin onAuthenticated={() => setAdminAuthed(true)} />
  }

  // 관리자 비밀번호 통과 후 Supabase 로그인 확인
  if (!user) return <Navigate to="/login?redirect=/admin" replace />

  // Not admin role
  if (user.role !== 'admin') return <Navigate to="/" replace />

  // Authenticated admin - render layout with nested routes
  return <AdminLayout />
}
