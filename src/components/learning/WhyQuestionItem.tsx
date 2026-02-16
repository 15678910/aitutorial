import { useState } from 'react'
import type { WhyQuestion } from '../../types/whyQuestion'

interface WhyQuestionItemProps {
  question: WhyQuestion
  currentUserId: string
  currentUserName: string
  onToggleLike: (questionId: string) => void
  onToggleAnswerLike: (questionId: string, answerId: string) => void
  onAddAnswer: (questionId: string, content: string) => void
  onAcceptAnswer: (questionId: string, answerId: string) => void
}

const getRelativeTime = (dateString: string): string => {
  const now = new Date()
  const date = new Date(dateString)
  const diffMs = now.getTime() - date.getTime()
  const diffSeconds = Math.floor(diffMs / 1000)
  const diffMinutes = Math.floor(diffSeconds / 60)
  const diffHours = Math.floor(diffMinutes / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffSeconds < 60) return '방금 전'
  if (diffMinutes < 60) return `${diffMinutes}분 전`
  if (diffHours < 24) return `${diffHours}시간 전`
  if (diffDays < 7) return `${diffDays}일 전`
  return `${Math.floor(diffDays / 7)}주 전`
}

export default function WhyQuestionItem({
  question,
  currentUserId,
  onToggleLike,
  onToggleAnswerLike,
  onAddAnswer,
  onAcceptAnswer,
}: WhyQuestionItemProps) {
  const [showAnswers, setShowAnswers] = useState(question.answers.length === 0)
  const [showAnswerForm, setShowAnswerForm] = useState(false)
  const [answerText, setAnswerText] = useState('')

  const hasLiked = question.likedBy.includes(currentUserId)
  const isQuestionOwner = question.userId === currentUserId
  const acceptedAnswer = question.answers.find(a => a.isAccepted)

  const handleSubmitAnswer = () => {
    if (!answerText.trim()) return
    onAddAnswer(question.id, answerText.trim())
    setAnswerText('')
    setShowAnswerForm(false)
    setShowAnswers(true)
  }

  return (
    <div
      className={`bg-white rounded-lg shadow-sm border-l-4 ${
        question.isFeatured ? 'border-yellow-400' : 'border-blue-400'
      } p-4 hover:shadow-md transition-shadow`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-semibold text-gray-900">{question.userName}</span>
            <span className="text-xs text-gray-400">{getRelativeTime(question.createdAt)}</span>
            {question.isFeatured && (
              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full font-medium">
                주목 질문
              </span>
            )}
          </div>

          {/* Tags */}
          {question.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {question.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Question Text */}
      <p className="text-gray-800 font-medium mb-3 text-sm leading-relaxed">{question.question}</p>

      {/* Like Button */}
      <div className="flex items-center gap-4 mb-3">
        <button
          onClick={() => onToggleLike(question.id)}
          className={`flex items-center gap-1 text-sm transition-colors ${
            hasLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
          }`}
        >
          <span className="text-base">{hasLiked ? '❤️' : '🤍'}</span>
          {question.likes > 0 && <span className="font-medium">{question.likes}</span>}
        </button>

        {/* Answer Count */}
        <button
          onClick={() => setShowAnswers(!showAnswers)}
          className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600 transition-colors"
        >
          <span>💬</span>
          <span>답변 {question.answers.length}</span>
        </button>
      </div>

      {/* Answers Section */}
      {showAnswers && (
        <div className="border-t border-gray-100 pt-3 mt-3">
          {question.answers.length > 0 ? (
            <div className="space-y-3 mb-3">
              {/* Accepted Answer First */}
              {acceptedAnswer && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex items-start gap-2 mb-2">
                    <span className="text-green-600 text-lg">✅</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm text-gray-900">
                          {acceptedAnswer.userName}
                        </span>
                        <span className="text-xs bg-green-600 text-white px-2 py-0.5 rounded-full">
                          채택됨
                        </span>
                        <span className="text-xs text-gray-400">
                          {getRelativeTime(acceptedAnswer.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">{acceptedAnswer.content}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <button
                          onClick={() => onToggleAnswerLike(question.id, acceptedAnswer.id)}
                          className={`flex items-center gap-1 text-xs transition-colors ${
                            acceptedAnswer.likedBy.includes(currentUserId)
                              ? 'text-red-500'
                              : 'text-gray-500 hover:text-red-500'
                          }`}
                        >
                          <span>
                            {acceptedAnswer.likedBy.includes(currentUserId) ? '❤️' : '🤍'}
                          </span>
                          {acceptedAnswer.likes > 0 && <span>{acceptedAnswer.likes}</span>}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Other Answers */}
              {question.answers
                .filter(a => !a.isAccepted)
                .map((answer) => (
                  <div key={answer.id} className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-sm text-gray-900">
                            {answer.userName}
                          </span>
                          <span className="text-xs text-gray-400">
                            {getRelativeTime(answer.createdAt)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed">{answer.content}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => onToggleAnswerLike(question.id, answer.id)}
                        className={`flex items-center gap-1 text-xs transition-colors ${
                          answer.likedBy.includes(currentUserId)
                            ? 'text-red-500'
                            : 'text-gray-500 hover:text-red-500'
                        }`}
                      >
                        <span>{answer.likedBy.includes(currentUserId) ? '❤️' : '🤍'}</span>
                        {answer.likes > 0 && <span>{answer.likes}</span>}
                      </button>
                      {isQuestionOwner && !acceptedAnswer && (
                        <button
                          onClick={() => onAcceptAnswer(question.id, answer.id)}
                          className="text-xs text-green-600 hover:text-green-700 font-medium transition-colors"
                        >
                          채택하기
                        </button>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 mb-3 text-center py-2">
              아직 답변이 없어요. 첫 번째 답변을 작성해보세요!
            </p>
          )}

          {/* Answer Form */}
          {!showAnswerForm ? (
            <button
              onClick={() => setShowAnswerForm(true)}
              className="w-full text-sm text-blue-600 hover:text-blue-700 font-medium py-2 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
            >
              + 답변 달기
            </button>
          ) : (
            <div className="space-y-2">
              <textarea
                value={answerText}
                onChange={(e) => setAnswerText(e.target.value)}
                placeholder="답변을 작성해주세요..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent resize-none"
                rows={3}
              />
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => {
                    setShowAnswerForm(false)
                    setAnswerText('')
                  }}
                  className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={handleSubmitAnswer}
                  disabled={!answerText.trim()}
                  className="px-4 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  등록
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
