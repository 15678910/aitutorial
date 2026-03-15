import { useState, useEffect, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import { supabase } from '../lib/supabase'

export default function AcceptInvite() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [sessionReady, setSessionReady] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>
    let unsubscribe: (() => void) | null = null

    const setupSession = async () => {
      // Check for PKCE code in URL params
      const params = new URLSearchParams(window.location.search)
      const code = params.get('code')
      if (code) {
        try {
          await supabase.auth.exchangeCodeForSession(code)
        } catch (err) {
          console.warn('exchangeCodeForSession failed:', err)
        }
      }

      // Listen for auth state change (handles invite, recovery, hash-based and PKCE flows)
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'PASSWORD_RECOVERY') && session) {
          setSessionReady(true)
          clearTimeout(timeoutId)
        }
      })
      unsubscribe = () => subscription.unsubscribe()

      // Also check if session already exists (e.g., hash token processed by Supabase client automatically)
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        setSessionReady(true)
        clearTimeout(timeoutId)
      }

      // 10-second timeout if session not established
      timeoutId = setTimeout(() => {
        setSessionReady((ready) => {
          if (!ready) {
            setError('초대 링크가 유효하지 않거나 만료되었습니다.')
          }
          return ready
        })
      }, 10000)
    }

    setupSession()

    return () => {
      if (unsubscribe) unsubscribe()
      clearTimeout(timeoutId)
    }
  }, [])

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => navigate('/'), 2000)
      return () => clearTimeout(timer)
    }
  }, [success, navigate])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    if (password.length < 8) {
      setError('비밀번호는 8자 이상이어야 합니다')
      return
    }
    if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
      setError('비밀번호는 영문과 숫자를 포함해야 합니다')
      return
    }
    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다')
      return
    }

    setSubmitting(true)
    try {
      // 세션 확인
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        setError('세션이 만료되었습니다. 초대 링크를 다시 클릭해 주세요.')
        return
      }

      // Supabase JS 클라이언트 대신 직접 REST API 호출 (hang 방지)
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 15000)

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/auth/v1/user`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
            'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
          },
          body: JSON.stringify({ password }),
          signal: controller.signal,
        }
      )
      clearTimeout(timeoutId)

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        setError(data.message || data.msg || `비밀번호 변경 실패 (${response.status})`)
      } else {
        // 세션 갱신 후 성공 처리
        await supabase.auth.refreshSession().catch(() => {})
        setSuccess(true)
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        setError('요청 시간이 초과되었습니다. 다시 시도해 주세요.')
      } else {
        setError(err instanceof Error ? err.message : '비밀번호 변경 중 오류가 발생했습니다')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        {success ? (
          <div className="text-center py-4">
            <div className="text-5xl mb-4">✅</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">환영합니다!</h2>
            <p className="text-gray-500">
              비밀번호가 설정되었습니다. 잠시 후 홈으로 이동합니다.
            </p>
          </div>
        ) : !sessionReady ? (
          <div className="text-center py-8">
            {error ? (
              <>
                <div className="text-5xl mb-4">⚠️</div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">초대 링크 오류</h2>
                <p className="text-red-600 text-sm">{error}</p>
              </>
            ) : (
              <>
                <div className="flex justify-center mb-4">
                  <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                </div>
                <p className="text-gray-500 text-sm">세션 확인 중...</p>
              </>
            )}
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <div className="text-5xl mb-3">🎓</div>
              <h1 className="text-2xl font-bold text-gray-900">AI Tutorial</h1>
              <h2 className="text-xl font-semibold text-gray-800 mt-4">비밀번호 설정</h2>
              <p className="text-sm text-gray-500 mt-1">
                초대를 수락하고 비밀번호를 설정해 주세요.
              </p>
            </div>

            {error && (
              <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  비밀번호
                </label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="비밀번호 (8자 이상, 영문+숫자)"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  비밀번호 확인
                </label>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="비밀번호를 다시 입력해 주세요"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full mt-2"
                disabled={submitting}
              >
                {submitting ? '처리 중...' : '시작하기'}
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
