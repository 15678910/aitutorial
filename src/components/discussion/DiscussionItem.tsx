import { useState } from 'react'
import type { Discussion } from '../../types/discussion'
import { useAuthStore } from '../../store/authStore'
import { useDiscussionStore } from '../../store/discussionStore'

interface DiscussionItemProps {
  discussion: Discussion
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
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}주 전`
  if (diffDays < 365) return `${Math.floor(diffDays / 30)}개월 전`
  return `${Math.floor(diffDays / 365)}년 전`
}

const getUserColor = (userName: string): string => {
  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-red-500',
    'bg-yellow-500',
    'bg-teal-500',
  ]
  const hash = userName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return colors[hash % colors.length]
}

export default function DiscussionItem({ discussion }: DiscussionItemProps) {
  const { user } = useAuthStore()
  const { addReply, toggleLike } = useDiscussionStore()
  const [showReplyInput, setShowReplyInput] = useState(false)
  const [replyContent, setReplyContent] = useState('')

  const handleReplySubmit = () => {
    if (!user || !replyContent.trim()) return
    addReply(discussion.id, user.id, user.name || user.email, replyContent.trim())
    setReplyContent('')
    setShowReplyInput(false)
  }

  const handleLike = () => {
    if (!user) return
    toggleLike(discussion.id, user.id)
  }

  const hasLiked = user ? discussion.likedBy.includes(user.id) : false

  return (
    <div className="py-4">
      <div className="flex gap-3">
        {/* Avatar */}
        <div className={`w-10 h-10 rounded-full ${getUserColor(discussion.userName)} flex items-center justify-center text-white font-semibold flex-shrink-0`}>
          {discussion.userName.charAt(0).toUpperCase()}
        </div>

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-baseline gap-2 mb-1">
            <span className="font-medium text-gray-900">{discussion.userName}</span>
            <span className="text-xs text-gray-400">{getRelativeTime(discussion.createdAt)}</span>
          </div>

          {/* Content */}
          <p className="text-gray-700 text-sm mb-3 whitespace-pre-wrap">{discussion.content}</p>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleLike}
              disabled={!user}
              className={`flex items-center gap-1 text-sm transition-colors ${
                hasLiked
                  ? 'text-red-500'
                  : 'text-gray-500 hover:text-red-500'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <span>{hasLiked ? '♥' : '♡'}</span>
              {discussion.likes > 0 && <span>{discussion.likes}</span>}
            </button>

            <button
              onClick={() => setShowReplyInput(!showReplyInput)}
              disabled={!user}
              className="text-sm text-gray-500 hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              답글
            </button>
          </div>

          {/* Reply Input */}
          {showReplyInput && user && (
            <div className="mt-3 flex gap-2">
              <input
                type="text"
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleReplySubmit()
                  }
                }}
                placeholder="답글을 입력하세요..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
              <button
                onClick={handleReplySubmit}
                disabled={!replyContent.trim()}
                className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                등록
              </button>
            </div>
          )}

          {/* Replies */}
          {discussion.replies.length > 0 && (
            <div className="mt-4 space-y-3">
              {discussion.replies.map((reply) => (
                <div key={reply.id} className="flex gap-3">
                  <div className={`w-8 h-8 rounded-full ${getUserColor(reply.userName)} flex items-center justify-center text-white text-sm font-semibold flex-shrink-0`}>
                    {reply.userName.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="font-medium text-gray-900 text-sm">{reply.userName}</span>
                      <span className="text-xs text-gray-400">{getRelativeTime(reply.createdAt)}</span>
                    </div>
                    <p className="text-gray-700 text-sm whitespace-pre-wrap">{reply.content}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
