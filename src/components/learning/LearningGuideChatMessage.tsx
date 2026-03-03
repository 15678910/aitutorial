import type { GuideMessage } from '../../types/learningGuide'

interface LearningGuideChatMessageProps {
  message: GuideMessage
}

function getRelativeTime(dateString: string): string {
  const now = Date.now()
  const then = new Date(dateString).getTime()
  const diffSeconds = Math.floor((now - then) / 1000)

  if (diffSeconds < 10) return '방금 전'
  if (diffSeconds < 60) return `${diffSeconds}초 전`

  const diffMinutes = Math.floor(diffSeconds / 60)
  if (diffMinutes < 60) return `${diffMinutes}분 전`

  const diffHours = Math.floor(diffMinutes / 60)
  if (diffHours < 24) return `${diffHours}시간 전`

  const diffDays = Math.floor(diffHours / 24)
  return `${diffDays}일 전`
}

export default function LearningGuideChatMessage({ message }: LearningGuideChatMessageProps) {
  const isUser = message.role === 'user'
  const isAssistant = message.role === 'assistant'

  if (message.isTyping) {
    return (
      <div className="flex items-start gap-2">
        <div className="w-7 h-7 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 text-sm">
          🤖
        </div>
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-2xl rounded-tl-sm px-4 py-3 max-w-[80%]">
          <div className="flex items-center gap-1">
            <span className="inline-block w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="inline-block w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="inline-block w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
    )
  }

  if (isUser) {
    return (
      <div className="flex items-start gap-2 justify-end">
        <div className="bg-gray-100 rounded-2xl rounded-tr-sm px-4 py-2.5 max-w-[80%]">
          <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">{message.content}</p>
          <div className="text-[10px] text-gray-400 mt-1 text-right">
            {getRelativeTime(message.createdAt)}
          </div>
        </div>
      </div>
    )
  }

  if (isAssistant) {
    return (
      <div className="flex items-start gap-2">
        <div className="w-7 h-7 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 text-sm">
          🤖
        </div>
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-2xl rounded-tl-sm px-4 py-2.5 max-w-[80%]">
          <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">{message.content}</p>
          <div className="text-[10px] text-gray-400 mt-1">
            {getRelativeTime(message.createdAt)}
          </div>
        </div>
      </div>
    )
  }

  // system messages (unlikely to render, but just in case)
  return (
    <div className="text-center">
      <span className="text-xs text-gray-400 bg-gray-50 px-3 py-1 rounded-full">{message.content}</span>
    </div>
  )
}
