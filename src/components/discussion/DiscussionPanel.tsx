import { useState } from 'react'
import { Link } from 'react-router-dom'
import DiscussionItem from './DiscussionItem'
import { useAuthStore } from '../../store/authStore'
import { useDiscussionStore } from '../../store/discussionStore'

interface DiscussionPanelProps {
  sectionId: string
}

export default function DiscussionPanel({ sectionId }: DiscussionPanelProps) {
  const { user } = useAuthStore()
  const { getDiscussions, addDiscussion } = useDiscussionStore()
  const [isExpanded, setIsExpanded] = useState(true)
  const [newComment, setNewComment] = useState('')

  const discussions = getDiscussions(sectionId)

  const handleSubmit = () => {
    if (!user || !newComment.trim()) return
    addDiscussion(sectionId, user.id, user.name || user.email, newComment.trim())
    setNewComment('')
  }

  return (
    <div className="mt-12 pt-6 border-t border-gray-200">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full text-left mb-4"
      >
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <span>💬 토론</span>
          {discussions.length > 0 && (
            <span className="text-sm font-normal text-gray-500">({discussions.length})</span>
          )}
        </h2>
        <span className="text-gray-400">
          {isExpanded ? '▼' : '▶'}
        </span>
      </button>

      {isExpanded && (
        <div>
          {/* Comment Input */}
          {user ? (
            <div className="mb-6">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="학습 내용에 대한 의견을 남겨보세요..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                rows={3}
              />
              <div className="mt-2 flex justify-end">
                <button
                  onClick={handleSubmit}
                  disabled={!newComment.trim()}
                  className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  댓글 작성
                </button>
              </div>
            </div>
          ) : (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200 text-center">
              <p className="text-sm text-gray-600 mb-2">
                로그인 후 토론에 참여할 수 있습니다
              </p>
              <Link
                to="/login"
                className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
              >
                로그인하기 →
              </Link>
            </div>
          )}

          {/* Discussions List */}
          {discussions.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {discussions.map((discussion) => (
                <DiscussionItem key={discussion.id} discussion={discussion} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400 text-sm">
              아직 토론이 없습니다. 첫 번째 댓글을 남겨보세요!
            </div>
          )}
        </div>
      )}
    </div>
  )
}
