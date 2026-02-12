import { useState, useEffect } from 'react'
import { useEssayStore } from '../../hooks/useEssay'
import { useAuthStore } from '../../store/authStore'
import Button from '../ui/Button'

interface EssaySubmitProps {
  courseId: string
  chapterId: string
  prompt: string
  onSubmit: () => void
}

export default function EssaySubmit({ courseId, chapterId, prompt, onSubmit }: EssaySubmitProps) {
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { user } = useAuthStore()
  const { essays, submitEssay } = useEssayStore()

  const key = `${courseId}-${chapterId}`
  const existingEssay = essays.get(key)

  const minLength = 200
  const isValidLength = content.length >= minLength
  const charCount = content.length

  useEffect(() => {
    if (existingEssay) {
      setContent(existingEssay.content)
    }
  }, [existingEssay])

  const handleSubmit = async () => {
    if (!user || !isValidLength) return

    setIsSubmitting(true)
    try {
      const success = await submitEssay(user.id, courseId, chapterId, prompt, content)
      if (success) {
        onSubmit()
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  if (existingEssay) {
    return (
      <div className="bg-surface border border-gray-200 rounded-xl p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">제출된 에세이</h3>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            {existingEssay.status === 'submitted' && '제출됨'}
            {existingEssay.status === 'reviewing' && '리뷰 중'}
            {existingEssay.status === 'reviewed' && '리뷰 완료'}
          </div>
        </div>
        <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
          <p className="text-sm font-medium text-gray-700 mb-2">문제:</p>
          <p className="text-gray-900 mb-4">{existingEssay.prompt}</p>
          <p className="text-sm font-medium text-gray-700 mb-2">제출한 답변:</p>
          <p className="text-gray-900 whitespace-pre-wrap">{existingEssay.content}</p>
        </div>
        <div className="text-sm text-gray-500">
          제출일: {new Date(existingEssay.createdAt).toLocaleString('ko-KR')}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-surface border border-gray-200 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">에세이 작성</h3>

      <div className="mb-4 p-4 bg-blue-50 border border-blue-100 rounded-lg">
        <p className="text-sm font-medium text-blue-900 mb-1">문제</p>
        <p className="text-gray-900">{prompt}</p>
      </div>

      <div className="mb-2">
        <label htmlFor="essay-content" className="block text-sm font-medium text-gray-700 mb-2">
          답변 작성
        </label>
        <textarea
          id="essay-content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="에세이를 작성해주세요. (최소 200자)"
          className="w-full min-h-[300px] p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-y"
          disabled={isSubmitting}
        />
      </div>

      <div className="flex items-center justify-between mb-4">
        <span className={`text-sm ${isValidLength ? 'text-green-600' : 'text-gray-500'}`}>
          {charCount} / {minLength}자
          {isValidLength && ' ✓'}
        </span>
        {!isValidLength && (
          <span className="text-xs text-gray-500">
            {minLength - charCount}자 더 입력해주세요
          </span>
        )}
      </div>

      <div className="flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={!isValidLength || isSubmitting}
          size="md"
        >
          {isSubmitting ? '제출 중...' : '에세이 제출'}
        </Button>
      </div>
    </div>
  )
}
