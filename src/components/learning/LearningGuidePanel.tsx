import { useState, useEffect, useRef } from 'react'
import type { DiagnosticResult, SectionContext } from '../../types/learningGuide'
import { useLearningGuideStore } from '../../store/learningGuideStore'
import LearningGuideDiagnostic from './LearningGuideDiagnostic'
import LearningGuideChatMessage from './LearningGuideChatMessage'

interface LearningGuidePanelProps {
  sectionId: string
  sectionTitle?: string
  chapterTitle?: string
  courseSlug?: string
  sectionContent?: string
}

const quickActionsByLevel: Record<string, string[]> = {
  beginner: ['쉽게 설명해줘', '실생활 예시', '왜 중요해?'],
  intermediate: ['더 자세히', '비교해줘', '퀴즈 내줘'],
  advanced: ['응용 사례', '심화 문제', '관련 주제'],
}

export default function LearningGuidePanel({
  sectionId,
  sectionTitle = '',
  chapterTitle = '',
  courseSlug = '',
  sectionContent = '',
}: LearningGuidePanelProps) {
  const {
    mode,
    isOpen,
    isLoading,
    toggleOpen,
    detectMode,
    saveDiagnosticResult,
    getDiagnosticResult,
    sendMessage,
    getMessages,
    addMessage,
  } = useLearningGuideStore()

  const [inputValue, setInputValue] = useState('')
  const [hasAddedWelcome, setHasAddedWelcome] = useState(false)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  const diagnosticResult = getDiagnosticResult(sectionId)
  const messages = getMessages(sectionId)

  const sectionContext: SectionContext = {
    sectionId,
    sectionTitle,
    chapterTitle,
    courseSlug,
    sectionContent,
  }

  // Detect mode on mount
  useEffect(() => {
    detectMode()
  }, [detectMode])

  // Add welcome message when diagnostic is completed and chat first opens
  useEffect(() => {
    if (diagnosticResult && messages.length === 0 && !hasAddedWelcome) {
      const welcomeContent =
        mode === 'ai'
          ? `안녕하세요! AI 학습 친구예요. 📚 '${sectionTitle}'에 대해 궁금한 것을 물어보세요!`
          : `안녕하세요! 학습 가이드예요. 📚 아래 버튼을 눌러 질문해보세요!`

      addMessage(sectionId, {
        id: `welcome-${sectionId}-${Date.now()}`,
        role: 'assistant',
        content: welcomeContent,
        createdAt: new Date().toISOString(),
      })
      setHasAddedWelcome(true)
    }
  }, [diagnosticResult, messages.length, hasAddedWelcome, mode, sectionId, sectionTitle, addMessage])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages])

  const handleDiagnosticComplete = (result: DiagnosticResult) => {
    saveDiagnosticResult(sectionId, result)
  }

  const handleSendMessage = (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || isLoading) return
    setInputValue('')
    sendMessage(sectionId, trimmed, sectionContext)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage(inputValue)
    }
  }

  const levelLabels: Record<string, { label: string; color: string }> = {
    beginner: { label: '초급', color: 'bg-green-100 text-green-700' },
    intermediate: { label: '중급', color: 'bg-blue-100 text-blue-700' },
    advanced: { label: '고급', color: 'bg-purple-100 text-purple-700' },
  }

  const quickActions = diagnosticResult
    ? quickActionsByLevel[diagnosticResult.level] || quickActionsByLevel.beginner
    : quickActionsByLevel.beginner

  // Collapsed state
  if (!isOpen) {
    return (
      <button
        onClick={toggleOpen}
        className="w-full flex items-center justify-between px-5 py-4 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md hover:shadow-lg transition-all hover:from-green-600 hover:to-emerald-700"
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">📚</span>
          <span className="font-bold text-base">학습 가이드</span>
        </div>
        <div className="flex items-center gap-2">
          {mode === 'ai' && (
            <span className="px-2 py-0.5 text-[10px] font-semibold bg-white/20 rounded-full">
              AI
            </span>
          )}
          {mode === 'local' && (
            <span className="px-2 py-0.5 text-[10px] font-semibold bg-white/20 rounded-full">
              로컬
            </span>
          )}
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>
    )
  }

  // Expanded state
  return (
    <div className="rounded-xl border border-green-200 bg-white shadow-lg overflow-hidden">
      {/* Header */}
      <button
        onClick={toggleOpen}
        className="w-full flex items-center justify-between px-5 py-3.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white"
      >
        <div className="flex items-center gap-3">
          <span className="text-lg">📚</span>
          <span className="font-bold text-sm">학습 가이드</span>
        </div>
        <div className="flex items-center gap-2">
          {diagnosticResult && (
            <>
              {mode === 'ai' ? (
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-purple-500/80 rounded-full">
                  🤖 AI 모드
                </span>
              ) : (
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-gray-500/60 rounded-full">
                  💬 로컬 모드
                </span>
              )}
              <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full ${
                diagnosticResult.level === 'beginner'
                  ? 'bg-green-300/40'
                  : diagnosticResult.level === 'intermediate'
                    ? 'bg-blue-300/40'
                    : 'bg-purple-300/40'
              }`}>
                {levelLabels[diagnosticResult.level]?.label}
              </span>
            </>
          )}
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </div>
      </button>

      {/* Body */}
      {!diagnosticResult ? (
        // Show diagnostic
        <LearningGuideDiagnostic onComplete={handleDiagnosticComplete} />
      ) : (
        // Show chat interface
        <div className="flex flex-col" style={{ maxHeight: '480px' }}>
          {/* Messages area */}
          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto px-4 py-4 space-y-3"
            style={{ minHeight: '200px', maxHeight: '320px' }}
          >
            {messages.map((msg) => (
              <LearningGuideChatMessage key={msg.id} message={msg} />
            ))}
          </div>

          {/* Quick action chips */}
          <div className="px-4 pb-2 flex flex-wrap gap-1.5">
            {quickActions.map((action) => (
              <button
                key={action}
                onClick={() => handleSendMessage(action)}
                disabled={isLoading}
                className="px-3 py-1.5 text-xs font-medium rounded-full border border-green-200 text-green-700 bg-green-50 hover:bg-green-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {action}
              </button>
            ))}
          </div>

          {/* Input area */}
          <div className="px-4 pb-4 pt-2 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="궁금한 것을 물어보세요..."
                disabled={isLoading}
                className="flex-1 px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <button
                onClick={() => handleSendMessage(inputValue)}
                disabled={isLoading || !inputValue.trim()}
                className="px-4 py-2.5 rounded-xl bg-green-500 text-white font-semibold text-sm hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
              >
                전송
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
