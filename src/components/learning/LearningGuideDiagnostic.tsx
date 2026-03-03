import { useState } from 'react'
import type { DiagnosticResult, DiagnosticOption } from '../../types/learningGuide'
import { diagnosticQuestions } from '../../data/learningGuideDiagnosticData'
import { calculateDiagnosticResult } from '../../lib/learningGuideDiagnostic'

interface LearningGuideDiagnosticProps {
  onComplete: (result: DiagnosticResult) => void
}

const levelLabels: Record<string, { label: string; color: string; bgColor: string }> = {
  beginner: { label: '초급', color: 'text-green-700', bgColor: 'bg-green-100 border-green-300' },
  intermediate: { label: '중급', color: 'text-blue-700', bgColor: 'bg-blue-100 border-blue-300' },
  advanced: { label: '고급', color: 'text-purple-700', bgColor: 'bg-purple-100 border-purple-300' },
}

const styleDescriptions: Record<string, string> = {
  visual: '그림/비유로 설명',
  textual: '차근차근 글로 설명',
  'example-based': '예시로 설명',
}

export default function LearningGuideDiagnostic({ onComplete }: LearningGuideDiagnosticProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedOptions, setSelectedOptions] = useState<DiagnosticOption[]>([])
  const [result, setResult] = useState<DiagnosticResult | null>(null)

  const totalQuestions = diagnosticQuestions.length
  const isFinished = result !== null

  const handleSelectOption = (option: DiagnosticOption) => {
    const newSelections = [...selectedOptions, option]
    setSelectedOptions(newSelections)

    if (currentStep < totalQuestions - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      // All questions answered, calculate result
      const diagnosticResult = calculateDiagnosticResult(newSelections)
      setResult(diagnosticResult)
    }
  }

  if (isFinished && result) {
    const levelInfo = levelLabels[result.level]
    const styleDesc = styleDescriptions[result.style]

    return (
      <div className="p-5">
        {/* Result header */}
        <div className="text-center mb-6">
          <div className="text-4xl mb-3">🎉</div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">진단 완료!</h3>
          <p className="text-sm text-gray-500">나에게 딱 맞는 학습 설정을 찾았어요</p>
        </div>

        {/* Result cards */}
        <div className="space-y-3 mb-6">
          {/* Level badge */}
          <div className={`flex items-center gap-3 p-4 rounded-xl border ${levelInfo.bgColor}`}>
            <span className="text-2xl">📊</span>
            <div>
              <div className="text-xs text-gray-500 font-medium mb-0.5">나의 수준</div>
              <div className={`text-base font-bold ${levelInfo.color}`}>{levelInfo.label}</div>
            </div>
          </div>

          {/* Style badge */}
          <div className="flex items-center gap-3 p-4 rounded-xl border bg-amber-50 border-amber-200">
            <span className="text-2xl">🎨</span>
            <div>
              <div className="text-xs text-gray-500 font-medium mb-0.5">학습 스타일</div>
              <div className="text-base font-bold text-amber-700">{styleDesc}</div>
            </div>
          </div>
        </div>

        {/* Start button */}
        <button
          onClick={() => onComplete(result)}
          className="w-full py-3 px-6 rounded-xl text-white font-bold text-base bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg"
        >
          학습 시작하기
        </button>
      </div>
    )
  }

  const question = diagnosticQuestions[currentStep]

  return (
    <div className="p-5">
      {/* Progress indicator */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-semibold text-gray-500">
          {currentStep + 1}/{totalQuestions}
        </span>
        <div className="flex-1 mx-3 h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="mb-5">
        <h3 className="text-base font-bold text-gray-900 leading-relaxed">
          {question.question}
        </h3>
      </div>

      {/* Options */}
      <div className="space-y-2.5">
        {question.options.map((option) => (
          <button
            key={option.value}
            onClick={() => handleSelectOption(option)}
            className="w-full text-left px-4 py-3 rounded-xl border border-gray-200 bg-white hover:border-green-400 hover:bg-green-50 transition-all text-sm text-gray-700 font-medium hover:shadow-sm"
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  )
}
