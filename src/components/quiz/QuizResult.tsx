interface QuizResultProps {
  correct: number
  total: number
}

export default function QuizResult({ correct, total }: QuizResultProps) {
  const percentage = Math.round((correct / total) * 100)
  const isPassed = percentage >= 60

  return (
    <div className="bg-surface border border-gray-200 rounded-xl p-8 text-center">
      <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${isPassed ? 'bg-accent/10' : 'bg-red-100'}`}>
        <span className="text-3xl">{isPassed ? '\uD83C\uDF89' : '\uD83D\uDCDD'}</span>
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-2">{isPassed ? '잘했습니다!' : '다시 도전해보세요'}</h3>
      <p className="text-gray-600 mb-4">{total}문제 중 <span className="font-bold text-accent">{correct}문제</span> 정답</p>
      <div className="text-4xl font-bold mb-2" style={{ color: isPassed ? '#32c2a2' : '#ef4444' }}>{percentage}점</div>
      <p className="text-sm text-gray-500">{isPassed ? '이 섹션을 완료했습니다.' : '60점 이상이면 통과입니다.'}</p>
    </div>
  )
}
