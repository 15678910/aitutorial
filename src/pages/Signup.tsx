import { useState, type FormEvent } from 'react'
import { Link, Navigate } from 'react-router-dom'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import { useAuthStore } from '../store/authStore'
import { useSiteSettingsStore } from '../store/siteSettingsStore'

export default function Signup() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const { signUp, loading, user, initialized } = useAuthStore()
  const { settings } = useSiteSettingsStore()

  if (initialized && user) return <Navigate to="/dashboard" replace />

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    if (password.length < 8) { setError('비밀번호는 8자 이상이어야 합니다'); return }
    if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) { setError('비밀번호는 영문과 숫자를 모두 포함해야 합니다'); return }
    const result = await signUp(email, password, name)
    if (result.error) setError(result.error)
    else setSuccess(true)
  }

  if (success) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-3">이메일을 확인하세요</h1>
          <p className="text-gray-600 mb-6"><strong>{email}</strong>으로 인증 링크를 보냈습니다.</p>
          {settings.invite_only && (
            <div className="bg-amber-50 border border-amber-200 text-amber-700 text-sm px-4 py-3 rounded-lg mb-4">
              현재 초대제로 운영 중입니다. 관리자 승인 후 로그인할 수 있습니다.
            </div>
          )}
          <Link to="/login"><Button variant="outline">로그인 페이지로</Button></Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">회원가입</h1>
          <p className="text-gray-600">무료로 AI 학습을 시작하세요</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {settings.invite_only && (
            <div className="bg-amber-50 border border-amber-200 text-amber-700 text-sm px-4 py-3 rounded-lg">
              🔒 현재 초대제로 운영 중입니다. 가입 후 관리자 승인이 필요합니다.
            </div>
          )}
          {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">{error}</div>}
          <Input id="name" label="이름" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="홍길동" required />
          <Input id="email" label="이메일" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" required />
          <Input id="password" label="비밀번호" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="8자 이상, 영문+숫자 포함" required />
          <Button type="submit" className="w-full" disabled={loading}>{loading ? '가입 중...' : '무료 회원가입'}</Button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600">이미 계정이 있으신가요? <Link to="/login" className="text-accent font-medium hover:underline">로그인</Link></p>
      </div>
    </div>
  )
}
