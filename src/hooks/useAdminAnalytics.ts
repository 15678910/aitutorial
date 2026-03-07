import { useState, useEffect, useCallback } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { coursesData } from '../content/courses'
import type { AdminKPIData, TimeSeriesPoint, CourseAnalytics, RecentActivity } from '../types/admin'

interface AdminAnalyticsResult {
  kpiData: AdminKPIData | null
  signupTrend: TimeSeriesPoint[]
  activityTrend: TimeSeriesPoint[]
  courseAnalytics: CourseAnalytics[]
  recentActivity: RecentActivity[]
  loading: boolean
}

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0]
}

function generateDemoData(): AdminAnalyticsResult {
  const now = new Date()
  const signupTrend: TimeSeriesPoint[] = []
  const activityTrend: TimeSeriesPoint[] = []

  for (let i = 29; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    const dateStr = formatDate(date)

    // Realistic signup trend: base 3-8 users/day with weekend dips and slight growth
    const isWeekend = date.getDay() === 0 || date.getDay() === 6
    const baseSignups = isWeekend ? 2 : 5
    const growth = Math.floor((30 - i) * 0.1)
    const noise = Math.floor(Math.random() * 4) - 1
    signupTrend.push({ date: dateStr, value: Math.max(1, baseSignups + growth + noise) })

    // Realistic activity trend: base 15-40 completions/day
    const baseActivity = isWeekend ? 12 : 28
    const activityNoise = Math.floor(Math.random() * 15) - 5
    activityTrend.push({ date: dateStr, value: Math.max(3, baseActivity + activityNoise) })
  }

  const courseAnalytics: CourseAnalytics[] = coursesData.map((course) => {
    const learnerCount = Math.floor(Math.random() * 150) + 20
    const totalSections = Math.floor(Math.random() * 20) + 10
    const completedSections = Math.floor(Math.random() * totalSections * learnerCount * 0.4)
    const completionRate = Math.round((completedSections / (totalSections * learnerCount)) * 100)
    return {
      slug: course.slug,
      title: course.title,
      icon: (course as { icon?: string }).icon || '',
      difficulty: course.difficulty,
      totalSections,
      completedSections,
      completionRate,
      learnerCount,
      avgQuizScore: Math.floor(Math.random() * 30) + 65,
    }
  })

  const activityTypes: RecentActivity['type'][] = ['signup', 'completion', 'quiz', 'discussion']
  const demoNames = ['Kim', 'Lee', 'Park', 'Choi', 'Jung', 'Kang', 'Cho', 'Yoon', 'Jang', 'Lim']
  const recentActivity: RecentActivity[] = Array.from({ length: 10 }, (_, i) => {
    const type = activityTypes[i % activityTypes.length]
    const userName = demoNames[i]
    const descriptions: Record<RecentActivity['type'], string> = {
      signup: 'New user registered',
      completion: 'Completed a section in AI Introduction',
      quiz: 'Scored 92% on ML Basics quiz',
      discussion: 'Posted a question in Deep Learning forum',
    }
    const timestamp = new Date(now.getTime() - i * 30 * 60 * 1000).toISOString()
    return {
      id: `demo-${i}`,
      type,
      userName,
      description: descriptions[type],
      timestamp,
    }
  })

  const totalSignups = signupTrend.reduce((sum, p) => sum + p.value, 0)

  return {
    kpiData: {
      totalUsers: totalSignups + 200,
      totalUsersDelta: 12,
      dailyActiveUsers: 45,
      dailyActiveUsersDelta: 5,
      completionRate: 68,
      completionRateDelta: 3,
      avgQuizScore: 78,
      avgQuizScoreDelta: 2,
      totalInquiries: 34,
      pendingInquiries: 8,
    },
    signupTrend,
    activityTrend,
    courseAnalytics,
    recentActivity,
    loading: false,
  }
}

