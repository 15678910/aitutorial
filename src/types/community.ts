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

// ============================================
// 기업 연계 (Enterprise Connection)
// ============================================

export type EnterpriseType = 'startup' | 'sme' | 'enterprise' | 'lab' | 'university'

export interface EnterprisePartner {
  id: string
  name: string
  type: EnterpriseType
  logo: string           // emoji or URL
  description: string
  website: string
  fields: string[]       // ['NLP', 'Computer Vision', ...]
  positions: EnterprisePosition[]
  createdAt: string
}

export interface EnterprisePosition {
  id: string
  partnerId: string
  title: string
  type: 'fulltime' | 'parttime' | 'intern' | 'freelance' | 'project'
  description: string
  requirements: string[]
  skills: string[]
  location: string
  isRemote: boolean
  minReputation: number  // 추천에 필요한 최소 평판 포인트
  applicants: string[]   // userIds
  status: 'open' | 'closed'
  createdAt: string
}

export interface TalentRecommendation {
  id: string
  userId: string
  userName: string
  reputation: number
  skills: string[]
  projectCount: number
  answerCount: number
  completedCourses: number
  highlights: string[]   // 주요 기여 하이라이트
}

export const ENTERPRISE_TYPE_LABELS: Record<EnterpriseType, string> = {
  startup: '스타트업',
  sme: '중소기업',
  enterprise: '대기업',
  lab: '연구소',
  university: '대학교',
}

export const POSITION_TYPE_LABELS: Record<EnterprisePosition['type'], string> = {
  fulltime: '정규직',
  parttime: '파트타임',
  intern: '인턴',
  freelance: '프리랜서',
  project: '프로젝트 계약',
}

// ============================================
// 연구 협업 (Research Collaboration)
// ============================================

export type ResearchStatus = 'proposal' | 'recruiting' | 'in_progress' | 'published' | 'archived'
export type ResearchField = 'nlp' | 'cv' | 'rl' | 'ml' | 'data_science' | 'ai_ethics' | 'robotics' | 'generative_ai' | 'other'

export interface ResearchProject {
  id: string
  title: string
  abstract: string
  field: ResearchField
  status: ResearchStatus
  leaderId: string
  leaderName: string
  institution: string    // 대학교/연구소 이름
  collaborators: ResearchCollaborator[]
  maxCollaborators: number
  requiredSkills: string[]
  datasets: string[]     // 사용 데이터셋
  papers: ResearchPaper[]
  milestones: ResearchMilestone[]
  tags: string[]
  createdAt: string
  updatedAt: string
  likes: number
  likedBy: string[]
}

export interface ResearchCollaborator {
  userId: string
  userName: string
  role: '연구 책임자' | '공동 연구자' | '데이터 분석가' | '논문 작성자' | '코드 개발자' | '자문위원'
  institution: string
  joinedAt: string
}

export interface ResearchPaper {
  id: string
  title: string
  authors: string[]
  abstract: string
  url: string
  publishedAt: string
  venue: string          // 학회/저널 이름
}

export interface ResearchMilestone {
  id: string
  title: string
  description: string
  targetDate: string
  completed: boolean
  completedAt: string | null
}

export const RESEARCH_FIELD_LABELS: Record<ResearchField, string> = {
  nlp: '자연어 처리 (NLP)',
  cv: '컴퓨터 비전',
  rl: '강화학습',
  ml: '머신러닝',
  data_science: '데이터 사이언스',
  ai_ethics: 'AI 윤리',
  robotics: '로보틱스',
  generative_ai: '생성형 AI',
  other: '기타',
}

export const RESEARCH_STATUS_LABELS: Record<ResearchStatus, { text: string; color: string }> = {
  proposal: { text: '제안', color: 'bg-yellow-100 text-yellow-700' },
  recruiting: { text: '참여자 모집', color: 'bg-blue-100 text-blue-700' },
  in_progress: { text: '진행 중', color: 'bg-green-100 text-green-700' },
  published: { text: '발표 완료', color: 'bg-purple-100 text-purple-700' },
  archived: { text: '보관', color: 'bg-gray-100 text-gray-700' },
}
