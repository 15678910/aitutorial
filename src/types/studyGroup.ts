export interface StudyGroup {
  id: string
  name: string
  description: string
  courseSlug: string
  creatorId: string
  creatorName: string
  members: StudyGroupMember[]
  maxMembers: number
  isOpen: boolean
  createdAt: string
  activeMissionId: string | null
  completedMissions: string[]
}

export interface StudyGroupMember {
  userId: string
  userName: string
  role: 'leader' | 'member'
  joinedAt: string
}

export interface GroupMission {
  id: string
  title: string
  description: string
  type: 'discussion' | 'experiment' | 'research' | 'presentation'
  courseSlug: string
  difficulty: 'easy' | 'medium' | 'hard'
  estimatedMinutes: number
  steps: MissionStep[]
  rewardPoints: number
}

export interface MissionStep {
  id: string
  title: string
  description: string
  type: 'discuss' | 'try' | 'write' | 'present'
  isCompleted: boolean
}

export interface GroupMissionProgress {
  groupId: string
  missionId: string
  startedAt: string
  completedSteps: string[]
  isCompleted: boolean
  completedAt: string | null
}
