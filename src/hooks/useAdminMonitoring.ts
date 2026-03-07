import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import type { SystemStatus } from '../types/admin'

interface AdminMonitoringResult {
  status: SystemStatus
  loading: boolean
}

const POLL_INTERVAL_MS = 30_000 // 30 seconds

export function useAdminMonitoring(): AdminMonitoringResult {
  const [status, setStatus] = useState<SystemStatus>({
    supabaseConnected: false,
    responseTimeMs: 0,
    activeUsers: 0,
    errorRate: 0,
  })
  const [loading, setLoading] = useState(true)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const checkStatus = useCallback(async () => {
    if (!isSupabaseConfigured) {
      // Demo mode: simulate realistic system status
      setStatus({
        supabaseConnected: false,
        responseTimeMs: Math.floor(Math.random() * 50) + 20,
        activeUsers: Math.floor(Math.random() * 10) + 5,
        errorRate: Math.random() * 0.5,
      })
      setLoading(false)
      return
    }

    try {
      // Measure response time with a simple ping query
      const startTime = performance.now()
      const { error: pingError } = await supabase
        .from('profiles')
        .select('id', { count: 'exact', head: true })
      const endTime = performance.now()
      const responseTimeMs = Math.round(endTime - startTime)

      const supabaseConnected = !pingError

      // Active users: distinct user_ids with progress activity in the last 15 minutes
      let activeUsers = 0
      if (supabaseConnected) {
        const fifteenMinAgo = new Date(Date.now() - 15 * 60 * 1000).toISOString()
        const { data: recentProgress } = await supabase
          .from('progress')
          .select('user_id')
          .gte('completed_at', fifteenMinAgo)

        if (recentProgress) {
          const uniqueUsers = new Set(recentProgress.map((p: { user_id: string }) => p.user_id))
          activeUsers = uniqueUsers.size
        }
      }

      // Error rate: we approximate by checking if the ping had an error
      // In production this could track errors over a window, but for now we use a simple indicator
      const errorRate = supabaseConnected ? 0 : 100

      setStatus({
        supabaseConnected,
        responseTimeMs,
        activeUsers,
        errorRate,
      })
    } catch (error) {
      console.error('Failed to check system status:', error)
      setStatus({
        supabaseConnected: false,
        responseTimeMs: 0,
        activeUsers: 0,
        errorRate: 100,
      })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // Initial check
    checkStatus()

    // Poll every 30 seconds
    intervalRef.current = setInterval(checkStatus, POLL_INTERVAL_MS)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [checkStatus])

  return { status, loading }
}
