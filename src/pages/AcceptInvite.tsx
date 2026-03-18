import { useState, useEffect, useRef, type FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import { supabase } from '../lib/supabase'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string

export default function AcceptInvite() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [sessionReady, setSessionReady] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [resetEmail, setResetEmail] = useState('')
  const [resetSending, setResetSending] = useState(false)
  const [resetSent, setResetSent] = useState(false)
  const [resetError, setResetError] = useState('')
  const navigate = useNavigate()

  // 세션 확립 시 access_token을 ref에 저장 (submit 시 Supabase 클라이언트 우회)
  const accessTokenRef = useRef<string | null>(null)

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>
    let unsubscribe: (() => void) | null = null

    const onSessionReady = (token: string) => {
      accessTokenRef.current = token
      setSessionReady(true)
      clearTimeout(timeoutId)
    }

    const setupSession = async () => {
      const params = new URLSearchParams(window.location.search)

      // 1. URL hash에서 Supabase 에러 파라미터 확인
      //    (기존 action_link 방식의 토큰 만료/사용됨 에러)
      const hash = window.location.hash.substring(1)
      const hashParams = new URLSearchParams(hash)
      const hashError = hashParams.get('error_description') || hashParams.get('error')
      if (hashError && !hashParams.get('access_token')) {
        const errorCode = hashParams.get('error_code') || ''
        let message = '초대 링크가 유효하지 않습니다.'
        if (errorCode === 'otp_expired' || hashError.toLowerCase().includes('expired')) {
          message = '초대 링크가 만료되었습니다.'
        } else if (hashError.toLowerCase().includes('already')) {
          message = '이미 사용된 초대 링크입니다.'
        }
        setError(message)
        return
      }

      // 2. token_hash 방식 (봇 prefetch 방지 — 메신저로 공유해도 안전)
      //    URL: /accept-invite?token_hash=xxx&type=invite
      const tokenHash = params.get('token_hash')
      const tokenType = params.get('type') as 'invite' | 'recovery' | 'magiclink' | 'email' | null
      if (tokenHash && tokenType) {
        try {
          const { data, error: verifyError } = await supabase.auth.verifyOtp({
            token_hash: tokenHash,
            type: tokenType,
          })
          if (data.session) {
            onSessionReady(data.session.access_token)
            return
          }
          if (verifyError) {
            const msg = verifyError.message.toLowerCase()
            if (msg.includes('expired') || msg.includes('otp')) {
              setError('초대 링크가 만료되었습니다.')
            } else {
              setError(`인증 오류: ${verifyError.message}`)
            }
            return
          }
        } catch (err) {
          console.warn('verifyOtp failed:', err)
          setError('초대 링크 처리 중 오류가 발생했습니다.')
          return
        }
      }

      // 3. PKCE code 방식 (기존 호환)
      const code = params.get('code')
      if (code) {
        try {
          const { data } = await supabase.auth.exchangeCodeForSession(code)
          if (data.session) {
            onSessionReady(data.session.access_token)
            return
          }
        } catch (err) {
          console.warn('exchangeCodeForSession failed:', err)
        }
      }

      // 4. Auth state change listener (hash-based 방식 등 기존 호환)
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'PASSWORD_RECOVERY') && session) {
          onSessionReady(session.access_token)
        }
      })
      unsubscribe = () => subscription.unsubscribe()

      // 5. 기존 세션 확인
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        onSessionReady(session.access_token)
      }

      // 15-second timeout if session not established
      timeoutId = setTimeout(() => {
        setSessionReady((ready) => {
          if (!ready) {
            setError('초대 링크가 만료되었습니다.')
          }
          return ready
        })
      }, 15000)
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

    // 저장된 토큰 확인 (Supabase 클라이언트 호출 없음)
    const token = accessTokenRef.current
    if (!token) {
      setError('세션이 만료되었습니다. 초대 링크를 다시 클릭해 주세요.')
      return
    }

    setSubmitting(true)

    // 안전 타임아웃: 어떤 상황에서도 20초 후 버튼 복구
    const safetyTimer = setTimeout(() => {
      setSubmitting(false)
      setError('요청 처리에 실패했습니다. 페이지를 새로고침 후 다시 시도해 주세요.')
    }, 20000)

    try {
      const controller = new AbortController()
      const fetchTimer = setTimeout(() => controller.abort(), 15000)

      const response = await fetch(
        `${SUPABASE_URL}/auth/v1/user`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'apikey': SUPABASE_ANON_KEY,
          },
          body: JSON.stringify({ password }),
          signal: controller.signal,
        }
      )
      clearTimeout(fetchTimer)

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        setError(data.message || data.msg || `비밀번호 변경 실패 (${response.status})`)
      } else {
        setSuccess(true)
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        setError('요청 시간이 초과되었습니다. 다시 시도해 주세요.')
      } else {
        setError(err instanceof Error ? err.message : '비밀번호 변경 중 오류가 발생했습니다')
      }
    } finally {
      clearTimeout(safetyTimer)
      setSubmitting(false)
    }
  }

  const handleResetPassword = async (e: FormEvent) => {
    e.preventDefault()
    setResetError('')
    setResetSending(true)
    try {
      const { error: resetErr } = await supabase.auth.resetPasswordForEmail(resetEmail)
      if (resetErr) {
        setResetError(resetErr.message)
      } else {
        setResetSent(true)
      }
    } catch (err) {
      setResetError(err instanceof Error ? err.message : '오류가 발생했습니다.')
    } finally {
      setResetSending(false)
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
                <div className="text-5xl mb-4">🔑</div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">비밀번호를 설정해 주세요</h2>
                <p className="text-gray-600 text-sm mb-6">초대 링크가 만료되었지만, 아래에서 바로 비밀번호를 설정할 수 있습니다.</p>
                <div className="mt-2 text-left">
                  {resetSent ? (
                    <p className="text-sm text-green-600 bg-green-50 border border-green-200 rounded-lg px-4 py-3">
                      📧 {resetEmail}으로 비밀번호 설정 링크를 보냈습니다. 이메일을 확인해 주세요.
                    </p>
                  ) : (
                    <form onSubmit={handleResetPassword} className="space-y-3">
                      <Input
                        type="email"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        placeholder="초대받은 이메일 주소"
                        required
                      />
                      {resetError && (
                        <p className="text-red-600 text-sm">{resetError}</p>
                      )}
                      <Button
                        type="submit"
                        className="w-full"
                        disabled={resetSending}
                      >
                        {resetSending ? '전송 중...' : '비밀번호 설정 메일 받기'}
                      </Button>
                    </form>
                  )}
                </div>
                <p className="mt-4 text-xs text-gray-500">
                  이미 비밀번호를 설정하셨다면 바로 로그인하실 수 있습니다.
                </p>
                <div className="mt-3 flex flex-col gap-2 items-center">
                  <Link
                    to="/login"
                    className="text-sm text-blue-600 hover:text-blue-800 underline"
                  >
                    로그인 페이지로 이동
                  </Link>
                </div>
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
