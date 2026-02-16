import { Link } from 'react-router-dom'
import Card from '../ui/Card'
import SkillTag from './SkillTag'
import type { QAQuestion } from '../../types/community'

interface QAQuestionCardProps {
  question: QAQuestion
}

export default function QAQuestionCard({ question }: QAQuestionCardProps) {
  const hasAccepted = question.acceptedAnswerId !== null

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime()
    const minutes = Math.floor(diff / 60000)
    if (minutes < 1) return '방금 전'
    if (minutes < 60) return `${minutes}분 전`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}시간 전`
    const days = Math.floor(hours / 24)
    if (days < 30) return `${days}일 전`
    const months = Math.floor(days / 30)
    return `${months}개월 전`
  }

  return (
    <Card className="p-5">
      <div className="flex gap-4">
        {/* Left: Vote + Answer Counts */}
        <div className="flex flex-col items-center gap-2 flex-shrink-0 pt-1">
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900">{question.likes}</div>
            <div className="text-xs text-gray-400">추천</div>
          </div>
          <div
            className={`text-center px-2.5 py-1 rounded-lg ${
              hasAccepted
                ? 'bg-green-50 border border-green-200'
                : question.answers.length > 0
                  ? 'bg-gray-50 border border-gray-200'
                  : ''
            }`}
          >
            <div
              className={`text-lg font-bold ${
                hasAccepted
                  ? 'text-green-600'
                  : question.answers.length > 0
                    ? 'text-gray-700'
                    : 'text-gray-400'
              }`}
            >
              {question.answers.length}
            </div>
            <div
              className={`text-xs ${
                hasAccepted ? 'text-green-500' : 'text-gray-400'
              }`}
            >
              답변
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2">
            <Link
              to={`/community/qa/${question.id}`}
              className="text-lg font-bold text-gray-900 hover:text-blue-600 transition-colors line-clamp-1 flex-1"
            >
              {question.title}
            </Link>
            {hasAccepted && (
              <span className="flex-shrink-0 text-green-500 mt-1" title="채택된 답변 있음">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
            )}
          </div>

          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{question.content}</p>

          <div className="flex flex-wrap items-center gap-2 mt-3">
            {question.tags.map((tag) => (
              <SkillTag key={tag} skill={tag} />
            ))}
          </div>

          <div className="flex items-center gap-3 mt-3 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                <span className="text-[10px] font-bold text-indigo-600">
                  {question.authorName.charAt(0)}
                </span>
              </div>
              <span className="text-gray-600 font-medium">{question.authorName}</span>
            </span>
            <span>{timeAgo(question.createdAt)}</span>
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {question.views}
            </span>
          </div>
        </div>
      </div>
    </Card>
  )
}
