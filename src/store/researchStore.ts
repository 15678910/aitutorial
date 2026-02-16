import { create } from 'zustand'
import { supabase } from '../lib/supabase'
import type { ResearchProject, ResearchCollaborator, ResearchPaper, ResearchMilestone } from '../types/community'

interface ResearchFilter {
  field?: string
  status?: string
  search?: string
}

interface ResearchState {
  projects: ResearchProject[]
  loading: boolean
  getProjects: (filter?: ResearchFilter) => ResearchProject[]
  getProject: (id: string) => ResearchProject | null
  addProject: (data: Omit<ResearchProject, 'id' | 'createdAt' | 'updatedAt' | 'likes' | 'likedBy' | 'papers' | 'milestones' | 'collaborators'> & { milestones?: Omit<ResearchMilestone, 'id' | 'completed' | 'completedAt'>[]; collaborators?: ResearchCollaborator[] }) => void
  joinProject: (projectId: string, userId: string, userName: string, role: ResearchCollaborator['role'], institution: string) => void
  leaveProject: (projectId: string, userId: string) => void
  addPaper: (projectId: string, paper: Omit<ResearchPaper, 'id'>) => void
  updateMilestone: (projectId: string, milestoneId: string, completed: boolean) => void
  toggleLike: (projectId: string, userId: string) => void
}

const STORAGE_KEY = 'ai-platform-research'

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

