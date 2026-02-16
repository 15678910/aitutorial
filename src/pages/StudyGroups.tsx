import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useCourseList } from '../hooks/useCourse'
import { getMissionsForCourse } from '../data/groupMissions'
import GroupMissionCard from '../components/community/GroupMission'
import Button from '../components/ui/Button'
import { getCourseTheme } from '../lib/courseThemes'
import type { StudyGroup } from '../types/studyGroup'

// Mock study group store hooks (replace with actual store when available)
const useStudyGroupStore = () => {
  const [groups] = useState<StudyGroup[]>([
    {
      id: 'group-1',
      name: 'AI 입문 스터디',
      description: '초등학생을 위한 AI 기초 스터디 그룹입니다. 함께 배워요!',
      courseSlug: 'ai-intro',
      creatorId: 'sample-user-1',
      creatorName: '김민수',
      members: [
        { userId: 'sample-user-1', userName: '김민수', role: 'leader', joinedAt: '2024-01-15' },
        { userId: 'sample-user-2', userName: '이영희', role: 'member', joinedAt: '2024-01-16' },
        { userId: 'sample-user-3', userName: '박철수', role: 'member', joinedAt: '2024-01-17' },
      ],
      maxMembers: 5,
      isOpen: true,
      createdAt: '2024-01-15',
      activeMissionId: 'mission-school-ai',
      completedMissions: [],
    },
    {
      id: 'group-2',
      name: '머신러닝 탐험대',
      description: '머신러닝 기초를 함께 배우는 스터디 그룹',
      courseSlug: 'ml-basics',
      creatorId: 'sample-user-4',
      creatorName: '최지훈',
      members: [
        { userId: 'sample-user-4', userName: '최지훈', role: 'leader', joinedAt: '2024-01-20' },
        { userId: 'sample-user-5', userName: '정수연', role: 'member', joinedAt: '2024-01-21' },
      ],
      maxMembers: 6,
      isOpen: true,
      createdAt: '2024-01-20',
      activeMissionId: null,
      completedMissions: [],
    },
  ])

  const [missionProgress] = useState<Record<string, any>>({
    'group-1': {
      groupId: 'group-1',
      missionId: 'mission-school-ai',
      startedAt: '2024-01-25',
      completedSteps: ['step1'],
      isCompleted: false,
      completedAt: null,
    },
  })

  return {
    createGroup: (data: any) => {
      console.log('Creating group:', data)
      alert('그룹이 생성되었습니다!')
    },
    joinGroup: (groupId: string, userId: string) => {
      console.log('Joining group:', groupId, userId)
      alert('그룹에 참여했습니다!')
    },
    leaveGroup: (groupId: string, userId: string) => {
      console.log('Leaving group:', groupId, userId)
      alert('그룹에서 나갔습니다.')
    },
    getMyGroups: (userId: string) => {
      return groups.filter(g => g.members.some(m => m.userId === userId))
    },
    getGroupsByCourse: (courseSlug: string) => {
      return groups.filter(g => g.courseSlug === courseSlug)
    },
    getAllGroups: () => groups,
    startMission: (groupId: string, missionId: string) => {
      console.log('Starting mission:', groupId, missionId)
      alert('미션을 시작했습니다!')
    },
    completeMissionStep: (groupId: string, missionId: string, stepId: string) => {
      console.log('Completing step:', groupId, missionId, stepId)
      alert(`단계 ${stepId}를 완료했습니다!`)
    },
    completeMission: (groupId: string, _missionId: string) => {
      console.log('Completing mission:', groupId, _missionId)
      alert('미션을 완료했습니다! 축하합니다!')
    },
    getMissionProgress: (groupId: string, _missionId: string) => {
      return missionProgress[groupId] || null
    },
  }
}