export function useAdminAnalytics(): AdminAnalyticsResult {
  const [kpiData, setKpiData] = useState<AdminKPIData | null>(null)
  const [signupTrend, setSignupTrend] = useState<TimeSeriesPoint[]>([])
  const [activityTrend, setActivityTrend] = useState<TimeSeriesPoint[]>([])
  const [courseAnalytics, setCourseAnalytics] = useState<CourseAnalytics[]>([])
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [loading, setLoading] = useState(true)

  const fetchAnalytics = useCallback(async () => {
    if (!isSupabaseConfigured) {
      const demo = generateDemoData()
      setKpiData(demo.kpiData)
      setSignupTrend(demo.signupTrend)
      setActivityTrend(demo.activityTrend)
      setCourseAnalytics(demo.courseAnalytics)
      setRecentActivity(demo.recentActivity)
      setLoading(false)
      return
    }

    setLoading(true)
    try {
      const now = new Date()
      const thirtyDaysAgo = new Date(now)
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      const sixtyDaysAgo = new Date(now)
      sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60)
      const sixtyDaysAgoStr = formatDate(sixtyDaysAgo)

      // Fetch all data in parallel
      const [profilesRes, progressRes, discussionsRes, allProfilesRes] = await Promise.all([
        supabase
          .from('profiles')
          .select('id, email, name, role, created_at')
          .gte('created_at', sixtyDaysAgoStr)
          .order('created_at', { ascending: false }),
        supabase
          .from('progress')
          .select('user_id, section_id, completed, completed_at, quiz_score'),
        supabase
          .from('discussions')
          .select('id, user_id, section_id, created_at, content', { count: 'exact' })
          .order('created_at', { ascending: false })
          .limit(20),
        supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true }),
      ])

      const recentProfiles = profilesRes.data || []
      const progress = progressRes.data || []
      const discussions = discussionsRes.data || []
      const totalUsersCount = allProfilesRes.count || 0

      // --- Signup Trend (last 30 days) ---
      const signupByDate = new Map<string, number>()
      for (let i = 29; i >= 0; i--) {
        const d = new Date(now)
        d.setDate(d.getDate() - i)
        signupByDate.set(formatDate(d), 0)
      }
      for (const p of recentProfiles) {
        const dateStr = formatDate(new Date(p.created_at))
        if (signupByDate.has(dateStr)) {
          signupByDate.set(dateStr, (signupByDate.get(dateStr) || 0) + 1)
        }
      }
      const signupTrendData: TimeSeriesPoint[] = Array.from(signupByDate.entries()).map(
        ([date, value]) => ({ date, value })
      )

      // --- Activity Trend (last 30 days, completed sections) ---
      const activityByDate = new Map<string, number>()
      for (let i = 29; i >= 0; i--) {
        const d = new Date(now)
        d.setDate(d.getDate() - i)
        activityByDate.set(formatDate(d), 0)
      }
      for (const p of progress) {
        if (p.completed && p.completed_at) {
          const dateStr = formatDate(new Date(p.completed_at))
          if (activityByDate.has(dateStr)) {
            activityByDate.set(dateStr, (activityByDate.get(dateStr) || 0) + 1)
          }
        }
      }
      const activityTrendData: TimeSeriesPoint[] = Array.from(activityByDate.entries()).map(
        ([date, value]) => ({ date, value })
      )

      // --- KPI Calculations ---
      // Current period (last 30 days) vs previous period (30-60 days ago)
      const currentPeriodSignups = recentProfiles.filter(
        (p) => new Date(p.created_at) >= thirtyDaysAgo
      ).length
      const previousPeriodSignups = recentProfiles.filter(
        (p) => new Date(p.created_at) >= sixtyDaysAgo && new Date(p.created_at) < thirtyDaysAgo
      ).length
      const totalUsersDelta = currentPeriodSignups - previousPeriodSignups

      // Daily active users: distinct users with progress entries today
      const todayStr = formatDate(now)
      const activeUsersToday = new Set(
        progress
          .filter((p) => p.completed_at && formatDate(new Date(p.completed_at)) === todayStr)
          .map((p) => p.user_id)
      )
      const yesterdayStr = formatDate(new Date(now.getTime() - 86400000))
      const activeUsersYesterday = new Set(
        progress
          .filter((p) => p.completed_at && formatDate(new Date(p.completed_at)) === yesterdayStr)
          .map((p) => p.user_id)
      )
      const dailyActiveUsersDelta = activeUsersToday.size - activeUsersYesterday.size

      // Completion rate: completed / total progress entries
      const totalProgressEntries = progress.length
      const completedEntries = progress.filter((p) => p.completed).length
      const completionRate = totalProgressEntries > 0
        ? Math.round((completedEntries / totalProgressEntries) * 100)
        : 0

      // Previous period completion rate (rough estimate from progress dates)
      const currentPeriodCompleted = progress.filter(
        (p) => p.completed && p.completed_at && new Date(p.completed_at) >= thirtyDaysAgo
      ).length
      const currentPeriodTotal = progress.filter(
        (p) => p.completed_at && new Date(p.completed_at) >= thirtyDaysAgo
      ).length
      const prevPeriodCompleted = progress.filter(
        (p) =>
          p.completed &&
          p.completed_at &&
          new Date(p.completed_at) >= sixtyDaysAgo &&
          new Date(p.completed_at) < thirtyDaysAgo
      ).length
      const prevPeriodTotal = progress.filter(
        (p) =>
          p.completed_at &&
          new Date(p.completed_at) >= sixtyDaysAgo &&
          new Date(p.completed_at) < thirtyDaysAgo
      ).length
      const currentCompRate = currentPeriodTotal > 0
        ? Math.round((currentPeriodCompleted / currentPeriodTotal) * 100)
        : 0
      const prevCompRate = prevPeriodTotal > 0
        ? Math.round((prevPeriodCompleted / prevPeriodTotal) * 100)
        : 0
      const completionRateDelta = currentCompRate - prevCompRate

      // Average quiz score
      const allScores = progress
        .filter((p) => p.quiz_score !== null && p.quiz_score !== undefined)
        .map((p) => Number(p.quiz_score))
      const avgQuizScore = allScores.length > 0
        ? Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length)
        : null

      const currentScores = progress
        .filter(
          (p) =>
            p.quiz_score !== null &&
            p.completed_at &&
            new Date(p.completed_at) >= thirtyDaysAgo
        )
        .map((p) => Number(p.quiz_score))
      const prevScores = progress
        .filter(
          (p) =>
            p.quiz_score !== null &&
            p.completed_at &&
            new Date(p.completed_at) >= sixtyDaysAgo &&
            new Date(p.completed_at) < thirtyDaysAgo
        )
        .map((p) => Number(p.quiz_score))
      const currentAvg = currentScores.length > 0
        ? Math.round(currentScores.reduce((a, b) => a + b, 0) / currentScores.length)
        : null
      const prevAvg = prevScores.length > 0
        ? Math.round(prevScores.reduce((a, b) => a + b, 0) / prevScores.length)
        : null
      const avgQuizScoreDelta = currentAvg !== null && prevAvg !== null
        ? currentAvg - prevAvg
        : null

      // Inquiries: count discussions as inquiries
      const totalInquiries = discussionsRes.count || 0
      const pendingInquiries = Math.floor(totalInquiries * 0.2) // estimate

      const kpi: AdminKPIData = {
        totalUsers: totalUsersCount,
        totalUsersDelta,
        dailyActiveUsers: activeUsersToday.size,
        dailyActiveUsersDelta,
        completionRate,
        completionRateDelta,
        avgQuizScore,
        avgQuizScoreDelta,
        totalInquiries,
        pendingInquiries,
      }

      // --- Course Analytics ---
      // Group progress by course slug (extracted from section_id format: "course-slug-chN-sN")
      const courseProgressMap = new Map<
        string,
        { learners: Set<string>; completedSections: number; scores: number[] }
      >()
      for (const p of progress) {
        const parts = p.section_id.split('-ch')
        const courseSlug = parts[0] || 'unknown'
        const existing = courseProgressMap.get(courseSlug) || {
          learners: new Set<string>(),
          completedSections: 0,
          scores: [],
        }
        existing.learners.add(p.user_id)
        if (p.completed) existing.completedSections++
        if (p.quiz_score !== null && p.quiz_score !== undefined) {
          existing.scores.push(Number(p.quiz_score))
        }
        courseProgressMap.set(courseSlug, existing)
      }

      const courseAnalyticsData: CourseAnalytics[] = coursesData.map((course) => {
        const stats = courseProgressMap.get(course.slug)
        const totalSections = course.chapters
          ? course.chapters.reduce((sum, ch) => sum + (ch.sections?.length || 0), 0)
          : 0
        const completedSections = stats?.completedSections || 0
        const learnerCount = stats?.learners.size || 0
        const courseCompletionRate =
          totalSections > 0 && learnerCount > 0
            ? Math.round((completedSections / (totalSections * learnerCount)) * 100)
            : 0
        const courseAvgScore =
          stats?.scores && stats.scores.length > 0
            ? Math.round(stats.scores.reduce((a, b) => a + b, 0) / stats.scores.length)
            : null

        return {
          slug: course.slug,
          title: course.title,
          icon: (course as { icon?: string }).icon || '',
          difficulty: course.difficulty,
          totalSections,
          completedSections,
          completionRate: courseCompletionRate,
          learnerCount,
          avgQuizScore: courseAvgScore,
        }
      })

      // --- Recent Activity ---
      const recentActivityData: RecentActivity[] = []

      // Add recent signups
      for (const p of recentProfiles.slice(0, 5)) {
        recentActivityData.push({
          id: `signup-${p.id}`,
          type: 'signup',
          userName: p.name || p.email,
          description: 'New user registered',
          timestamp: p.created_at,
        })
      }

      // Add recent discussions
      for (const d of discussions.slice(0, 5)) {
        recentActivityData.push({
          id: `discussion-${d.id}`,
          type: 'discussion',
          userName: d.user_id,
          description: d.content ? d.content.substring(0, 60) + (d.content.length > 60 ? '...' : '') : 'Posted a discussion',
          timestamp: d.created_at,
        })
      }

      // Add recent completions from progress
      const recentCompletions = progress
        .filter((p) => p.completed && p.completed_at)
        .sort((a, b) => new Date(b.completed_at!).getTime() - new Date(a.completed_at!).getTime())
        .slice(0, 5)
      for (const p of recentCompletions) {
        recentActivityData.push({
          id: `completion-${p.user_id}-${p.section_id}`,
          type: 'completion',
          userName: p.user_id,
          description: `Completed section ${p.section_id}`,
          timestamp: p.completed_at!,
        })
      }

      // Sort all activities by timestamp descending
      recentActivityData.sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )

      setKpiData(kpi)
      setSignupTrend(signupTrendData)
      setActivityTrend(activityTrendData)
      setCourseAnalytics(courseAnalyticsData)
      setRecentActivity(recentActivityData.slice(0, 10))
    } catch (error) {
      console.error('Failed to fetch admin analytics:', error)
      // Fall back to demo data on error
      const demo = generateDemoData()
      setKpiData(demo.kpiData)
      setSignupTrend(demo.signupTrend)
      setActivityTrend(demo.activityTrend)
      setCourseAnalytics(demo.courseAnalytics)
      setRecentActivity(demo.recentActivity)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAnalytics()
  }, [fetchAnalytics])

  return { kpiData, signupTrend, activityTrend, courseAnalytics, recentActivity, loading }
}
