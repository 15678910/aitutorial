import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'
import SkillTag from '../components/community/SkillTag'
import { useAuthStore } from '../store/authStore'
import { useWikiStore } from '../store/wikiStore'

export default function WikiArticle() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { getArticle, editArticle, incrementViews } = useWikiStore()

  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState('')
  const [editSummary, setEditSummary] = useState('')
  const [showHistory, setShowHistory] = useState(false)

  const article = slug ? getArticle(slug) : null

  // Increment views on mount
  useEffect(() => {
    if (slug) {
      incrementViews(slug)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug])

  if (!article) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center py-20">
          <div className="text-4xl mb-4">📄</div>
          <p className="text-gray-500 text-lg">문서를 찾을 수 없습니다</p>
          <Link to="/community/wiki" className="inline-block mt-4">
            <Button variant="outline">위키 목록으로</Button>
          </Link>
        </div>
      </div>
    )
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime()
    const minutes = Math.floor(diff / 60000)
    if (minutes < 1) return '방금 전'
    if (minutes < 60) return `${minutes}분 전`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}시간 전`
    const days = Math.floor(hours / 24)
    if (days < 30) return `${days}일 전`
    const months = Math.floor(days / 30)
    return `${months}개월 전`
  }

  const handleStartEdit = () => {
    if (!user) {
      navigate('/login')
      return
    }
    setEditContent(article.content)
    setEditSummary('')
    setIsEditing(true)
  }

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !editContent.trim() || !editSummary.trim()) return
    editArticle(article.slug, editContent.trim(), user.id, user.name || '익명', editSummary.trim())
    setIsEditing(false)
    setEditContent('')
    setEditSummary('')
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setEditContent('')
    setEditSummary('')
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Back Button */}
      <Link
        to="/community/wiki"
        className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors"
      >
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        위키 목록으로
      </Link>

      {/* Article Title */}
      <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-4">
        {article.title}
      </h1>

      {/* Meta Info */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-purple-100 text-purple-700">
          {article.category}
        </span>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center">
            <span className="text-[10px] font-bold text-indigo-600">
              {article.authorName.charAt(0)}
            </span>
          </div>
          <span>작성: <span className="font-medium text-gray-700">{article.authorName}</span></span>
        </div>
        {article.lastEditorId !== article.authorId && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
              <span className="text-[10px] font-bold text-green-600">
                {article.lastEditorName.charAt(0)}
              </span>
            </div>
            <span>최종 편집: <span className="font-medium text-gray-700">{article.lastEditorName}</span></span>
          </div>
        )}
        <span className="text-sm text-gray-500">
          {formatDate(article.updatedAt)} 업데이트
        </span>
        <span className="flex items-center gap-1 text-sm text-gray-500">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          {article.views}
        </span>
      </div>

      {/* Edit Mode */}
      {isEditing ? (
        <Card className="p-6 mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">문서 편집</h3>
          <form onSubmit={handleSaveEdit} className="space-y-4">
            <div className="w-full">
              <label htmlFor="edit-content" className="block text-sm font-medium text-gray-700 mb-1">
                내용 (마크다운)
              </label>
              <textarea
                id="edit-content"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent min-h-[400px] font-mono text-sm"
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                required
              />
            </div>

            <Input
              label="편집 요약"
              id="edit-summary"
              value={editSummary}
              onChange={(e) => setEditSummary(e.target.value)}
              placeholder="어떤 내용을 수정했는지 간략히 설명해주세요"
              required
            />

            <div className="flex gap-3 pt-2">
              <Button type="submit">저장</Button>
              <Button variant="ghost" type="button" onClick={handleCancelEdit}>
                취소
              </Button>
            </div>
          </form>
        </Card>
      ) : (
        <>
          {/* Article Content */}
          <Card className="p-6 md:p-8 mb-6">
            <div className="prose prose-gray max-w-none">
              <ReactMarkdown>{article.content}</ReactMarkdown>
            </div>
          </Card>

          {/* Tags */}
          {article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {article.tags.map((tag) => (
                <SkillTag key={tag} skill={tag} size="md" />
              ))}
            </div>
          )}

          {/* Edit Button */}
          <div className="flex gap-3 mb-8">
            <Button onClick={handleStartEdit} variant="outline">
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                편집하기
              </span>
            </Button>
          </div>
        </>
      )}

      {/* Edit History */}
      <Card className="p-6">
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="flex items-center justify-between w-full text-left"
        >
          <h3 className="text-lg font-bold text-gray-900">
            편집 기록
            <span className="text-gray-400 font-normal text-base ml-2">
              {article.editHistory.length}건
            </span>
          </h3>
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform ${
              showHistory ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {showHistory && (
          <div className="mt-4">
            {article.editHistory.length > 0 ? (
              <div className="space-y-3">
                {[...article.editHistory]
                  .sort(
                    (a, b) =>
                      new Date(b.editedAt).getTime() - new Date(a.editedAt).getTime()
                  )
                  .map((edit) => (
                    <div
                      key={edit.id}
                      className="flex items-start gap-3 p-3 rounded-lg bg-gray-50"
                    >
                      <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-indigo-600">
                          {edit.editorName.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-sm font-semibold text-gray-900">
                            {edit.editorName}
                          </span>
                          <span className="text-xs text-gray-400">
                            {timeAgo(edit.editedAt)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{edit.summary}</p>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 py-4 text-center">
                아직 편집 기록이 없습니다
              </p>
            )}
          </div>
        )}
      </Card>
    </div>
  )
}
