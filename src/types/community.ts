// 커뮤니티 역할
export type CommunityRole = 'learner' | 'contributor' | 'mentor' | 'leader' | 'master'

// 커뮤니티 프로필
export interface CommunityProfile {
  userId: string
  displayName: string
  bio: string
  skills: string[]
  role: CommunityRole
  reputation: number
  projectCount: number
  answerCount: number
  wikiContributions: number
  joinedAt: string
}

// 프로젝트 카테고리
export type ProjectCategory = 'education' | 'healthcare' | 'environment' | 'language' | 'accessibility' | 'business' | 'research' | 'other'

// 프로젝트 멤버
export interface ProjectMember {
  userId: string
  userName: string
  role: string
  joinedAt: string
}

// 프로젝트 댓글
export interface ProjectComment {
  id: string
  projectId: string
  userId: string
  userName: string
  content: string
  createdAt: string
}

// 프로젝트
export interface Project {
  id: string
  title: string
  description: string
  category: ProjectCategory
  status: 'recruiting' | 'in_progress' | 'completed' | 'showcase'
  authorId: string
  authorName: string
  members: ProjectMember[]
  maxMembers: number
  skills: string[]
  relatedCourses: string[]
  createdAt: string
  updatedAt: string
  likes: number
  likedBy: string[]
  comments: ProjectComment[]
}

// Q&A 답변
export interface QAAnswer {
  id: string
  questionId: string
  content: string
  authorId: string
  authorName: string
  createdAt: string
  likes: number
  likedBy: string[]
  isAccepted: boolean
}

// Q&A 질문
export interface QAQuestion {
  id: string
  title: string
  content: string
  tags: string[]
  authorId: string
  authorName: string
  createdAt: string
  updatedAt: string
  views: number
  answers: QAAnswer[]
  acceptedAnswerId: string | null
  likes: number
  likedBy: string[]
}

// 위키 편집 기록
export interface WikiEdit {
  id: string
  articleId: string
  editorId: string
  editorName: string
  summary: string
  editedAt: string
}

// 위키 문서
export interface WikiArticle {
  id: string
  slug: string
  title: string
  content: string
  category: string
  tags: string[]
  authorId: string
  authorName: string
  lastEditorId: string
  lastEditorName: string
  createdAt: string
  updatedAt: string
  views: number
  editHistory: WikiEdit[]
}

// AI 챌린지 제출
export interface ChallengeSubmission {
  id: string
  challengeId: string
  teamName: string
  description: string
  members: string[]
  submittedAt: string
  votes: number
  votedBy: string[]
}

// AI 챌린지
export interface Challenge {
  id: string
  title: string
  description: string
  category: ProjectCategory
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  status: 'upcoming' | 'active' | 'voting' | 'completed'
  startDate: string
  endDate: string
  submissions: ChallengeSubmission[]
  participants: number
}

// 평판 레벨
export const COMMUNITY_ROLES = [
  { role: 'learner' as CommunityRole, name: '학습자', min: 0, icon: '🌱', color: '#22c55e' },
  { role: 'contributor' as CommunityRole, name: '기여자', min: 50, icon: '🔧', color: '#3b82f6' },
  { role: 'mentor' as CommunityRole, name: '멘토', min: 200, icon: '🎓', color: '#8b5cf6' },
  { role: 'leader' as CommunityRole, name: '리더', min: 500, icon: '⭐', color: '#f59e0b' },
  { role: 'master' as CommunityRole, name: '마스터', min: 1000, icon: '👑', color: '#ef4444' },
]

export function getCommunityRole(reputation: number) {
  for (let i = COMMUNITY_ROLES.length - 1; i >= 0; i--) {
    if (reputation >= COMMUNITY_ROLES[i].min) return COMMUNITY_ROLES[i]
  }
  return COMMUNITY_ROLES[0]
}

// 포인트 상수
export const REPUTATION_POINTS = {
  SECTION_COMPLETE: 2,
  QUIZ_HIGH_SCORE: 3,
  QUESTION_ASK: 2,
  ANSWER_WRITE: 5,
  ANSWER_ACCEPTED: 15,
  WIKI_CREATE: 10,
  WIKI_EDIT: 3,
  PROJECT_CREATE: 10,
  PROJECT_COMPLETE: 20,
  LIKE_RECEIVED: 1,
}

// 카테고리 라벨
export const PROJECT_CATEGORY_LABELS: Record<ProjectCategory, string> = {
  education: '교육',
  healthcare: '의료·헬스케어',
  environment: '환경',
  language: '언어·번역',
  accessibility: '접근성',
  business: '비즈니스',
  research: '연구',
  other: '기타',
}
