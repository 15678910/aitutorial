import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import SkillTag from '../components/community/SkillTag'
import { useAuthStore } from '../store/authStore'
import { useQAStore } from '../store/qaStore'

export default function QADetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const {
    getQuestion,
    addAnswer,
    acceptAnswer,
    toggleQuestionLike,
    toggleAnswerLike,
    incrementViews,
  } = useQAStore()

  const [answerContent, setAnswerContent] = useState('')

  const question = id ? getQuestion(id) : null

  // Increment views on mount
  useEffect(() => {
    if (id) {
      incrementViews(id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  if (!question) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center py-20">
          <div className="text-4xl mb-4">🔍</div>
          <p className="text-gray-500 text-lg">질문을 찾을 수 없습니다</p>
          <Link to="/community/qa" className="inline-block mt-4">
            <Button variant="outline">Q&A 목록으로</Button>
          </Link>
        </div>
      </div>
    )
  }

  const isQuestionAuthor = user?.id === question.authorId
  const hasLikedQuestion = user ? question.likedBy.includes(user.id) : false

  // Sort answers: accepted first, then by likes
  const sortedAnswers = [...question.answers].sort((a, b) => {
    if (a.isAccepted && !b.isAccepted) return -1
    if (!a.isAccepted && b.isAccepted) return 1
    return b.likes - a.likes
  })

  const handleSubmitAnswer = (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !answerContent.trim()) return
    addAnswer(question.id, answerContent.trim(), user.id, user.name || '익명')
    setAnswerContent('')
  }

  const handleAccept = (answerId: string) => {
    if (!user) return
    acceptAnswer(question.id, answerId, user.id)
  }

  const handleLikeQuestion = () => {
    if (!user) {
      navigate('/login')
      return
    }
    toggleQuestionLike(question.id, user.id)
  }

  const handleLikeAnswer = (answerId: string) => {
    if (!user) {
      navigate('/login')
      return
    }
    toggleAnswerLike(question.id, answerId, user.id)
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Back Button */}
      <Link
        to="/community/qa"
        className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors"
      >
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Q&A 목록으로
      </Link>

      {/* Question Card */}
      <Card className="p-6 mb-8">
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-4">
          {question.title}
        </h1>

        {/* Meta Info */}
        <div className="flex flex-wrap items-center gap-3 mb-6 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center">
              <span className="text-xs font-bold text-indigo-600">
                {question.authorName.charAt(0)}
              </span>
            </div>
            <span className="font-medium text-gray-700">{question.authorName}</span>
          </div>
          <span>{formatDate(question.createdAt)}</span>
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            {question.views}
          </span>
        </div>

        {/* Content */}
        <div className="prose prose-gray max-w-none mb-6">
          <ReactMarkdown>{question.content}</ReactMarkdown>
        </div>

        {/* Tags */}
        {question.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {question.tags.map((tag) => (
              <SkillTag key={tag} skill={tag} size="md" />
            ))}
          </div>
        )}

        {/* Like Button */}
        <div className="pt-4 border-t border-gray-100">
          <button
            onClick={handleLikeQuestion}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors text-sm font-semibold ${
              hasLikedQuestion
                ? 'border-red-200 bg-red-50 text-red-600'
                : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <svg
              className="w-4 h-4"
              fill={hasLikedQuestion ? 'currentColor' : 'none'}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            추천 {question.likes}
          </button>
        </div>
      </Card>

      {/* Answer Count Header */}
      <h2 className="text-xl font-bold text-gray-900 mb-6">
        {question.answers.length}개의 답변
      </h2>

      {/* Answers List */}
      <div className="space-y-4 mb-8">
        {sortedAnswers.map((answer) => {
          const hasLikedAnswer = user ? answer.likedBy.includes(user.id) : false

          return (
            <Card
              key={answer.id}
              className={`p-6 ${
                answer.isAccepted ? 'border-green-200 bg-green-50/30' : ''
              }`}
            >
              {/* Accepted Badge */}
              {answer.isAccepted && (
                <div className="flex items-center gap-2 mb-4">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-sm font-semibold text-green-700">채택된 답변</span>
                </div>
              )}

              {/* Answer Content */}
              <div className="prose prose-gray max-w-none mb-4">
                <ReactMarkdown>{answer.content}</ReactMarkdown>
              </div>

              {/* Answer Footer */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-3">
                  {/* Like Button */}
                  <button
                    onClick={() => handleLikeAnswer(answer.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-colors text-sm font-medium ${
                      hasLikedAnswer
                        ? 'border-red-200 bg-red-50 text-red-600'
                        : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <svg
                      className="w-3.5 h-3.5"
                      fill={hasLikedAnswer ? 'currentColor' : 'none'}
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                    {answer.likes}
                  </button>

                  {/* Accept Button */}
                  {isQuestionAuthor &&
                    !answer.isAccepted &&
                    question.acceptedAnswerId === null && (
                      <button
                        onClick={() => handleAccept(answer.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-green-200 bg-white text-green-600 hover:bg-green-50 transition-colors text-sm font-medium"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        채택
                      </button>
                    )}
                </div>

                {/* Author + Date */}
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center">
                    <span className="text-[10px] font-bold text-indigo-600">
                      {answer.authorName.charAt(0)}
                    </span>
                  </div>
                  <span className="font-medium text-gray-700">{answer.authorName}</span>
                  <span>{timeAgo(answer.createdAt)}</span>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* No Answers */}
      {question.answers.length === 0 && (
        <div className="text-center py-12 mb-8">
          <div className="text-3xl mb-3">💬</div>
          <p className="text-gray-500">아직 답변이 없습니다. 첫 번째 답변을 작성해보세요!</p>
        </div>
      )}

      {/* Add Answer Form */}
      {user ? (
        <Card className="p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">답변 작성</h3>
          <form onSubmit={handleSubmitAnswer} className="space-y-4">
            <div className="w-full">
              <textarea
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent min-h-[160px]"
                value={answerContent}
                onChange={(e) => setAnswerContent(e.target.value)}
                placeholder="답변을 작성해주세요. 마크다운을 지원합니다."
                required
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit">답변 등록</Button>
            </div>
          </form>
        </Card>
      ) : (
        <div className="text-center py-6 bg-gray-50 rounded-xl">
          <p className="text-sm text-gray-500">
            답변을 작성하려면{' '}
            <Link to="/login" className="text-indigo-600 font-semibold hover:underline">
              로그인
            </Link>
            이 필요합니다.
          </p>
        </div>
      )}
    </div>
  )
}