export default function StudyGroups() {
  const { user } = useAuthStore()
  const courses = useCourseList()
  const store = useStudyGroupStore()

  const [showCreateForm, setShowCreateForm] = useState(false)
  const [selectedCourseFilter, setSelectedCourseFilter] = useState<string>('all')
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    courseSlug: 'ai-intro',
    maxMembers: 5,
  })

  const myGroups = user ? store.getMyGroups(user.id) : []
  const availableGroups = selectedCourseFilter === 'all'
    ? store.getAllGroups()
    : store.getGroupsByCourse(selectedCourseFilter)

  const filteredAvailableGroups = availableGroups.filter(
    g => !myGroups.some(mg => mg.id === g.id)
  )

  const selectedCourseMissions = selectedCourseFilter === 'all'
    ? []
    : getMissionsForCourse(selectedCourseFilter)

  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      alert('로그인이 필요합니다.')
      return
    }
    store.createGroup({
      ...formData,
      creatorId: user.id,
      creatorName: user.name,
    })
    setFormData({ name: '', description: '', courseSlug: 'ai-intro', maxMembers: 5 })
    setShowCreateForm(false)
  }

  const handleJoinGroup = (groupId: string) => {
    if (!user) {
      alert('로그인이 필요합니다.')
      return
    }
    store.joinGroup(groupId, user.id)
  }

  const handleLeaveGroup = (groupId: string) => {
    if (!user) return
    if (confirm('정말 그룹에서 나가시겠습니까?')) {
      store.leaveGroup(groupId, user.id)
    }
  }

  const isUserLeader = (group: StudyGroup): boolean => {
    if (!user) return false
    const member = group.members.find(m => m.userId === user.id)
    return member?.role === 'leader'
  }

  const getInitials = (name: string): string => {
    return name.slice(0, 2)
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center p-8">
        <div className="bg-white rounded-xl shadow-lg p-12 max-w-md text-center">
          <div className="text-6xl mb-6">🔒</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">로그인이 필요합니다</h2>
          <p className="text-gray-600 mb-8">
            스터디 그룹 기능을 사용하려면 로그인해주세요.
          </p>
          <Link to="/login">
            <Button>로그인하러 가기</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      {/* Header */}
      <div className="bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 text-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm mb-6 text-white/80">
            <Link to="/" className="hover:text-white transition-colors">홈</Link>
            <span>/</span>
            <span>커뮤니티</span>
            <span>/</span>
            <span className="text-white font-semibold">스터디 그룹</span>
          </div>

          {/* Title */}
          <div className="flex items-center gap-4 mb-3">
            <span className="text-5xl">👥</span>
            <h1 className="text-4xl font-extrabold">스터디 그룹</h1>
          </div>
          <p className="text-lg text-white/90 max-w-2xl">
            함께 배우면 더 빨리, 더 깊이 배울 수 있어요!
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Create Group Section */}
        <div className="mb-10">
          <Button
            onClick={() => setShowCreateForm(!showCreateForm)}
            variant="primary"
            className="mb-4"
          >
            {showCreateForm ? '폼 닫기' : '새 스터디 그룹 만들기'}
          </Button>

          {showCreateForm && (
            <form
              onSubmit={handleCreateGroup}
              className="bg-white rounded-xl shadow-md border border-gray-200 p-6 space-y-4"
            >
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  그룹 이름 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="예: AI 입문 스터디"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  그룹 설명 <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 min-h-24"
                  placeholder="그룹의 목표와 활동 내용을 적어주세요"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  과목 선택 <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.courseSlug}
                  onChange={(e) => setFormData({ ...formData, courseSlug: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  {courses.map(course => (
                    <option key={course.slug} value={course.slug}>
                      {course.icon} {course.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  최대 멤버 수 (3-10명)
                </label>
                <input
                  type="number"
                  min={3}
                  max={10}
                  value={formData.maxMembers}
                  onChange={(e) => setFormData({ ...formData, maxMembers: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="submit" variant="primary">그룹 만들기</Button>
                <Button type="button" variant="ghost" onClick={() => setShowCreateForm(false)}>
                  취소
                </Button>
              </div>
            </form>
          )}
        </div>

        {/* My Groups Section */}
        {myGroups.length > 0 && (
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-5 flex items-center gap-2">
              <span>🏆</span>
              내 스터디 그룹
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {myGroups.map(group => {
                const theme = getCourseTheme(group.courseSlug)
                const course = courses.find(c => c.slug === group.courseSlug)
                const progress = group.activeMissionId
                  ? store.getMissionProgress(group.id, group.activeMissionId)
                  : null

                return (
                  <div
                    key={group.id}
                    className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    {/* Course color header */}
                    <div className={`${theme.bgGradient} ${theme.text} px-5 py-3`}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-2xl">{course?.icon}</span>
                        <span className="font-semibold text-sm">{course?.title}</span>
                      </div>
                      <h3 className="text-xl font-bold">{group.name}</h3>
                    </div>

                    <div className="p-5">
                      <p className="text-sm text-gray-700 mb-4">{group.description}</p>

                      {/* Members */}
                      <div className="mb-4">
                        <div className="text-xs font-semibold text-gray-600 mb-2">
                          멤버 ({group.members.length}/{group.maxMembers})
                        </div>
                        <div className="flex items-center gap-2">
                          {group.members.map(member => (
                            <div
                              key={member.userId}
                              className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold ${
                                member.role === 'leader'
                                  ? 'bg-amber-500 text-white'
                                  : 'bg-gray-300 text-gray-700'
                              }`}
                              title={`${member.userName} (${member.role === 'leader' ? '리더' : '멤버'})`}
                            >
                              {getInitials(member.userName)}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Active mission progress */}
                      {progress && (
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
                          <div className="text-xs font-semibold text-amber-800 mb-1">활성 미션</div>
                          <div className="text-sm font-bold text-amber-900">진행도: {progress.completedSteps.length}단계 완료</div>
                        </div>
                      )}

                      {/* Leave button */}
                      {!isUserLeader(group) && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleLeaveGroup(group.id)}
                        >
                          나가기
                        </Button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Course Filter */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>🔍</span>
            참여 가능한 그룹
          </h2>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCourseFilter('all')}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
                selectedCourseFilter === 'all'
                  ? 'bg-amber-500 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:border-amber-500'
              }`}
            >
              전체
            </button>
            {courses.map(course => (
              <button
                key={course.slug}
                onClick={() => setSelectedCourseFilter(course.slug)}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
                  selectedCourseFilter === course.slug
                    ? 'bg-amber-500 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:border-amber-500'
                }`}
              >
                {course.icon} {course.title}
              </button>
            ))}
          </div>
        </div>

        {/* Available Groups */}
        <div className="mb-10">
          {filteredAvailableGroups.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredAvailableGroups.map(group => {
                const theme = getCourseTheme(group.courseSlug)
                const course = courses.find(c => c.slug === group.courseSlug)
                const isFull = group.members.length >= group.maxMembers

                return (
                  <div
                    key={group.id}
                    className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    {/* Course color header */}
                    <div className={`${theme.bgGradient} ${theme.text} px-5 py-3`}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{course?.icon}</span>
                          <span className="font-semibold text-sm">{course?.title}</span>
                        </div>
                        {group.isOpen && !isFull && (
                          <span className="px-2 py-1 bg-white/30 rounded-full text-xs font-bold">모집중</span>
                        )}
                        {isFull && (
                          <span className="px-2 py-1 bg-red-500/50 rounded-full text-xs font-bold">정원 마감</span>
                        )}
                      </div>
                      <h3 className="text-xl font-bold">{group.name}</h3>
                    </div>

                    <div className="p-5">
                      <p className="text-sm text-gray-700 mb-4">{group.description}</p>

                      {/* Info */}
                      <div className="flex items-center gap-4 text-xs text-gray-600 mb-4">
                        <span>👥 {group.members.length}/{group.maxMembers}명</span>
                        <span>👑 {group.creatorName}</span>
                      </div>

                      {/* Join button */}
                      {group.isOpen && !isFull && (
                        <Button
                          onClick={() => handleJoinGroup(group.id)}
                          variant="primary"
                          size="sm"
                        >
                          참여하기
                        </Button>
                      )}
                      {isFull && (
                        <div className="text-sm font-semibold text-gray-500">정원이 가득 찼습니다</div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-12 text-center">
              <div className="text-5xl mb-4">🔍</div>
              <p className="text-gray-600 font-semibold">
                {selectedCourseFilter === 'all'
                  ? '참여 가능한 그룹이 없습니다.'
                  : '해당 과목의 그룹이 없습니다.'}
              </p>
            </div>
          )}
        </div>

        {/* Group Missions Section */}
        {selectedCourseFilter !== 'all' && selectedCourseMissions.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-5 flex items-center gap-2">
              <span>🎯</span>
              그룹 미션
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {selectedCourseMissions.map(mission => {
                // For demo, use the first group's progress if available
                const demoGroup = myGroups.find(g => g.courseSlug === selectedCourseFilter)
                const progress = demoGroup
                  ? store.getMissionProgress(demoGroup.id, mission.id)
                  : undefined

                return (
                  <GroupMissionCard
                    key={mission.id}
                    mission={mission}
                    groupId={demoGroup?.id || 'demo'}
                    progress={progress}
                    onStart={store.startMission}
                    onCompleteStep={store.completeMissionStep}
                    onCompleteMission={store.completeMission}
                  />
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
