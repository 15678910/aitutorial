import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import { useAuthStore } from '../store/authStore'

export default function ResetPassword() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const { updatePassword, loading } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    if (password.length < 6) {
      setError('비밀번호는 6자 이상이어야 합니다')
      return
    }

    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다')
      return
    }

    const result = await updatePassword(password)
    if (result.error) setError(result.error)
    else setSuccess(true)
  }

  if (success) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="text-6xl mb-6">✅</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">비밀번호가 변경되었습니다</h1>
          <p className="text-gray-600 mb-8">
            새 비밀번호로 로그인할 수 있습니다.
          </p>
          <Button onClick={() => navigate('/login')} className="w-full">
            로그인하기
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🔒</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">새 비밀번호 설정</h1>
          <p className="text-gray-600">새로운 비밀번호를 입력해 주세요.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
              {error}
            </div>
          )}
          <Input
            id="password"
            label="새 비밀번호"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="6자 이상 입력하세요"
            required
          />
          <Input
            id="confirmPassword"
            label="비밀번호 확인"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="비밀번호를 한번 더 입력하세요"
            required
          />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? '변경 중...' : '비밀번호 변경'}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600">
          <Link to="/login" className="text-accent font-medium hover:underline">
            로그인 페이지로 돌아가기
          </Link>
        </p>
      </div>
    </div>
  )
}
