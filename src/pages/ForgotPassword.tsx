import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import { useAuthStore } from '../store/authStore'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const { resetPasswordRequest, loading } = useAuthStore()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    const result = await resetPasswordRequest(email)
    if (result.error) setError(result.error)
    else setSuccess(true)
  }

  if (success) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="text-6xl mb-6">📧</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">이메일을 확인하세요</h1>
          <p className="text-gray-600 mb-2">
            <strong>{email}</strong>으로
          </p>
          <p className="text-gray-600 mb-8">
            비밀번호 재설정 링크를 보냈습니다.<br />
            이메일이 도착하지 않으면 스팸함을 확인해 주세요.
          </p>
          <div className="space-y-3">
            <Link to="/login">
              <Button variant="outline" className="w-full">로그인 페이지로 돌아가기</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🔑</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">비밀번호 찾기</h1>
          <p className="text-gray-600">가입한 이메일 주소를 입력하시면<br />비밀번호 재설정 링크를 보내드립니다.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
              {error}
            </div>
          )}
          <Input
            id="email"
            label="이메일"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
          />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? '전송 중...' : '비밀번호 재설정 링크 보내기'}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600">
          비밀번호가 기억나셨나요?{' '}
          <Link to="/login" className="text-accent font-medium hover:underline">
            로그인
          </Link>
        </p>
      </div>
    </div>
  )
}