const getSampleProjects = (): ResearchProject[] => [
  {
    id: 'research-1',
    title: '한국어 감정 분석 대규모 언어모델 연구',
    abstract: '한국어 텍스트에서 감정을 정확하게 인식하고 분류하는 대규모 언어모델을 개발합니다. KoBERT, KoGPT 등 기존 한국어 언어모델을 기반으로 감정 분석에 특화된 파인튜닝 기법을 연구하며, 다양한 도메인(SNS, 뉴스, 리뷰)에서의 감정 분석 성능을 벤치마킹합니다. 최종적으로 실시간 감정 분석 API를 구축하는 것이 목표입니다.',
    field: 'nlp',
    status: 'in_progress',
    leaderId: 'sample-user-1',
    leaderName: '김민수',
    institution: '서울대학교',
    collaborators: [
      { userId: 'sample-user-1', userName: '김민수', role: '연구 책임자', institution: '서울대학교', joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60).toISOString() },
      { userId: 'sample-user-2', userName: '이지은', role: '데이터 분석가', institution: '서울대학교', joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 45).toISOString() },
      { userId: 'sample-user-14', userName: '정하영', role: '코드 개발자', institution: 'KAIST', joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString() },
    ],
    maxCollaborators: 5,
    requiredSkills: ['Python', 'NLP', 'PyTorch', 'Hugging Face', 'Korean NLP'],
    datasets: ['NSMC 한국어 감성 분석 데이터셋', 'KorNLI', '자체 수집 SNS 데이터'],
    papers: [
      {
        id: 'paper-1-1',
        title: 'KoBERT 기반 한국어 감정 분석 성능 비교 연구',
        authors: ['김민수', '이지은', '정하영'],
        abstract: 'KoBERT, KoELECTRA, KoGPT를 활용한 한국어 감정 분석 모델의 성능을 다양한 도메인에서 비교 분석한 연구입니다.',
        url: 'https://arxiv.org/example/korean-sentiment',
        publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString(),
        venue: 'KCC 2025 (한국정보과학회)',
      },
    ],
    milestones: [
      {
        id: 'ms-1-1',
        title: '데이터셋 구축 및 전처리',
        description: 'SNS, 뉴스, 리뷰 도메인별 한국어 감정 데이터셋 10만 건 수집 및 라벨링',
        targetDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
        completed: true,
        completedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 28).toISOString(),
      },
      {
        id: 'ms-1-2',
        title: '모델 파인튜닝 및 평가',
        description: 'KoBERT, KoGPT 기반 감정 분석 모델 파인튜닝 및 F1 스코어 90% 이상 달성',
        targetDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
        completed: false,
        completedAt: null,
      },
    ],
    tags: ['NLP', '감정 분석', '한국어', 'LLM', '파인튜닝'],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    likes: 18,
    likedBy: Array.from({ length: 18 }, (_, i) => `liker-r1-${i}`),
  },
  {
    id: 'research-2',
    title: '의료 영상 AI 진단 정확도 향상 연구',
    abstract: 'X-ray 및 CT 영상에서 폐렴, 결절 등 이상 소견을 자동 탐지하는 딥러닝 모델의 정확도를 향상시키는 연구입니다. Vision Transformer와 CNN 하이브리드 아키텍처를 설계하고, 데이터 증강 기법과 self-supervised learning을 결합하여 소규모 의료 데이터에서도 높은 성능을 달성하는 것이 목표입니다.',
    field: 'cv',
    status: 'recruiting',
    leaderId: 'sample-user-5',
    leaderName: '정민호',
    institution: 'KAIST',
    collaborators: [
      { userId: 'sample-user-5', userName: '정민호', role: '연구 책임자', institution: 'KAIST', joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 40).toISOString() },
      { userId: 'sample-user-6', userName: '강하늘', role: '공동 연구자', institution: 'KAIST', joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 35).toISOString() },
    ],
    maxCollaborators: 6,
    requiredSkills: ['Python', 'PyTorch', 'Computer Vision', 'Medical Imaging', 'Vision Transformer'],
    datasets: ['ChestX-ray14', 'MIMIC-CXR', '서울대병원 익명화 데이터'],
    papers: [],
    milestones: [
      {
        id: 'ms-2-1',
        title: '문헌 조사 및 베이스라인 구축',
        description: '최신 의료 영상 AI 논문 서베이 및 ResNet 기반 베이스라인 모델 구축',
        targetDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
        completed: true,
        completedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8).toISOString(),
      },
      {
        id: 'ms-2-2',
        title: 'ViT-CNN 하이브리드 모델 설계',
        description: 'Vision Transformer와 CNN을 결합한 하이브리드 아키텍처 설계 및 구현',
        targetDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 20).toISOString(),
        completed: false,
        completedAt: null,
      },
      {
        id: 'ms-2-3',
        title: '임상 검증 및 논문 작성',
        description: '서울대병원 데이터를 활용한 임상 검증 실험 및 학회 논문 작성',
        targetDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 60).toISOString(),
        completed: false,
        completedAt: null,
      },
    ],
    tags: ['Computer Vision', '의료 AI', 'Vision Transformer', 'Self-supervised Learning'],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 40).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    likes: 24,
    likedBy: Array.from({ length: 24 }, (_, i) => `liker-r2-${i}`),
  },
  {
    id: 'research-3',
    title: 'AI 편향성 감지 및 완화 프레임워크',
    abstract: 'AI 모델에 내재된 편향성을 자동으로 감지하고 완화하는 오픈소스 프레임워크를 개발합니다. 성별, 연령, 인종 등 다양한 차원의 편향성을 정량적으로 측정하는 메트릭을 설계하고, 편향성을 줄이면서도 모델 성능을 유지하는 디바이어싱 기법을 연구합니다.',
    field: 'ai_ethics',
    status: 'proposal',
    leaderId: 'sample-user-15',
    leaderName: '한소희',
    institution: '연세대학교',
    collaborators: [
      { userId: 'sample-user-15', userName: '한소희', role: '연구 책임자', institution: '연세대학교', joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString() },
    ],
    maxCollaborators: 4,
    requiredSkills: ['Python', 'Fairness ML', 'NLP', 'Statistics', 'AI Ethics'],
    datasets: ['CelebA', 'Adult Census', 'Korean Bias Dataset'],
    papers: [],
    milestones: [],
    tags: ['AI 윤리', '편향성', '공정성', 'Debiasing', '오픈소스'],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
    likes: 8,
    likedBy: Array.from({ length: 8 }, (_, i) => `liker-r3-${i}`),
  },
  {
    id: 'research-4',
    title: '멀티모달 생성 AI 한국어 벤치마크 구축',
    abstract: '텍스트, 이미지, 오디오를 아우르는 멀티모달 생성 AI 모델의 한국어 성능을 체계적으로 평가하기 위한 벤치마크를 구축합니다. 한국어 이미지 캡셔닝, 텍스트-이미지 생성, 시각적 질의응답(VQA) 등의 태스크를 포함하며, GPT-4V, Gemini, Claude 등 주요 모델의 한국어 멀티모달 성능을 비교 분석합니다.',
    field: 'generative_ai',
    status: 'in_progress',
    leaderId: 'sample-user-16',
    leaderName: '오현석',
    institution: 'AI 연구원',
    collaborators: [
      { userId: 'sample-user-16', userName: '오현석', role: '연구 책임자', institution: 'AI 연구원', joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 50).toISOString() },
      { userId: 'sample-user-17', userName: '장예린', role: '공동 연구자', institution: '서울대학교', joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 45).toISOString() },
      { userId: 'sample-user-3', userName: '박준영', role: '데이터 분석가', institution: 'KAIST', joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 40).toISOString() },
      { userId: 'sample-user-18', userName: '송재현', role: '코드 개발자', institution: 'AI 연구원', joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 35).toISOString() },
    ],
    maxCollaborators: 6,
    requiredSkills: ['Python', 'Multimodal AI', 'NLP', 'Computer Vision', 'Evaluation'],
    datasets: ['자체 구축 한국어 멀티모달 데이터셋', 'KoVQA', 'Korean Image Caption Dataset'],
    papers: [
      {
        id: 'paper-4-1',
        title: '한국어 멀티모달 벤치마크 설계 원칙과 초기 결과',
        authors: ['오현석', '장예린', '박준영'],
        abstract: '한국어 멀티모달 AI 평가를 위한 벤치마크의 설계 원칙, 태스크 구성, 초기 평가 결과를 보고합니다.',
        url: 'https://arxiv.org/example/ko-multimodal-bench',
        publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20).toISOString(),
        venue: 'HCLT 2025 (한국어 정보처리 학회)',
      },
      {
        id: 'paper-4-2',
        title: '상용 멀티모달 LLM의 한국어 성능 비교 분석',
        authors: ['오현석', '장예린', '박준영', '송재현'],
        abstract: 'GPT-4V, Gemini Pro, Claude 3 등 주요 상용 멀티모달 모델의 한국어 태스크 성능을 체계적으로 비교 분석합니다.',
        url: 'https://arxiv.org/example/ko-llm-comparison',
        publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
        venue: 'ACL 2025 Workshop',
      },
    ],
    milestones: [
      {
        id: 'ms-4-1',
        title: '벤치마크 프레임워크 설계',
        description: '평가 태스크 정의, 데이터 수집 파이프라인 구축, 평가 메트릭 설계',
        targetDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 25).toISOString(),
        completed: true,
        completedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 22).toISOString(),
      },
      {
        id: 'ms-4-2',
        title: '한국어 멀티모달 데이터셋 구축',
        description: '이미지 캡셔닝, VQA, 텍스트-이미지 매칭 등 1만 건 이상 데이터 구축',
        targetDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 15).toISOString(),
        completed: false,
        completedAt: null,
      },
    ],
    tags: ['멀티모달', '생성형 AI', '벤치마크', '한국어', 'LLM 평가'],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 50).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
    likes: 32,
    likedBy: Array.from({ length: 32 }, (_, i) => `liker-r4-${i}`),
  },
]

