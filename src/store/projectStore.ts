import { create } from 'zustand'
import { supabase } from '../lib/supabase'
import type { Project, ProjectMember, ProjectComment, Challenge } from '../types/community'

interface ProjectFilter {
  category?: string
  status?: string
  search?: string
}

interface ProjectState {
  projects: Project[]
  challenges: Challenge[]
  loading: boolean
  getProjects: (filter?: ProjectFilter) => Project[]
  getProject: (id: string) => Project | null
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'likes' | 'likedBy' | 'comments'>) => void
  joinProject: (projectId: string, userId: string, userName: string, role: string) => void
  leaveProject: (projectId: string, userId: string) => void
  updateProjectStatus: (projectId: string, status: Project['status']) => void
  addProjectComment: (projectId: string, userId: string, userName: string, content: string) => void
  toggleProjectLike: (projectId: string, userId: string) => void
  getChallenges: () => Challenge[]
  getChallenge: (id: string) => Challenge | null
}

const STORAGE_KEY = 'ai-platform-projects'

// localStorage helpers
function loadFromStorage<T>(key: string, defaultVal: T): T {
  try {
    const data = localStorage.getItem(key)
    if (data) return JSON.parse(data)
  } catch { /* ignore */ }
  return defaultVal
}

function saveToStorage(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch { /* quota exceeded, ignore */ }
}

const getSampleProjects = (): Project[] => [
  {
    id: 'project-1',
    title: '한국어 감정 분석 챗봇',
    description: '한국어 텍스트의 감정을 분석하고, 사용자의 감정 상태에 맞는 대화를 생성하는 챗봇을 개발합니다. KoBERT와 GPT를 활용하여 자연스러운 한국어 감정 인식 및 응답 시스템을 구축하는 것이 목표입니다.',
    category: 'research',
    status: 'recruiting',
    authorId: 'sample-user-1',
    authorName: '김민수',
    members: [
      { userId: 'sample-user-1', userName: '김민수', role: '팀장', joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString() },
      { userId: 'sample-user-2', userName: '이지은', role: 'NLP 엔지니어', joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString() },
      { userId: 'sample-user-3', userName: '박준영', role: '프론트엔드', joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString() },
    ],
    maxMembers: 5,
    skills: ['Python', 'NLP', 'React'],
    relatedCourses: ['nlp-basics', 'transformer-models'],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    likes: 12,
    likedBy: ['user-a', 'user-b', 'user-c', 'user-d', 'user-e', 'user-f', 'user-g', 'user-h', 'user-i', 'user-j', 'user-k', 'user-l'],
    comments: [
      {
        id: 'comment-1',
        projectId: 'project-1',
        userId: 'sample-user-4',
        userName: '최서연',
        content: '정말 흥미로운 프로젝트네요! 감정 분석에 관심 많은데 참여하고 싶습니다.',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
      },
    ],
  },
  {
    id: 'project-2',
    title: '의료 영상 AI 진단 보조',
    description: 'X-ray 및 CT 영상에서 이상 소견을 자동으로 탐지하는 딥러닝 모델을 개발합니다. 의료진의 진단을 보조하여 오진율을 낮추고, 진단 속도를 향상시키는 것이 목표입니다.',
    category: 'healthcare',
    status: 'in_progress',
    authorId: 'sample-user-5',
    authorName: '정민호',
    members: [
      { userId: 'sample-user-5', userName: '정민호', role: '팀장', joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString() },
      { userId: 'sample-user-6', userName: '강하늘', role: 'ML 엔지니어', joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 28).toISOString() },
      { userId: 'sample-user-7', userName: '윤서아', role: '데이터 분석', joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 25).toISOString() },
      { userId: 'sample-user-8', userName: '송재현', role: '백엔드', joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20).toISOString() },
    ],
    maxMembers: 4,
    skills: ['Python', 'PyTorch', 'Computer Vision', 'Docker'],
    relatedCourses: ['deep-learning-basics', 'cnn-architectures'],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
    likes: 24,
    likedBy: Array.from({ length: 24 }, (_, i) => `liker-${i}`),
    comments: [],
  },
  {
    id: 'project-3',
    title: '환경 데이터 모니터링',
    description: 'IoT 센서 데이터와 AI를 결합하여 실시간 환경 데이터를 수집, 분석, 시각화하는 대시보드를 개발했습니다. 미세먼지, 온도, 습도 등의 데이터를 예측하고 이상 패턴을 감지합니다.',
    category: 'environment',
    status: 'completed',
    authorId: 'sample-user-9',
    authorName: '한지우',
    members: [
      { userId: 'sample-user-9', userName: '한지우', role: '팀장', joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60).toISOString() },
      { userId: 'sample-user-10', userName: '임도윤', role: 'IoT 엔지니어', joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 58).toISOString() },
      { userId: 'sample-user-11', userName: '배수진', role: '데이터 사이언티스트', joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 55).toISOString() },
      { userId: 'sample-user-12', userName: '오현석', role: '프론트엔드', joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 50).toISOString() },
      { userId: 'sample-user-13', userName: '장예린', role: '디자이너', joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 48).toISOString() },
    ],
    maxMembers: 5,
    skills: ['Python', 'TensorFlow', 'React', 'IoT', 'D3.js'],
    relatedCourses: ['data-visualization', 'time-series-analysis'],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    likes: 38,
    likedBy: Array.from({ length: 38 }, (_, i) => `liker-env-${i}`),
    comments: [
      {
        id: 'comment-2',
        projectId: 'project-3',
        userId: 'sample-user-1',
        userName: '김민수',
        content: '완성도가 정말 높네요! 대시보드 UI가 특히 인상적입니다.',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
      },
    ],
  },
]

