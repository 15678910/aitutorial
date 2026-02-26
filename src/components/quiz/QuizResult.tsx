import { useProgressStore } from '../../store/progressStore'
import Button from '../ui/Button'

interface QuizResultProps {
  correct: number
  total: number
  sectionId: string
  onRetry?: () => void
}

export default function QuizResult({ correct, total, sectionId, onRetry }: QuizResultProps) {
  const percentage = Math.round((correct / total) * 100)
  const isPassed = percentage >= 60

  const { getQuizAttempts } = useProgressStore()
  const attemptCount = getQuizAttempts(sectionId)
  const remainingAttempts = Math.max(0, 3 - attemptCount)

  const handleRetry = () => {
    if (onRetry) {
      onRetry()
    }
  }

  return (
    <div className="bg-surface border border-gray-200 rounded-xl p-8 text-center">
      <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${isPassed ? 'bg-accent/10' : 'bg-red-100'}`}>
        <span className="text-3xl">{isPassed ? '🎉' : '📝'}</span>
      </div>

      {/* Pass/Fail Status */}
      <div className={`inline-block px-4 py-1.5 rounded-full text-sm font-bold mb-3 ${
        isPassed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
      }`}>
        {isPassed ? '✓ 합격' : '✗ 불합격'}
      </div>

      <h3 className="text-2xl font-bold text-gray-900 mb-2">{isPassed ? '잘했습니다!' : '다시 도전해보세요'}</h3>
      <p className="text-gray-600 mb-4">{total}문제 중 <span className="font-bold text-accent">{correct}문제</span> 정답</p>
      <div className="text-4xl font-bold mb-2" style={{ color: isPassed ? '#32c2a2' : '#ef4444' }}>{percentage}점</div>
      <p className="text-sm text-gray-500 mb-4">
        {isPassed ? '이 섹션을 완료했습니다.' : '60점 이상이면 통과입니다.'}
      </p>

      {/* Remaining Attempts */}
      {!isPassed && remainingAttempts > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-3">남은 기회: <span className="font-bold">{remainingAttempts}회</span></p>
          <Button onClick={handleRetry} size="sm">재응시</Button>
        </div>
      )}

      {!isPassed && remainingAttempts === 0 && (
        <p className="text-sm text-red-600 mt-4">최대 응시 횟수에 도달했습니다.</p>
      )}
    </div>
  )
}