interface StoredData {
  projects: ResearchProject[]
}

const loadInitialData = (): StoredData => {
  const stored = loadFromStorage<StoredData>(STORAGE_KEY, { projects: [] })
  if (stored.projects.length > 0) {
    return stored
  }
  return { projects: getSampleProjects() }
}

const saveDataToStorage = (projects: ResearchProject[]) => {
  saveToStorage(STORAGE_KEY, { projects })
}

export const useResearchStore = create<ResearchState>((set, get) => {
  const initial = loadInitialData()
  return {
    projects: initial.projects,
    loading: false,

    getProjects: (filter?: ResearchFilter) => {
      let result = [...get().projects]
      if (filter?.field) {
        result = result.filter((p) => p.field === filter.field)
      }
      if (filter?.status) {
        result = result.filter((p) => p.status === filter.status)
      }
      if (filter?.search) {
        const search = filter.search.toLowerCase()
        result = result.filter(
          (p) =>
            p.title.toLowerCase().includes(search) ||
            p.abstract.toLowerCase().includes(search) ||
            p.tags.some((t) => t.toLowerCase().includes(search)) ||
            p.requiredSkills.some((s) => s.toLowerCase().includes(search))
        )
      }
      return result.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    },

    getProject: (id: string) => {
      return get().projects.find((p) => p.id === id) ?? null
    },

    addProject: (data) => {
      const newProject: ResearchProject = {
        ...data,
        id: `research-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        collaborators: data.collaborators ?? [],
        papers: [],
        milestones: data.milestones?.map((m, i) => ({
          ...m,
          id: `ms-new-${Date.now()}-${i}`,
          completed: false,
          completedAt: null,
        })) ?? [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        likes: 0,
        likedBy: [],
      }

      set((state) => {
        const newProjects = [newProject, ...state.projects]
        saveDataToStorage(newProjects)
        return { projects: newProjects }
      })

      try {
        supabase.from('research_projects').insert({
          id: newProject.id,
          title: newProject.title,
          abstract: newProject.abstract,
          field: newProject.field,
          status: newProject.status,
          leader_id: newProject.leaderId,
          leader_name: newProject.leaderName,
          institution: newProject.institution,
          max_collaborators: newProject.maxCollaborators,
          required_skills: newProject.requiredSkills,
          datasets: newProject.datasets,
          tags: newProject.tags,
          created_at: newProject.createdAt,
          updated_at: newProject.updatedAt,
        })
      } catch (error) {
        console.error('Failed to sync research project to Supabase:', error)
      }
    },

    joinProject: (projectId: string, userId: string, userName: string, role: ResearchCollaborator['role'], institution: string) => {
      set((state) => {
        const newProjects = state.projects.map((p) => {
          if (p.id !== projectId) return p
          if (p.collaborators.length >= p.maxCollaborators) return p
          if (p.collaborators.some((c) => c.userId === userId)) return p
          const newCollaborator: ResearchCollaborator = {
            userId,
            userName,
            role,
            institution,
            joinedAt: new Date().toISOString(),
          }
          return {
            ...p,
            collaborators: [...p.collaborators, newCollaborator],
            updatedAt: new Date().toISOString(),
          }
        })
        saveDataToStorage(newProjects)
        return { projects: newProjects }
      })

      try {
        supabase.from('research_collaborators').insert({
          project_id: projectId,
          user_id: userId,
          user_name: userName,
          role,
          institution,
          joined_at: new Date().toISOString(),
        })
      } catch (error) {
        console.error('Failed to sync research collaborator to Supabase:', error)
      }
    },

    leaveProject: (projectId: string, userId: string) => {
      set((state) => {
        const newProjects = state.projects.map((p) => {
          if (p.id !== projectId) return p
          return {
            ...p,
            collaborators: p.collaborators.filter((c) => c.userId !== userId),
            updatedAt: new Date().toISOString(),
          }
        })
        saveDataToStorage(newProjects)
        return { projects: newProjects }
      })

      try {
        supabase
          .from('research_collaborators')
          .delete()
          .eq('project_id', projectId)
          .eq('user_id', userId)
      } catch (error) {
        console.error('Failed to sync leave research to Supabase:', error)
      }
    },

    addPaper: (projectId: string, paperData: Omit<ResearchPaper, 'id'>) => {
      const newPaper: ResearchPaper = {
        ...paperData,
        id: `paper-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      }

      set((state) => {
        const newProjects = state.projects.map((p) => {
          if (p.id !== projectId) return p
          return {
            ...p,
            papers: [...p.papers, newPaper],
            updatedAt: new Date().toISOString(),
          }
        })
        saveDataToStorage(newProjects)
        return { projects: newProjects }
      })

      try {
        supabase.from('research_papers').insert({
          id: newPaper.id,
          project_id: projectId,
          title: newPaper.title,
          authors: newPaper.authors,
          abstract: newPaper.abstract,
          url: newPaper.url,
          published_at: newPaper.publishedAt,
          venue: newPaper.venue,
        })
      } catch (error) {
        console.error('Failed to sync research paper to Supabase:', error)
      }
    },

    updateMilestone: (projectId: string, milestoneId: string, completed: boolean) => {
      set((state) => {
        const newProjects = state.projects.map((p) => {
          if (p.id !== projectId) return p
          return {
            ...p,
            milestones: p.milestones.map((m) => {
              if (m.id !== milestoneId) return m
              return {
                ...m,
                completed,
                completedAt: completed ? new Date().toISOString() : null,
              }
            }),
            updatedAt: new Date().toISOString(),
          }
        })
        saveDataToStorage(newProjects)
        return { projects: newProjects }
      })

      try {
        supabase
          .from('research_milestones')
          .update({
            completed,
            completed_at: completed ? new Date().toISOString() : null,
          })
          .eq('id', milestoneId)
      } catch (error) {
        console.error('Failed to sync milestone update to Supabase:', error)
      }
    },

    toggleLike: (projectId: string, userId: string) => {
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
        saveDataToStorage(newProjects)
        return { projects: newProjects }
      })

      try {
        if (wasLiked) {
          supabase
            .from('research_likes')
            .delete()
            .eq('project_id', projectId)
            .eq('user_id', userId)
        } else {
          supabase.from('research_likes').insert({
            project_id: projectId,
            user_id: userId,
          })
        }
      } catch (error) {
        console.error('Failed to sync research like to Supabase:', error)
      }
    },
  }
})
