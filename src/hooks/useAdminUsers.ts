import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import type { AdminUserRow } from '../types/admin'

interface AdminUsersResult {
  users: AdminUserRow[]
  totalCount: number
  loading: boolean
  page: number
  setPage: (page: number) => void
  search: string
  setSearch: (search: string) => void
  perPage: number
  refetch: () => Promise<void>
}

function generateDemoUsers(page: number, perPage: number, search: string): { users: AdminUserRow[]; totalCount: number } {
  const allUsers: AdminUserRow[] = Array.from({ length: 85 }, (_, i) => {
    const names = ['Kim', 'Lee', 'Park', 'Choi', 'Jung', 'Kang', 'Cho', 'Yoon', 'Jang', 'Lim']
    const name = `${names[i % names.length]} User${i + 1}`
    const email = `user${i + 1}@example.com`
    const now = new Date()
    const daysAgo = Math.floor(Math.random() * 90)
    const createdAt = new Date(now.getTime() - daysAgo * 86400000).toISOString()
    const lastDaysAgo = Math.floor(Math.random() * 30)
    const lastActivity = Math.random() > 0.2
      ? new Date(now.getTime() - lastDaysAgo * 86400000).toISOString()
      : null

    return {
      id: `demo-user-${i}`,
      email,
      name,
      role: i === 0 ? 'admin' : 'user',
      createdAt,
      approved: i < 3 ? false : true,
      completedSections: Math.floor(Math.random() * 40),
      avgQuizScore: Math.random() > 0.3 ? Math.floor(Math.random() * 40) + 55 : null,
      lastActivity,
    }
  })

  const filtered = search
    ? allUsers.filter(
        (u) =>
          u.email.toLowerCase().includes(search.toLowerCase()) ||
          (u.name && u.name.toLowerCase().includes(search.toLowerCase()))
      )
    : allUsers

  const start = page * perPage
  const paged = filtered.slice(start, start + perPage)

  return { users: paged, totalCount: filtered.length }
}

export function useAdminUsers(perPage: number = 20): AdminUsersResult {
  const [users, setUsers] = useState<AdminUserRow[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [search, setSearch] = useState('')
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [debouncedSearch, setDebouncedSearch] = useState('')

  // Debounce search input (300ms)
  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current)
    }
    debounceTimer.current = setTimeout(() => {
      setDebouncedSearch(search)
      setPage(0) // Reset to first page on new search
    }, 300)

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current)
      }
    }
  }, [search])

  const fetchUsers = useCallback(async () => {
    if (!isSupabaseConfigured) {
      const demo = generateDemoUsers(page, perPage, debouncedSearch)
      setUsers(demo.users)
      setTotalCount(demo.totalCount)
      setLoading(false)
      return
    }

    setLoading(true)
    try {
      const from = page * perPage
      const to = from + perPage - 1

      // Build profiles query with optional search filter
      let profilesQuery = supabase
        .from('profiles')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to)

      if (debouncedSearch) {
        profilesQuery = profilesQuery.or(
          `email.ilike.%${debouncedSearch}%,name.ilike.%${debouncedSearch}%`
        )
      }

      const [profilesRes, progressRes] = await Promise.all([
        profilesQuery,
        supabase.from('progress').select('user_id, completed, completed_at, quiz_score'),
      ])

      const profiles = profilesRes.data || []
      const progress = progressRes.data || []
      const count = profilesRes.count || 0

      // Build per-user progress map
      const userProgressMap = new Map<
        string,
        { completed: number; scores: number[]; lastActivity: string | null }
      >()
      for (const p of progress) {
        const existing = userProgressMap.get(p.user_id) || {
          completed: 0,
          scores: [],
          lastActivity: null,
        }
        if (p.completed) existing.completed++
        if (p.quiz_score !== null && p.quiz_score !== undefined) {
          existing.scores.push(Number(p.quiz_score))
        }
        if (
          p.completed_at &&
          (!existing.lastActivity || p.completed_at > existing.lastActivity)
        ) {
          existing.lastActivity = p.completed_at
        }
        userProgressMap.set(p.user_id, existing)
      }

      const userRows: AdminUserRow[] = profiles.map((p) => {
        const up = userProgressMap.get(p.id)
        return {
          id: p.id,
          email: p.email,
          name: p.name,
          role: p.role || 'user',
          createdAt: p.created_at,
          completedSections: up?.completed || 0,
          avgQuizScore:
            up?.scores && up.scores.length > 0
              ? Math.round(up.scores.reduce((a, b) => a + b, 0) / up.scores.length)
              : null,
          lastActivity: up?.lastActivity || null,
          approved: p.approved ?? true,
        }
      })

      setUsers(userRows)
      setTotalCount(count)
    } catch (error) {
      console.error('Failed to fetch admin users:', error)
      const demo = generateDemoUsers(page, perPage, debouncedSearch)
      setUsers(demo.users)
      setTotalCount(demo.totalCount)
    } finally {
      setLoading(false)
    }
  }, [page, perPage, debouncedSearch])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  return { users, totalCount, loading, page, setPage, search, setSearch, perPage, refetch: fetchUsers }
}
