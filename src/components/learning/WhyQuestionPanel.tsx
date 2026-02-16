import { useState, useEffect } from 'react'
import { useWhyQuestionStore } from '../../store/whyQuestionStore'
import WhyQuestionItem from './WhyQuestionItem'

interface WhyQuestionPanelProps {
  sectionId: string
  userId: string
  userName: string
}

const PREDEFINED_TAGS = ['실생활', '원리', '기초', '응용', '미래', '윤리']

export default function WhyQuestionPanel({ sectionId, userId, userName }: WhyQuestionPanelProps) {
  const {
    fetchQuestions,
    addQuestion,
    toggleQuestionLike,
    toggleAnswerLike,
    addAnswer,
    acceptAnswer,
    getQuestions,
  } = useWhyQuestionStore()

  const [showForm, setShowForm] = useState(false)
  const [questionText, setQuestionText] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const questions = getQuestions(sectionId)

  useEffect(() => {
    fetchQuestions(sectionId)
  }, [sectionId, fetchQuestions])

  const handleToggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }

  const handleSubmitQuestion = () => {
    if (!questionText.trim()) return
    addQuestion(sectionId, userId, userName, questionText.trim(), selectedTags)
    setQuestionText('')
    setSelectedTags([])
    setShowForm(false)
  }

  const handleToggleLike = (questionId: string) => {
    toggleQuestionLike(questionId, userId)
  }

  const handleToggleAnswerLike = (questionId: string, answerId: string) => {
    toggleAnswerLike(questionId, answerId, userId)
  }

  const handleAddAnswer = (questionId: string, content: string) => {
    addAnswer(questionId, userId, userName, content)
  }

  const handleAcceptAnswer = (questionId: string, answerId: string) => {
    acceptAnswer(questionId, answerId)
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">❓</span>
          <h2 className="text-2xl font-bold">왜? 궁금한 것을 물어보세요!</h2>
        </div>
        <p className="text-blue-100 text-sm">
          왜 이것을 배워야 하는지, 궁금한 것을 자유롭게 질문하세요!
        </p>
      </div>

      {/* Question Count */}
      <div className="bg-blue-50 px-6 py-3 border-b border-blue-100">
        <p className="text-sm text-blue-800">
          <span className="font-semibold">{questions.length}</span>개의 질문이 있습니다
        </p>
      </div>

      {/* Question Form */}
      <div className="p-6 border-b border-gray-100">
        {!showForm ? (
          <button
            onClick={() => setShowForm(true)}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md"
          >
            + 질문하기
          </button>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                질문을 입력하세요
              </label>
              <textarea
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                placeholder="왜...?"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent resize-none"
                rows={3}
              />
            </div>

            {/* Tag Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                태그를 선택하세요 (선택사항)
              </label>
              <div className="flex flex-wrap gap-2">
                {PREDEFINED_TAGS.map((tag) => {
                  const isSelected = selectedTags.includes(tag)
                  return (
                    <button
                      key={tag}
                      onClick={() => handleToggleTag(tag)}
                      className={`px-3 py-1.5 text-sm rounded-full font-medium transition-all ${
                        isSelected
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      #{tag}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => {
                  setShowForm(false)
                  setQuestionText('')
                  setSelectedTags([])
                }}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleSubmitQuestion}
                disabled={!questionText.trim()}
                className="px-6 py-2 bg-blue-600 text-white text-sm rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                질문 등록
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Questions List */}
      <div className="p-6">
        {questions.length > 0 ? (
          <div className="space-y-4">
            {questions.map((question) => (
              <WhyQuestionItem
                key={question.id}
                question={question}
                currentUserId={userId}
                currentUserName={userName}
                onToggleLike={handleToggleLike}
                onToggleAnswerLike={handleToggleAnswerLike}
                onAddAnswer={handleAddAnswer}
                onAcceptAnswer={handleAcceptAnswer}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <span className="text-6xl mb-4 block">🙋</span>
            <p className="text-gray-500 text-sm">
              아직 질문이 없어요. 첫 번째 질문을 해보세요!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
