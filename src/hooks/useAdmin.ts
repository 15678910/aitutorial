import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export interface AdminUser {
  id: string
  email: string
  name: string | null
  role: string
  createdAt: string
  completedSections: number
  avgQuizScore: number | null
  lastActivity: string | null
}

export interface AdminStats {
  totalUsers: number
  totalCompletedSections: number
  averageQuizScore: number | null
  totalDiscussions: number
  totalEssays: number
  users: AdminUser[]
  courseStats: Map<string, { learners: number; completedSections: number }>
}

export function useAdminStats() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchStats = useCallback(async () => {
    setLoading(true)
    try {
      // 병렬로 모든 데이터 조회
      const [profilesRes, progressRes, discussionsRes, essaysRes] = await Promise.all([
        supabase.from('profiles').select('*').order('created_at', { ascending: false }),
        supabase.from('progress').select('*'),
        supabase.from('discussions').select('*', { count: 'exact', head: true }),
        supabase.from('essays').select('*', { count: 'exact', head: true }),
      ])

      const profiles = profilesRes.data || []
      const progress = progressRes.data || []
      const totalDiscussions = discussionsRes.count || 0
      const totalEssays = essaysRes.count || 0

      // 사용자별 진도 집계
      const userProgressMap = new Map<string, { completed: number; scores: number[]; lastActivity: string | null }>()
      for (const p of progress) {
        const existing = userProgressMap.get(p.user_id) || { completed: 0, scores: [], lastActivity: null }
        if (p.completed) existing.completed++
        if (p.quiz_score !== null) existing.scores.push(Number(p.quiz_score))
        if (p.completed_at && (!existing.lastActivity || p.completed_at > existing.lastActivity)) {
          existing.lastActivity = p.completed_at
        }
        userProgressMap.set(p.user_id, existing)
      }

      // 사용자 목록 구성
      const users: AdminUser[] = profiles.map(p => {
        const up = userProgressMap.get(p.id)
        return {
          id: p.id,
          email: p.email,
          name: p.name,
          role: p.role || 'user',
          createdAt: p.created_at,
          completedSections: up?.completed || 0,
          avgQuizScore: up?.scores.length ? Math.round(up.scores.reduce((a, b) => a + b, 0) / up.scores.length) : null,
          lastActivity: up?.lastActivity || null,
        }
      })

      // 전체 통계
      const totalCompletedSections = progress.filter(p => p.completed).length
      const allScores = progress.filter(p => p.quiz_score !== null).map(p => Number(p.quiz_score))
      const averageQuizScore = allScores.length > 0 ? Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length) : null

      // 코스별 통계 (section_id에서 코스 추출)
      const courseStats = new Map<string, { learners: Set<string>; completedSections: number }>()
      for (const p of progress) {
        // section_id 형식: "course-slug-chN-sN" → 코스 추출
        const parts = p.section_id.split('-ch')
        const courseSlug = parts[0] || 'unknown'
        const existing = courseStats.get(courseSlug) || { learners: new Set<string>(), completedSections: 0 }
        existing.learners.add(p.user_id)
        if (p.completed) existing.completedSections++
        courseStats.set(courseSlug, existing)
      }

      // Set을 count로 변환
      const courseStatsResult = new Map<string, { learners: number; completedSections: number }>()
      courseStats.forEach((v, k) => {
        courseStatsResult.set(k, { learners: v.learners.size, completedSections: v.completedSections })
      })

      setStats({
        totalUsers: profiles.length,
        totalCompletedSections,
        averageQuizScore,
        totalDiscussions,
        totalEssays,
        users,
        courseStats: courseStatsResult,
      })
    } catch (error) {
      console.error('Failed to fetch admin stats:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchStats() }, [fetchStats])

  return { stats, loading, refetch: fetchStats }
}
