import { useState } from 'react'
import Card from '../../components/ui/Card'
import { useEnterpriseStore, type PartnerInquiry } from '../../store/enterpriseStore'

type InquiryStatus = PartnerInquiry['status'] | 'all'

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; dotColor: string }> = {
  pending: { label: '대기중', color: 'text-yellow-700', bg: 'bg-yellow-100', dotColor: 'bg-yellow-500' },
  reviewing: { label: '검토중', color: 'text-blue-700', bg: 'bg-blue-100', dotColor: 'bg-blue-500' },
  approved: { label: '승인', color: 'text-green-700', bg: 'bg-green-100', dotColor: 'bg-green-500' },
  rejected: { label: '거절', color: 'text-red-700', bg: 'bg-red-100', dotColor: 'bg-red-500' },
}

const FILTER_OPTIONS: { key: InquiryStatus; label: string }[] = [
  { key: 'all', label: '전체' },
  { key: 'pending', label: '대기중' },
  { key: 'reviewing', label: '검토중' },
  { key: 'approved', label: '승인' },
  { key: 'rejected', label: '거절' },
]

export default function PartnerManagement() {
  const { getInquiries, updateInquiryStatus } = useEnterpriseStore()
  const [filter, setFilter] = useState<InquiryStatus>('all')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [adminNoteInput, setAdminNoteInput] = useState('')
  const [expandedMessageId, setExpandedMessageId] = useState<string | null>(null)

  const allInquiries = getInquiries()
  const filteredInquiries = filter === 'all' ? allInquiries : getInquiries({ status: filter })

  const getStatusCount = (status: string): number => {
    if (status === 'all') return allInquiries.length
    return getInquiries({ status }).length
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const handleStatusChange = (id: string, status: PartnerInquiry['status']) => {
    updateInquiryStatus(id, status, adminNoteInput)
    setEditingId(null)
    setAdminNoteInput('')
  }

  const handleToggleEdit = (inquiry: PartnerInquiry) => {
    if (editingId === inquiry.id) {
      setEditingId(null)
      setAdminNoteInput('')
    } else {
      setEditingId(inquiry.id)
      setAdminNoteInput(inquiry.adminNote)
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <span className="text-2xl">&#127970;</span>
          파트너 관리
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          총 {allInquiries.length}건의 파트너 문의를 관리합니다.
        </p>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2 mb-6">
        {FILTER_OPTIONS.map((opt) => {
          const count = getStatusCount(opt.key)
          const isActive = filter === opt.key
          return (
            <button
              key={opt.key}
              onClick={() => setFilter(opt.key)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                isActive
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {opt.label}
              <span
                className={`inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-xs font-bold ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Inquiry Cards */}
      {filteredInquiries.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="text-4xl mb-4">&#128237;</div>
          <p className="text-gray-500">
            {filter === 'all' ? '아직 접수된 문의가 없습니다.' : '해당 상태의 문의가 없습니다.'}
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredInquiries.map((inquiry) => {
            const statusInfo = STATUS_CONFIG[inquiry.status] || STATUS_CONFIG.pending
            const isEditing = editingId === inquiry.id
            const isExpanded = expandedMessageId === inquiry.id

            return (
              <Card key={inquiry.id} className="p-0 overflow-hidden">
                {/* Status color bar */}
                <div className={`h-1 ${statusInfo.bg}`} />

                <div className="p-6">
                  {/* Top row: company info + actions */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="text-lg font-bold text-gray-900">{inquiry.companyName}</h3>
                        <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${statusInfo.bg} ${statusInfo.color}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dotColor}`} />
                          {statusInfo.label}
                        </span>
                        {inquiry.companyType && (
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                            {inquiry.companyType}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-400">{formatDate(inquiry.createdAt)}</div>
                    </div>
                    <button
                      onClick={() => handleToggleEdit(inquiry)}
                      className={`text-sm font-medium px-3 py-1.5 rounded-lg transition-colors ${
                        isEditing
                          ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          : 'text-teal-600 hover:bg-teal-50'
                      }`}
                    >
                      {isEditing ? '닫기' : '관리'}
                    </button>
                  </div>

                  {/* Contact + Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="text-xs font-semibold text-gray-400 mb-1">연락처 이메일</div>
                      <div className="text-sm text-gray-900">{inquiry.contactEmail}</div>
                    </div>
                    {inquiry.interestedFields && (
                      <div>
                        <div className="text-xs font-semibold text-gray-400 mb-1">관심 분야</div>
                        <div className="flex flex-wrap gap-1">
                          {inquiry.interestedFields.split(',').map((field, i) => (
                            <span
                              key={i}
                              className="text-xs bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full font-medium"
                            >
                              {field.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Message (expandable) */}
                  {inquiry.message && (
                    <div className="mb-4">
                      <div className="text-xs font-semibold text-gray-400 mb-1">문의 내용</div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p
                          className={`text-sm text-gray-700 whitespace-pre-wrap ${
                            !isExpanded && inquiry.message.length > 150 ? 'line-clamp-2' : ''
                          }`}
                        >
                          {inquiry.message}
                        </p>
                        {inquiry.message.length > 150 && (
                          <button
                            onClick={() =>
                              setExpandedMessageId(isExpanded ? null : inquiry.id)
                            }
                            className="text-xs text-teal-600 hover:text-teal-700 font-medium mt-1"
                          >
                            {isExpanded ? '접기' : '더 보기'}
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Admin Note (view mode) */}
                  {inquiry.adminNote && !isEditing && (
                    <div className="mb-4">
                      <div className="text-xs font-semibold text-gray-400 mb-1">관리자 메모</div>
                      <div className="text-sm text-gray-700 bg-blue-50 rounded-lg p-3 border border-blue-100">
                        {inquiry.adminNote}
                      </div>
                    </div>
                  )}

                  {/* Editing Panel */}
                  {isEditing && (
                    <div className="border-t border-gray-100 pt-4 mt-4">
                      <div className="mb-4">
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          관리자 메모
                        </label>
                        <textarea
                          value={adminNoteInput}
                          onChange={(e) => setAdminNoteInput(e.target.value)}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none resize-none"
                          placeholder="내부 메모를 입력하세요..."
                        />
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => handleStatusChange(inquiry.id, 'pending')}
                          className="px-4 py-2 rounded-lg text-sm font-medium bg-yellow-100 text-yellow-700 hover:bg-yellow-200 transition-colors"
                        >
                          &#9203; 대기
                        </button>
                        <button
                          onClick={() => handleStatusChange(inquiry.id, 'reviewing')}
                          className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
                        >
                          &#128269; 검토 중
                        </button>
                        <button
                          onClick={() => handleStatusChange(inquiry.id, 'approved')}
                          className="px-4 py-2 rounded-lg text-sm font-medium bg-green-100 text-green-700 hover:bg-green-200 transition-colors"
                        >
                          &#9989; 승인
                        </button>
                        <button
                          onClick={() => handleStatusChange(inquiry.id, 'rejected')}
                          className="px-4 py-2 rounded-lg text-sm font-medium bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                        >
                          &#10060; 거절
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