const getSampleChallenges = (): Challenge[] => [
  {
    id: 'challenge-1',
    title: 'AI로 교통 문제 해결하기',
    description: '도시의 교통 혼잡 문제를 AI 기술을 활용하여 해결하는 방안을 제안하세요. 실시간 교통 데이터 분석, 신호 최적화, 경로 추천 등 다양한 접근이 가능합니다. 실제 데이터셋이 제공됩니다.',
    category: 'environment',
    difficulty: 'intermediate',
    status: 'active',
    startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 21).toISOString(),
    submissions: [],
    participants: 15,
  },
  {
    id: 'challenge-2',
    title: '소수 언어 보존 프로젝트',
    description: 'AI를 활용하여 사라져 가는 소수 언어를 보존하고 학습할 수 있는 도구를 개발하세요. 음성 인식, 번역, 교육 콘텐츠 생성 등 창의적인 접근을 환영합니다.',
    category: 'language',
    difficulty: 'advanced',
    status: 'upcoming',
    startDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14).toISOString(),
    endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 42).toISOString(),
    submissions: [],
    participants: 0,
  },
]

interface StoredData {
  projects: Project[]
  challenges: Challenge[]
}

const loadInitialData = (): StoredData => {
  const stored = loadFromStorage<StoredData>(STORAGE_KEY, { projects: [], challenges: [] })
  if (stored.projects.length > 0 || stored.challenges.length > 0) {
    return stored
  }
  return { projects: getSampleProjects(), challenges: getSampleChallenges() }
}

const saveDataToStorage = (projects: Project[], challenges: Challenge[]) => {
  saveToStorage(STORAGE_KEY, { projects, challenges })
}

