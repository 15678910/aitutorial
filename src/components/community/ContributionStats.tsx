import { useMemo } from 'react'
import { useProjectStore } from '../../store/projectStore'
import { useQAStore } from '../../store/qaStore'
import { useWikiStore } from '../../store/wikiStore'
import { REPUTATION_POINTS } from '../../types/community'
import Card from '../ui/Card'

interface ContributionStatsProps {
  userId: string
}

const POINT_LABELS: Record<keyof typeof REPUTATION_POINTS, string> = {
  SECTION_COMPLETE: '섹션 완료',
  QUIZ_HIGH_SCORE: '퀴즈 고득점',
  QUESTION_ASK: '질문 작성',
  ANSWER_WRITE: '답변 작성',
  ANSWER_ACCEPTED: '답변 채택',
  WIKI_CREATE: '위키 작성',
  WIKI_EDIT: '위키 편집',
  PROJECT_CREATE: '프로젝트 생성',
  PROJECT_COMPLETE: '프로젝트 완료',
  LIKE_RECEIVED: '좋아요 수신',
}

const POINT_COLORS: Record<keyof typeof REPUTATION_POINTS, string> = {
  SECTION_COMPLETE: '#22c55e',
  QUIZ_HIGH_SCORE: '#16a34a',
  QUESTION_ASK: '#3b82f6',
  ANSWER_WRITE: '#6366f1',
  ANSWER_ACCEPTED: '#8b5cf6',
  WIKI_CREATE: '#f59e0b',
  WIKI_EDIT: '#d97706',
  PROJECT_CREATE: '#ef4444',
  PROJECT_COMPLETE: '#dc2626',
  LIKE_RECEIVED: '#ec4899',
}

export default function ContributionStats({ userId }: ContributionStatsProps) {
  const { projects } = useProjectStore()
  const { questions } = useQAStore()
  const { articles } = useWikiStore()

  // Generate last 30 days activity data
  const activityData = useMemo(() => {
    const days: { date: string; count: number }[] = []
    const now = new Date()

    for (let i = 29; i >= 0; i--) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]

      let count = 0

      // Count project activity
      projects.forEach((p) => {
        if (p.authorId === userId && p.createdAt.startsWith(dateStr)) count++
        p.comments.forEach((c) => {
          if (c.userId === userId && c.createdAt.startsWith(dateStr)) count++
        })
      })

      // Count QA activity
      questions.forEach((q) => {
        if (q.authorId === userId && q.createdAt.startsWith(dateStr)) count++
        q.answers.forEach((a) => {
          if (a.authorId === userId && a.createdAt.startsWith(dateStr)) count++
        })
      })

      // Count wiki activity
      articles.forEach((a) => {
        if (a.authorId === userId && a.createdAt.startsWith(dateStr)) count++
        a.editHistory.forEach((e) => {
          if (e.editorId === userId && e.editedAt.startsWith(dateStr)) count++
        })
      })

      days.push({ date: dateStr, count })
    }
    return days
  }, [userId, projects, questions, articles])

  const maxActivity = Math.max(...activityData.map((d) => d.count), 1)

  function getActivityColor(count: number) {
    if (count === 0) return 'bg-gray-100'
    const intensity = count / maxActivity
    if (intensity <= 0.25) return 'bg-green-200'
    if (intensity <= 0.5) return 'bg-green-300'
    if (intensity <= 0.75) return 'bg-green-400'
    return 'bg-green-600'
  }

  const maxPoints = Math.max(...Object.values(REPUTATION_POINTS))

  return (
    <Card className="p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">기여 통계</h3>

      {/* Activity Heatmap */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-600 mb-3">최근 30일 활동</h4>
        <div className="flex gap-1 flex-wrap">
          {activityData.map((day) => (
            <div
              key={day.date}
              className={`w-4 h-4 rounded-sm ${getActivityColor(day.count)}`}
              title={`${day.date}: ${day.count}건`}
            />
          ))}
        </div>
        <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
          <span>적음</span>
          <div className="flex gap-0.5">
            <div className="w-3 h-3 rounded-sm bg-gray-100" />
            <div className="w-3 h-3 rounded-sm bg-green-200" />
            <div className="w-3 h-3 rounded-sm bg-green-300" />
            <div className="w-3 h-3 rounded-sm bg-green-400" />
            <div className="w-3 h-3 rounded-sm bg-green-600" />
          </div>
          <span>많음</span>
        </div>
      </div>

      {/* Point Breakdown */}
      <div>
        <h4 className="text-sm font-medium text-gray-600 mb-3">활동별 포인트</h4>
        <div className="space-y-2">
          {(Object.entries(REPUTATION_POINTS) as [keyof typeof REPUTATION_POINTS, number][]).map(
            ([key, points]) => (
              <div key={key} className="flex items-center gap-3">
                <span className="text-xs text-gray-600 w-24 shrink-0">
                  {POINT_LABELS[key]}
                </span>
                <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${(points / maxPoints) * 100}%`,
                      backgroundColor: POINT_COLORS[key],
                    }}
                  />
                </div>
                <span className="text-xs font-semibold text-gray-700 w-8 text-right">
                  +{points}
                </span>
              </div>
            )
          )}
        </div>
      </div>
    </Card>
  )
}
