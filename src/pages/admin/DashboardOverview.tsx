import { useMemo } from 'react'
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import Card from '../../components/ui/Card'
import { useAdminAnalytics } from '../../hooks/useAdminAnalytics'
import type { CourseAnalytics, RecentActivity } from '../../types/admin'

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function formatAxisDate(dateStr: string): string {
  const d = new Date(dateStr)
  return `${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`
}

function timeAgo(timestamp: string): string {
  const diff = Date.now() - new Date(timestamp).getTime()
  const minutes = Math.floor(diff / 60_000)
  if (minutes < 1) return '방금 전'
  if (minutes < 60) return `${minutes}분 전`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}시간 전`
  const days = Math.floor(hours / 24)
  return `${days}일 전`
}

const difficultyLabel: Record<string, string> = {
  beginner: '초급',
  intermediate: '중급',
  advanced: '고급',
}

const difficultyColor: Record<string, string> = {
  beginner: 'bg-green-100 text-green-700',
  intermediate: 'bg-yellow-100 text-yellow-700',
  advanced: 'bg-red-100 text-red-700',
}

const activityIcon: Record<RecentActivity['type'], string> = {
  signup: '👤',
  completion: '✅',
  quiz: '📝',
  discussion: '💬',
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function KpiSkeleton() {
  return (
    <Card className="p-5 animate-pulse">
      <div className="h-4 w-16 bg-gray-200 rounded mb-3" />
      <div className="h-8 w-24 bg-gray-200 rounded mb-2" />
      <div className="h-3 w-20 bg-gray-200 rounded" />
    </Card>
  )
}

function ChartSkeleton() {
  return (
    <Card className="p-6 animate-pulse">
      <div className="h-5 w-32 bg-gray-200 rounded mb-4" />
      <div className="h-[300px] bg-gray-100 rounded" />
    </Card>
  )
}

function TableSkeleton() {
  return (
    <Card className="p-6 animate-pulse">
      <div className="h-5 w-40 bg-gray-200 rounded mb-4" />
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-10 bg-gray-100 rounded mb-2" />
      ))}
    </Card>
  )
}

interface KpiCardProps {
  icon: string
  label: string
  value: string | number
  delta: number | null
  suffix?: string
  badge?: number | null
}

function KpiCard({ icon, label, value, delta, suffix = '', badge }: KpiCardProps) {
  const isPositive = delta !== null && delta >= 0
  return (
    <Card hoverable className="p-5 relative overflow-hidden">
      {/* Badge (pending count) */}
      {badge != null && badge > 0 && (
        <span className="absolute top-3 right-3 inline-flex items-center justify-center px-2 py-0.5 text-xs font-semibold rounded-full bg-red-100 text-red-600">
          {badge}
        </span>
      )}

      <div className="flex items-center gap-2 mb-2">
        <span className="text-xl" role="img" aria-hidden="true">
          {icon}
        </span>
        <span className="text-sm font-medium text-gray-500">{label}</span>
      </div>

      <p className="text-3xl font-bold text-[#29264c] mb-1">
        {value}
        {suffix && <span className="text-lg font-semibold ml-0.5">{suffix}</span>}
      </p>

      {delta !== null && (
        <span
          className={`inline-flex items-center text-sm font-medium ${
            isPositive ? 'text-[#32c2a2]' : 'text-[#ef4444]'
          }`}
        >
          {isPositive ? '↑' : '↓'} {Math.abs(delta)}
          {suffix}
        </span>
      )}

      {/* Mini sparkline bar decoration */}
      <div className="mt-3 flex items-end gap-[3px] h-5">
        {[40, 60, 35, 70, 55, 80, 65, 90, 75].map((h, i) => (
          <div
            key={i}
            className="w-[4px] rounded-sm bg-[#32c2a2] opacity-30"
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
    </Card>
  )
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export default function DashboardOverview() {
  const { kpiData, signupTrend, activityTrend, courseAnalytics, recentActivity, loading } =
    useAdminAnalytics()

  const sortedCourses = useMemo(
    () => [...courseAnalytics].sort((a, b) => b.learnerCount - a.learnerCount),
    [courseAnalytics]
  )

  const recentItems = useMemo(() => recentActivity.slice(0, 8), [recentActivity])

  /* ---- Loading state ---- */
  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">대시보드</h1>
          <p className="text-gray-500 text-sm">전체 서비스 현황을 한눈에 확인하세요.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <KpiSkeleton key={i} />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartSkeleton />
          <ChartSkeleton />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TableSkeleton />
          <TableSkeleton />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* ---- Header ---- */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">대시보드</h1>
        <p className="text-gray-500 text-sm">전체 서비스 현황을 한눈에 확인하세요.</p>
      </div>

      {/* ---- KPI Cards ---- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <KpiCard
          icon="👥"
          label="총 사용자"
          value={kpiData?.totalUsers ?? '-'}
          delta={kpiData?.totalUsersDelta ?? null}
        />
        <KpiCard
          icon="🟢"
          label="일일 활성 사용자"
          value={kpiData?.dailyActiveUsers ?? '-'}
          delta={kpiData?.dailyActiveUsersDelta ?? null}
        />
        <KpiCard
          icon="✅"
          label="완료율"
          value={kpiData?.completionRate ?? '-'}
          delta={kpiData?.completionRateDelta ?? null}
          suffix="%"
        />
        <KpiCard
          icon="📝"
          label="평균 퀴즈 점수"
          value={kpiData?.avgQuizScore ?? '-'}
          delta={kpiData?.avgQuizScoreDelta ?? null}
        />
        <KpiCard
          icon="🏢"
          label="파트너 문의"
          value={kpiData?.totalInquiries ?? '-'}
          delta={null}
          badge={kpiData?.pendingInquiries}
        />
      </div>

      {/* ---- Charts Row ---- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Signup Trend */}
        <Card className="p-6">
          <h2 className="text-base font-semibold text-[#29264c] mb-4">신규 가입자 추이</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={signupTrend} margin={{ top: 4, right: 12, left: -12, bottom: 0 }}>
                <defs>
                  <linearGradient id="signupGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#32c2a2" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#32c2a2" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="date"
                  tickFormatter={formatAxisDate}
                  tick={{ fontSize: 11, fill: '#9ca3af' }}
                  tickLine={false}
                  axisLine={{ stroke: '#e5e7eb' }}
                  interval="preserveStartEnd"
                />
                <YAxis
                  tick={{ fontSize: 11, fill: '#9ca3af' }}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  labelFormatter={(label) => formatAxisDate(String(label))}
                  formatter={(v) => [`${v}명`, '신규 가입']}
                  contentStyle={{
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    fontSize: '13px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#32c2a2"
                  strokeWidth={2}
                  fill="url(#signupGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Activity Trend */}
        <Card className="p-6">
          <h2 className="text-base font-semibold text-[#29264c] mb-4">일일 학습 활동</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activityTrend} margin={{ top: 4, right: 12, left: -12, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="date"
                  tickFormatter={formatAxisDate}
                  tick={{ fontSize: 11, fill: '#9ca3af' }}
                  tickLine={false}
                  axisLine={{ stroke: '#e5e7eb' }}
                  interval="preserveStartEnd"
                />
                <YAxis
                  tick={{ fontSize: 11, fill: '#9ca3af' }}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  labelFormatter={(label) => formatAxisDate(String(label))}
                  formatter={(v) => [`${v}건`, '학습 완료']}
                  contentStyle={{
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    fontSize: '13px',
                  }}
                />
                <Bar dataKey="value" fill="#4f46e5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* ---- Bottom Row ---- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Course Performance Table */}
        <Card className="p-6 overflow-hidden">
          <h2 className="text-base font-semibold text-[#29264c] mb-4">코스별 성과</h2>
          <div className="overflow-x-auto -mx-6 px-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-2 pr-4 font-medium text-gray-500">코스명</th>
                  <th className="text-right py-2 px-3 font-medium text-gray-500">학습자</th>
                  <th className="text-right py-2 px-3 font-medium text-gray-500">완료율</th>
                  <th className="text-right py-2 pl-3 font-medium text-gray-500">평균 점수</th>
                </tr>
              </thead>
              <tbody>
                {sortedCourses.map((course: CourseAnalytics) => (
                  <tr
                    key={course.slug}
                    className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        {course.icon && (
                          <span className="text-base" role="img" aria-hidden="true">
                            {course.icon}
                          </span>
                        )}
                        <div className="min-w-0">
                          <p className="font-medium text-[#29264c] truncate">{course.title}</p>
                          <span
                            className={`inline-block mt-0.5 text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                              difficultyColor[course.difficulty] || 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {difficultyLabel[course.difficulty] || course.difficulty}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="text-right py-3 px-3 tabular-nums text-gray-700">
                      {course.learnerCount}
                    </td>
                    <td className="text-right py-3 px-3">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full bg-[#32c2a2]"
                            style={{ width: `${Math.min(course.completionRate, 100)}%` }}
                          />
                        </div>
                        <span className="tabular-nums text-gray-700 w-10 text-right">
                          {course.completionRate}%
                        </span>
                      </div>
                    </td>
                    <td className="text-right py-3 pl-3 tabular-nums text-gray-700">
                      {course.avgQuizScore !== null ? `${course.avgQuizScore}점` : '-'}
                    </td>
                  </tr>
                ))}
                {sortedCourses.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center py-8 text-gray-400">
                      코스 데이터가 없습니다.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Recent Activity Feed */}
        <Card className="p-6">
          <h2 className="text-base font-semibold text-[#29264c] mb-4">최근 활동</h2>
          <ul className="space-y-1">
            {recentItems.map((activity: RecentActivity) => (
              <li
                key={activity.id}
                className="flex items-start gap-3 py-2.5 px-2 rounded-lg hover:bg-gray-50/80 transition-colors"
              >
                <span
                  className="mt-0.5 text-base flex-shrink-0"
                  role="img"
                  aria-hidden="true"
                >
                  {activityIcon[activity.type]}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-gray-800">
                    <span className="font-semibold text-[#29264c]">{activity.userName}</span>{' '}
                    <span className="text-gray-600">{activity.description}</span>
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{timeAgo(activity.timestamp)}</p>
                </div>
              </li>
            ))}
            {recentItems.length === 0 && (
              <li className="text-center py-8 text-gray-400 text-sm">최근 활동이 없습니다.</li>
            )}
          </ul>
        </Card>
      </div>
    </div>
  )
}