export const useProjectStore = create<ProjectState>((set, get) => {
  const initial = loadInitialData()
  return {
    projects: initial.projects,
    challenges: initial.challenges,
    loading: false,

    getProjects: (filter?: ProjectFilter) => {
      let result = [...get().projects]
      if (filter?.category) {
        result = result.filter((p) => p.category === filter.category)
      }
      if (filter?.status) {
        result = result.filter((p) => p.status === filter.status)
      }
      if (filter?.search) {
        const search = filter.search.toLowerCase()
        result = result.filter(
          (p) =>
            p.title.toLowerCase().includes(search) ||
            p.description.toLowerCase().includes(search) ||
            p.skills.some((s) => s.toLowerCase().includes(search))
        )
      }
      return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    },

    getProject: (id: string) => {
      return get().projects.find((p) => p.id === id) ?? null
    },

    addProject: (projectData) => {
      const newProject: Project = {
        ...projectData,
        id: `project-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        likes: 0,
        likedBy: [],
        comments: [],
      }

      set((state) => {
        const newProjects = [newProject, ...state.projects]
        saveDataToStorage(newProjects, state.challenges)
        return { projects: newProjects }
      })

      try {
        supabase.from('projects').insert({
          id: newProject.id,
          title: newProject.title,
          description: newProject.description,
          category: newProject.category,
          status: newProject.status,
          author_id: newProject.authorId,
          author_name: newProject.authorName,
          members: newProject.members,
          max_members: newProject.maxMembers,
          skills: newProject.skills,
          related_courses: newProject.relatedCourses,
          created_at: newProject.createdAt,
          updated_at: newProject.updatedAt,
        })
      } catch (error) {
        console.error('Failed to sync project to Supabase:', error)
      }
    },

    joinProject: (projectId: string, userId: string, userName: string, role: string) => {
      set((state) => {
        const newProjects = state.projects.map((p) => {
          if (p.id !== projectId) return p
          if (p.members.length >= p.maxMembers) return p
          if (p.members.some((m) => m.userId === userId)) return p
          const newMember: ProjectMember = {
            userId,
            userName,
            role,
            joinedAt: new Date().toISOString(),
          }
          return { ...p, members: [...p.members, newMember], updatedAt: new Date().toISOString() }
        })
        saveDataToStorage(newProjects, state.challenges)
        return { projects: newProjects }
      })

      try {
        supabase.from('project_members').insert({
          project_id: projectId,
          user_id: userId,
          user_name: userName,
          role,
          joined_at: new Date().toISOString(),
        })
      } catch (error) {
        console.error('Failed to sync join project to Supabase:', error)
      }
    },

    leaveProject: (projectId: string, userId: string) => {
      set((state) => {
        const newProjects = state.projects.map((p) => {
          if (p.id !== projectId) return p
          return {
            ...p,
            members: p.members.filter((m) => m.userId !== userId),
            updatedAt: new Date().toISOString(),
          }
        })
        saveDataToStorage(newProjects, state.challenges)
        return { projects: newProjects }
      })

      try {
        supabase
          .from('project_members')
          .delete()
          .eq('project_id', projectId)
          .eq('user_id', userId)
      } catch (error) {
        console.error('Failed to sync leave project to Supabase:', error)
      }
    },

    updateProjectStatus: (projectId: string, status: Project['status']) => {
      set((state) => {
        const newProjects = state.projects.map((p) => {
          if (p.id !== projectId) return p
          return { ...p, status, updatedAt: new Date().toISOString() }
        })
        saveDataToStorage(newProjects, state.challenges)
        return { projects: newProjects }
      })

      try {
        supabase
          .from('projects')
          .update({ status, updated_at: new Date().toISOString() })
          .eq('id', projectId)
      } catch (error) {
        console.error('Failed to sync project status to Supabase:', error)
      }
    },

    addProjectComment: (projectId: string, userId: string, userName: string, content: string) => {
      const newComment: ProjectComment = {
        id: `comment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        projectId,
        userId,
        userName,
        content: content.trim(),
        createdAt: new Date().toISOString(),
      }

      set((state) => {
        const newProjects = state.projects.map((p) => {
          if (p.id !== projectId) return p
          return { ...p, comments: [...p.comments, newComment], updatedAt: new Date().toISOString() }
        })
        saveDataToStorage(newProjects, state.challenges)
        return { projects: newProjects }
      })

      try {
        supabase.from('project_comments').insert({
          id: newComment.id,
          project_id: projectId,
          user_id: userId,
          user_name: userName,
          content: newComment.content,
          created_at: newComment.createdAt,
        })
      } catch (error) {
        console.error('Failed to sync comment to Supabase:', error)
      }
    },

    toggleProjectLike: (projectId: string, userId: string) => {
      let wasLiked = false

      set((state) => {
        const newProjects = state.projects.map((p) => {
          if (p.id !== projectId) return p
          wasLiked = p.likedBy.includes(userId)
          const newLikedBy = wasLiked
            ? p.likedBy.filter((id) => id !== userId)
            : [...p.likedBy, userId]
          return { ...p, likes: newLikedBy.length, likedBy: newLikedBy }
        })
        saveDataToStorage(newProjects, state.challenges)
        return { projects: newProjects }
      })

      try {
        if (wasLiked) {
          supabase
            .from('project_likes')
            .delete()
            .eq('project_id', projectId)
            .eq('user_id', userId)
        } else {
          supabase.from('project_likes').insert({
            project_id: projectId,
            user_id: userId,
          })
        }
      } catch (error) {
        console.error('Failed to sync project like to Supabase:', error)
      }
    },

    getChallenges: () => {
      return [...get().challenges].sort(
        (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
      )
    },

    getChallenge: (id: string) => {
      return get().challenges.find((c) => c.id === id) ?? null
    },
  }
})
