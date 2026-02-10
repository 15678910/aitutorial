import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import { useAuthStore } from '../store/authStore'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { signIn, loading } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    const result = await signIn(email, password)
    if (result.error) setError(result.error)
    else navigate('/dashboard')
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">로그인</h1>
          <p className="text-gray-600">학습을 계속하려면 로그인하세요</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">{error}</div>}
          <Input id="email" label="이메일" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" required />
          <Input id="password" label="비밀번호" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="비밀번호를 입력하세요" required />
          <Button type="submit" className="w-full" disabled={loading}>{loading ? '로그인 중...' : '로그인'}</Button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600">계정이 없으신가요? <Link to="/signup" className="text-accent font-medium hover:underline">회원가입</Link></p>
      </div>
    </div>
  )
}
