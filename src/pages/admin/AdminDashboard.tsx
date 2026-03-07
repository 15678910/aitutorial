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

  // Not logged in
  if (!user) return <Navigate to="/login" replace />

  // Not admin role
  if (user.role !== 'admin') return <Navigate to="/" replace />

  // Admin password gate
  if (!adminAuthed) {
    return <AdminLogin onAuthenticated={() => setAdminAuthed(true)} />
  }

  // Authenticated admin - render layout with nested routes
  return <AdminLayout />
}
