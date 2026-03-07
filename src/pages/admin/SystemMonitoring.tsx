import { useState, useEffect, useCallback } from 'react'
import Card from '../../components/ui/Card'
import { useAdminMonitoring } from '../../hooks/useAdminMonitoring'

interface HealthLogEntry {
  timestamp: Date
  connected: boolean
  responseTimeMs: number
}

export default function SystemMonitoring() {
  const { status, loading } = useAdminMonitoring()
  const [healthLog, setHealthLog] = useState<HealthLogEntry[]>([])

  // Record health log entries whenever status updates
  useEffect(() => {
    if (!loading) {
      setHealthLog((prev) => {
        const entry: HealthLogEntry = {
          timestamp: new Date(),
          connected: status.supabaseConnected,
          responseTimeMs: status.responseTimeMs,
        }
        const updated = [entry, ...prev]
        return updated.slice(0, 10)
      })
    }
  }, [status, loading])

  const getRelativeTime = useCallback((date: Date) => {
    const now = new Date()
    const diffSec = Math.floor((now.getTime() - date.getTime()) / 1000)
    if (diffSec < 5) return '방금 전'
    if (diffSec < 60) return `${diffSec}초 전`
    const diffMin = Math.floor(diffSec / 60)
    if (diffMin < 60) return `${diffMin}분 전`
    return `${Math.floor(diffMin / 60)}시간 전`
  }, [])

  const responseTimeColor =
    status.responseTimeMs < 200
      ? 'text-green-600'
      : status.responseTimeMs < 500
        ? 'text-yellow-600'
        : 'text-red-600'

  const responseTimeBg =
    status.responseTimeMs < 200
      ? 'bg-green-50'
      : status.responseTimeMs < 500
        ? 'bg-yellow-50'
        : 'bg-red-50'

  const errorRateColor =
    status.errorRate === 0
      ? 'text-green-600'
      : status.errorRate < 5
        ? 'text-yellow-600'
        : 'text-red-600'

  const errorRateBg =
    status.errorRate === 0
      ? 'bg-green-50'
      : status.errorRate < 5
        ? 'bg-yellow-50'
        : 'bg-red-50'

  if (loading) {
    return (
      <div>
        <div className="mb-6 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-56 mb-2" />
          <div className="h-4 bg-gray-200 rounded w-40" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-5 border border-gray-200 animate-pulse">
              <div className="h-10 bg-gray-200 rounded mb-2" />
              <div className="h-3 bg-gray-200 rounded w-20 mx-auto" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <span className="text-2xl">&#128421;&#65039;</span>
            시스템 모니터링
          </h1>
          <p className="text-sm text-gray-500 mt-1">실시간 시스템 상태를 모니터링합니다.</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
          </span>
          30초마다 자동 갱신
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Supabase Connection */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Supabase 연결</span>
            <span className={`flex h-3 w-3 rounded-full ${status.supabaseConnected ? 'bg-green-500' : 'bg-red-500'}`} />
          </div>
          <div className={`text-lg font-bold ${status.supabaseConnected ? 'text-green-600' : 'text-red-600'}`}>
            {status.supabaseConnected ? '연결됨' : '연결 실패'}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            {status.supabaseConnected ? '데이터베이스 정상 작동 중' : '연결 상태를 확인하세요'}
          </div>
        </Card>

        {/* Response Time */}
        <Card className={`p-5 ${responseTimeBg}`}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">응답 시간</span>
            <span className="text-gray-400">&#9201;</span>
          </div>
          <div className={`text-lg font-bold ${responseTimeColor}`}>
            {status.responseTimeMs}ms
          </div>
          <div className="text-xs text-gray-400 mt-1">
            {status.responseTimeMs < 200
              ? '빠른 응답'
              : status.responseTimeMs < 500
                ? '보통 응답'
                : '느린 응답 - 확인 필요'}
          </div>
        </Card>

        {/* Active Users */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">활성 사용자</span>
            <span className="text-gray-400">&#128101;</span>
          </div>
          <div className="text-lg font-bold text-primary">
            {status.activeUsers}
          </div>
          <div className="text-xs text-gray-400 mt-1">최근 15분 내 활동</div>
        </Card>

        {/* Error Rate */}
        <Card className={`p-5 ${errorRateBg}`}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">오류율</span>
            <span className="text-gray-400">&#9888;&#65039;</span>
          </div>
          <div className={`text-lg font-bold ${errorRateColor}`}>
            {status.errorRate.toFixed(1)}%
          </div>
          <div className="text-xs text-gray-400 mt-1">
            {status.errorRate === 0
              ? '오류 없음'
              : status.errorRate < 5
                ? '낮은 오류율'
                : '높은 오류율 - 즉시 확인'}
          </div>
        </Card>
      </div>

      {/* System Info Panel */}
      <Card className="p-6 mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">시스템 정보</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-xs font-semibold text-gray-400 mb-1">플랫폼</div>
            <div className="text-sm font-bold text-gray-900">Vercel</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-xs font-semibold text-gray-400 mb-1">데이터베이스</div>
            <div className="text-sm font-bold text-gray-900">Supabase</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-xs font-semibold text-gray-400 mb-1">도메인</div>
            <div className="text-sm font-bold text-gray-900">aitutorial.kr</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-xs font-semibold text-gray-400 mb-1">프레임워크</div>
            <div className="text-sm font-bold text-gray-900">React 19 + TypeScript + Vite</div>
          </div>
        </div>
      </Card>

      {/* Recent Health Log */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">최근 상태 로그</h2>
          <span className="text-xs text-gray-400">최근 10건</span>
        </div>

        {healthLog.length === 0 ? (
          <div className="text-center py-8 text-gray-400 text-sm">
            상태 확인 대기 중...
          </div>
        ) : (
          <div className="space-y-2">
            {healthLog.map((entry, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between py-2.5 px-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`flex h-2.5 w-2.5 rounded-full ${
                      entry.connected ? 'bg-green-500' : 'bg-red-500'
                    }`}
                  />
                  <span className="text-sm text-gray-700">
                    {entry.connected ? '연결 정상' : '연결 실패'}
                  </span>
                  <span className={`text-xs font-medium ${
                    entry.responseTimeMs < 200
                      ? 'text-green-600'
                      : entry.responseTimeMs < 500
                        ? 'text-yellow-600'
                        : 'text-red-600'
                  }`}>
                    {entry.responseTimeMs}ms
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <span>
                    마지막 확인:{' '}
                    {entry.timestamp.toLocaleTimeString('ko-KR', {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                    })}
                  </span>
                  <span className="text-gray-300">|</span>
                  <span>{getRelativeTime(entry.timestamp)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
