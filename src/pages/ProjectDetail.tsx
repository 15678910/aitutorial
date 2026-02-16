import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import { useAuthStore } from '../store/authStore'
import { useProjectStore } from '../store/projectStore'
import { PROJECT_CATEGORY_LABELS } from '../types/community'

const STATUS_CONFIG = {
  recruiting: { text: '모집 중', color: 'bg-green-100 text-green-700', banner: true },
  in_progress: { text: '진행 중', color: 'bg-blue-100 text-blue-700', banner: false },
  completed: { text: '완료', color: 'bg-gray-100 text-gray-700', banner: false },
  showcase: { text: '쇼케이스', color: 'bg-purple-100 text-purple-700', banner: false },
}

const ROLE_OPTIONS = [
  { value: 'developer', label: '개발자' },
  { value: 'designer', label: '디자이너' },
  { value: 'pm', label: '기획자' },
  { value: 'data-scientist', label: '데이터 사이언티스트' },
  { value: 'researcher', label: '연구원' },
  { value: 'other', label: '기타' },
]

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuthStore()
  const { getProject, addProjectComment, toggleProjectLike, joinProject, leaveProject } = useProjectStore()

  const [commentContent, setCommentContent] = useState('')
  const [showRoleDialog, setShowRoleDialog] = useState(false)
  const [selectedRole, setSelectedRole] = useState('developer')

  const project = id ? getProject(id) : undefined

  if (!project) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center py-20">
          <div className="text-4xl mb-4">🔍</div>
          <p className="text-gray-500 text-lg">프로젝트를 찾을 수 없습니다</p>
          <Link to="/community/projects" className="inline-block mt-4">
            <Button variant="outline">프로젝트 목록으로</Button>
          </Link>
        </div>
      </div>
    )
  }

  const statusConfig = STATUS_CONFIG[project.status]
  const categoryLabel = PROJECT_CATEGORY_LABELS[project.category]
  const isMember = user ? project.members.some(m => m.userId === user.id) : false
  const isAuthor = user?.id === project.authorId
  const isFull = project.members.length >= project.maxMembers
  const hasLiked = user ? project.likedBy.includes(user.id) : false

  const canJoin = user && !isMember && !isFull && project.status === 'recruiting'

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !commentContent.trim()) return
    addProjectComment(project.id, user.id, user.name || '익명', commentContent.trim())
    setCommentContent('')
  }

  const handleJoin = () => {
    if (!user) return
    joinProject(project.id, user.id, user.name || '익명', selectedRole)
    setShowRoleDialog(false)
  }

  const handleLeave = () => {
    if (!user) return
    leaveProject(project.id, user.id)
  }

  const handleLike = () => {
    if (!user) return
    toggleProjectLike(project.id, user.id)
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime()
    const minutes = Math.floor(diff / 60000)
    if (minutes < 1) return '방금 전'
    if (minutes < 60) return `${minutes}분 전`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}시간 전`
    const days = Math.floor(hours / 24)
    return `${days}일 전`
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Back Button */}
      <Link
        to="/community/projects"
        className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors"
      >
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        프로젝트 목록으로
      </Link>

      {/* Recruiting Banner */}
      {statusConfig.banner && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 flex items-center gap-3">
          <span className="text-xl">📢</span>
          <div>
            <p className="font-semibold text-green-800">팀원을 모집하고 있습니다!</p>
            <p className="text-sm text-green-600">
              현재 {project.members.length}/{project.maxMembers}명 - {project.maxMembers - project.members.length}자리 남았습니다
            </p>
          </div>
        </div>
      )}

      {/* Title + Badges */}
      <div className="flex flex-wrap items-start gap-3 mb-6">
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 flex-1">
          {project.title}
        </h1>
        <div className="flex gap-2 flex-shrink-0">
          <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${statusConfig.color}`}>
            {statusConfig.text}
          </span>
          <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-indigo-100 text-indigo-700">
            {categoryLabel}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Description */}
          <Card className="p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-3">프로젝트 설명</h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{project.description}</p>
          </Card>

          {/* Skills */}
          {project.skills.length > 0 && (
            <Card className="p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-3">필요 기술</h2>
              <div className="flex flex-wrap gap-2">
                {project.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </Card>
          )}

          {/* Comments Section */}
          <Card className="p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              댓글 <span className="text-gray-400 font-normal">{project.comments.length}</span>
            </h2>

            {/* Comment List */}
            {project.comments.length > 0 ? (
              <div className="space-y-4 mb-6">
                {project.comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-indigo-600">
                        {comment.userName.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold text-gray-900">{comment.userName}</span>
                        <span className="text-xs text-gray-400">{timeAgo(comment.createdAt)}</span>
                      </div>
                      <p className="text-sm text-gray-700">{comment.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-sm mb-6">아직 댓글이 없습니다. 첫 번째 댓글을 남겨보세요!</p>
            )}

            {/* Add Comment Form */}
            {user ? (
              <form onSubmit={handleAddComment} className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-indigo-600">
                    {(user.name || '?').charAt(0)}
                  </span>
                </div>
                <div className="flex-1">
                  <textarea
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent min-h-[80px] resize-none"
                    placeholder="댓글을 입력하세요..."
                    value={commentContent}
                    onChange={(e) => setCommentContent(e.target.value)}
                    required
                  />
                  <div className="flex justify-end mt-2">
                    <Button size="sm" type="submit">댓글 작성</Button>
                  </div>
                </div>
              </form>
            ) : (
              <div className="text-center py-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">
                  댓글을 작성하려면{' '}
                  <Link to="/login" className="text-indigo-600 font-semibold hover:underline">로그인</Link>
                  이 필요합니다.
                </p>
              </div>
            )}
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Action Buttons */}
          <Card className="p-6">
            <div className="space-y-3">
              {/* Like Button */}
              <button
                onClick={handleLike}
                disabled={!user}
                className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border transition-colors text-sm font-semibold ${
                  hasLiked
                    ? 'border-red-200 bg-red-50 text-red-600'
                    : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <span>{hasLiked ? '❤️' : '🤍'}</span>
                <span>좋아요 {project.likes}</span>
              </button>

              {/* Join / Leave */}
              {canJoin && (
                <Button className="w-full" onClick={() => setShowRoleDialog(true)}>
                  참여하기
                </Button>
              )}
              {isMember && !isAuthor && (
                <Button variant="outline" className="w-full" onClick={handleLeave}>
                  탈퇴하기
                </Button>
              )}
              {!user && (
                <Link to="/login" className="block">
                  <Button variant="outline" className="w-full">
                    로그인하고 참여하기
                  </Button>
                </Link>
              )}
              {isFull && !isMember && (
                <p className="text-center text-sm text-gray-400">모집이 마감되었습니다</p>
              )}
            </div>
          </Card>

          {/* Role Selection Dialog */}
          {showRoleDialog && (
            <Card className="p-6 border-2 border-indigo-200">
              <h3 className="text-sm font-bold text-gray-900 mb-3">참여 역할 선택</h3>
              <div className="space-y-2 mb-4">
                {ROLE_OPTIONS.map((role) => (
                  <label
                    key={role.value}
                    className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors ${
                      selectedRole === role.value ? 'bg-indigo-50' : 'hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value={role.value}
                      checked={selectedRole === role.value}
                      onChange={(e) => setSelectedRole(e.target.value)}
                      className="text-indigo-600"
                    />
                    <span className="text-sm">{role.label}</span>
                  </label>
                ))}
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={handleJoin}>확인</Button>
                <Button size="sm" variant="ghost" onClick={() => setShowRoleDialog(false)}>취소</Button>
              </div>
            </Card>
          )}

          {/* Members */}
          <Card className="p-6">
            <h3 className="text-sm font-bold text-gray-900 mb-3">
              팀원 <span className="text-gray-400 font-normal">{project.members.length}/{project.maxMembers}</span>
            </h3>
            <div className="space-y-3">
              {project.members.map((member) => (
                <div key={member.userId} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-indigo-600">
                      {member.userName.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{member.userName}</p>
                    <p className="text-xs text-gray-500">{member.role}</p>
                  </div>
                  {member.userId === project.authorId && (
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                      리더
                    </span>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* Project Info */}
          <Card className="p-6">
            <h3 className="text-sm font-bold text-gray-900 mb-3">프로젝트 정보</h3>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-500">생성일</dt>
                <dd className="text-gray-900 font-medium">{formatDate(project.createdAt)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">최종 수정</dt>
                <dd className="text-gray-900 font-medium">{formatDate(project.updatedAt)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">작성자</dt>
                <dd className="text-gray-900 font-medium">{project.authorName}</dd>
              </div>
              {project.relatedCourses.length > 0 && (
                <div>
                  <dt className="text-gray-500 mb-1">관련 코스</dt>
                  <dd className="flex flex-wrap gap-1">
                    {project.relatedCourses.map((course) => (
                      <span key={course} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                        {course}
                      </span>
                    ))}
                  </dd>
                </div>
              )}
            </dl>
          </Card>
        </div>
      </div>
    </div>
  )
}
