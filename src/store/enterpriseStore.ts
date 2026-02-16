import { create } from 'zustand'
import { supabase } from '../lib/supabase'
import type { EnterprisePartner, EnterprisePosition, TalentRecommendation } from '../types/community'

export interface PartnerInquiry {
  id: string
  companyName: string
  companyType: string
  contactEmail: string
  interestedFields: string
  message: string
  status: 'pending' | 'reviewing' | 'approved' | 'rejected'
  adminNote: string
  createdAt: string
  updatedAt: string
}

interface EnterpriseFilter {
  type?: string
  field?: string
  search?: string
}

interface PositionFilter {
  skill?: string
  type?: string
  remoteOnly?: boolean
}

interface EnterpriseState {
  partners: EnterprisePartner[]
  loading: boolean
  getPartners: (filter?: EnterpriseFilter) => EnterprisePartner[]
  getPartner: (id: string) => EnterprisePartner | null
  getPositions: (filter?: PositionFilter) => EnterprisePosition[]
  applyToPosition: (positionId: string, userId: string) => void
  getRecommendedTalents: (skills?: string[], minReputation?: number) => TalentRecommendation[]
  inquiries: PartnerInquiry[]
  submitInquiry: (data: Omit<PartnerInquiry, 'id' | 'status' | 'adminNote' | 'createdAt' | 'updatedAt'>) => Promise<boolean>
  getInquiries: (filter?: { status?: string }) => PartnerInquiry[]
  updateInquiryStatus: (id: string, status: PartnerInquiry['status'], adminNote?: string) => void
}

const STORAGE_KEY = 'ai-platform-enterprise'
const INQUIRY_STORAGE_KEY = 'ai-platform-partner-inquiries'

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

const getSamplePartners = (): EnterprisePartner[] => [
  {
    id: 'partner-1',
    name: '뉴로AI',
    type: 'startup',
    logo: '🧠',
    description: '대화형 AI와 자연어 처리 기술을 기반으로 차세대 AI 어시스턴트를 개발하는 스타트업입니다. 한국어 특화 언어모델과 RAG 시스템을 연구합니다.',
    website: 'https://neuroai.example.com',
    fields: ['NLP', '대화형 AI'],
    positions: [
      {
        id: 'pos-1-1',
        partnerId: 'partner-1',
        title: 'AI 엔지니어',
        type: 'fulltime',
        description: '한국어 대화형 AI 시스템을 설계하고 구현합니다. LLM 파인튜닝, 프롬프트 엔지니어링, RAG 파이프라인 개발 등의 업무를 담당합니다.',
        requirements: [
          'NLP 관련 프로젝트 경험 2년 이상',
          'Python, PyTorch 능숙',
          'LLM 파인튜닝 경험',
          'RAG 시스템 구축 경험 우대',
        ],
        skills: ['Python', 'PyTorch', 'NLP', 'LLM', 'RAG'],
        location: '서울 강남구',
        isRemote: true,
        minReputation: 100,
        applicants: ['user-a', 'user-b'],
        status: 'open',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
      },
      {
        id: 'pos-1-2',
        partnerId: 'partner-1',
        title: 'NLP 연구 인턴',
        type: 'intern',
        description: '한국어 감정 분석 및 텍스트 분류 모델 연구를 보조합니다. 데이터 전처리, 모델 실험, 결과 분석 업무를 수행합니다.',
        requirements: [
          '컴퓨터공학/AI 관련 전공 재학 또는 졸업',
          'Python 기본 문법 이해',
          'NLP에 대한 관심과 열정',
        ],
        skills: ['Python', 'NLP', 'Hugging Face'],
        location: '서울 강남구',
        isRemote: false,
        minReputation: 50,
        applicants: ['user-c'],
        status: 'open',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
      },
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
  },
  {
    id: 'partner-2',
    name: '메디컬브레인',
    type: 'sme',
    logo: '🏥',
    description: '의료 영상 AI 진단 솔루션을 개발하는 중소기업입니다. 딥러닝 기반 X-ray, CT 영상 분석 기술로 의료진의 진단을 보조합니다.',
    website: 'https://medicalbrain.example.com',
    fields: ['의료 AI', 'Computer Vision'],
    positions: [
      {
        id: 'pos-2-1',
        partnerId: 'partner-2',
        title: '의료 AI 연구원',
        type: 'fulltime',
        description: '의료 영상 데이터를 활용한 AI 진단 모델을 연구하고 개발합니다. CNN, Vision Transformer 등의 모델을 활용하여 질병 탐지 정확도를 향상시킵니다.',
        requirements: [
          'Computer Vision 프로젝트 경험 1년 이상',
          'PyTorch 또는 TensorFlow 사용 경험',
          '의료 데이터 처리 경험 우대',
          '관련 논문 게재 경험 우대',
        ],
        skills: ['Python', 'PyTorch', 'Computer Vision', 'Medical AI', 'Docker'],
        location: '서울 서초구',
        isRemote: false,
        minReputation: 150,
        applicants: ['user-d', 'user-e', 'user-f'],
        status: 'open',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
      },
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60).toISOString(),
  },
  {
    id: 'partner-3',
    name: '삼성 AI 센터',
    type: 'enterprise',
    logo: '🏢',
    description: '글로벌 기업 삼성의 AI 연구 센터로, On-device AI, 생성형 AI, MLOps 등 다양한 AI 기술을 연구하고 제품에 적용합니다.',
    website: 'https://samsungai.example.com',
    fields: ['On-device AI', '생성형 AI', 'MLOps'],
    positions: [
      {
        id: 'pos-3-1',
        partnerId: 'partner-3',
        title: 'On-device AI 엔지니어',
        type: 'fulltime',
        description: '모바일 및 IoT 기기에서 동작하는 경량 AI 모델을 연구하고 최적화합니다. 모델 압축, 양자화, 하드웨어 가속 등의 기술을 활용합니다.',
        requirements: [
          'AI 모델 최적화 경험 3년 이상',
          'C/C++, Python 능숙',
          'TFLite, ONNX, TensorRT 경험',
          '모델 압축/양자화 경험 필수',
        ],
        skills: ['Python', 'C++', 'TensorFlow Lite', 'ONNX', 'Model Optimization'],
        location: '서울 서초구 삼성타운',
        isRemote: false,
        minReputation: 300,
        applicants: ['user-g'],
        status: 'open',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
      },
      {
        id: 'pos-3-2',
        partnerId: 'partner-3',
        title: '생성형 AI 연구원',
        type: 'fulltime',
        description: '텍스트, 이미지, 멀티모달 생성 AI 모델을 연구합니다. Diffusion 모델, LLM 등 최신 기술을 연구하고 제품에 적용합니다.',
        requirements: [
          '생성형 AI 관련 연구 경험 2년 이상',
          '관련 학회 논문 게재 경험',
          'PyTorch 심화 사용 경험',
          '대규모 모델 학습 경험',
        ],
        skills: ['Python', 'PyTorch', 'Diffusion Models', 'LLM', 'Distributed Training'],
        location: '서울 서초구 삼성타운',
        isRemote: false,
        minReputation: 500,
        applicants: [],
        status: 'open',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8).toISOString(),
      },
      {
        id: 'pos-3-3',
        partnerId: 'partner-3',
        title: 'MLOps 엔지니어 (인턴)',
        type: 'intern',
        description: 'AI 모델의 학습, 배포, 모니터링 파이프라인을 구축하고 관리합니다. Kubernetes, Docker 기반 인프라를 운영합니다.',
        requirements: [
          'DevOps/MLOps에 대한 이해',
          'Docker, Kubernetes 기본 사용 경험',
          'Python 프로그래밍 가능',
          'CI/CD 파이프라인 경험 우대',
        ],
        skills: ['Python', 'Docker', 'Kubernetes', 'MLflow', 'CI/CD'],
        location: '서울 서초구 삼성타운',
        isRemote: false,
        minReputation: 80,
        applicants: ['user-h', 'user-i'],
        status: 'open',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
      },
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 90).toISOString(),
  },
  {
    id: 'partner-4',
    name: 'KAIST AI 연구소',
    type: 'lab',
    logo: '🔬',
    description: 'KAIST 인공지능 연구소는 강화학습, 로보틱스, AI 안전성 분야에서 세계적 수준의 연구를 수행합니다. 학계와 산업계를 연결하는 다양한 연구 프로젝트를 진행합니다.',
    website: 'https://kaist-ai.example.com',
    fields: ['강화학습', '로보틱스', 'AI 안전성'],
    positions: [
      {
        id: 'pos-4-1',
        partnerId: 'partner-4',
        title: '강화학습 연구 인턴',
        type: 'intern',
        description: '로봇 제어를 위한 강화학습 알고리즘을 연구합니다. 시뮬레이션 환경에서의 실험 설계 및 실행, 논문 서베이 등의 업무를 수행합니다.',
        requirements: [
          'AI/ML 관련 전공 석사과정 이상',
          '강화학습 기본 이론 이해',
          'Python, PyTorch 사용 경험',
          'OpenAI Gym 또는 유사 환경 경험 우대',
        ],
        skills: ['Python', 'PyTorch', '강화학습', 'OpenAI Gym', 'ROS'],
        location: '대전 유성구 KAIST',
        isRemote: false,
        minReputation: 120,
        applicants: ['user-j'],
        status: 'open',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(),
      },
      {
        id: 'pos-4-2',
        partnerId: 'partner-4',
        title: 'AI 안전성 연구원 (프로젝트)',
        type: 'project',
        description: 'AI 시스템의 안전성과 신뢰성을 검증하는 프레임워크를 개발합니다. Adversarial robustness, alignment 등의 주제를 다룹니다. 6개월 프로젝트 계약입니다.',
        requirements: [
          'AI 안전성/정렬 관련 연구 경험',
          'Adversarial ML 이해',
          'Python, PyTorch 능숙',
          '관련 논문 읽기 및 분석 능력',
        ],
        skills: ['Python', 'PyTorch', 'AI Safety', 'Adversarial ML', 'Alignment'],
        location: '대전 유성구 KAIST',
        isRemote: true,
        minReputation: 200,
        applicants: [],
        status: 'open',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(),
      },
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 120).toISOString(),
  },
  {
    id: 'partner-5',
    name: '서울대학교 AI대학원',
    type: 'university',
    logo: '🎓',
    description: '서울대학교 인공지능대학원은 NLP, 컴퓨터 비전, AI 윤리 분야의 선도적 연구를 수행합니다. 우수한 연구 인력을 양성하고 산학 협력을 추진합니다.',
    website: 'https://snu-ai.example.com',
    fields: ['NLP', '컴퓨터 비전', 'AI 윤리'],
    positions: [
      {
        id: 'pos-5-1',
        partnerId: 'partner-5',
        title: '연구 조교 (AI 윤리)',
        type: 'parttime',
        description: 'AI 윤리 연구실에서 편향성 탐지 및 공정성 평가 관련 연구를 보조합니다. 데이터 수집, 실험 설계, 논문 작성을 지원합니다.',
        requirements: [
          'AI/ML 관련 전공 석사과정 이상',
          'AI 윤리/공정성에 대한 관심',
          'Python 데이터 분석 능력',
          '영어 논문 읽기/작성 능력',
        ],
        skills: ['Python', 'Data Analysis', 'AI Ethics', 'Fairness', 'Research'],
        location: '서울 관악구 서울대학교',
        isRemote: false,
        minReputation: 100,
        applicants: ['user-k', 'user-l'],
        status: 'open',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(),
      },
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 150).toISOString(),
  },
]

const getSampleRecommendations = (): TalentRecommendation[] => [
  {
    id: 'talent-1',
    userId: 'sample-user-1',
    userName: '김민수',
    reputation: 320,
    skills: ['Python', 'NLP', 'PyTorch'],
    projectCount: 5,
    answerCount: 42,
    completedCourses: 8,
    highlights: ['RAG 시스템 개발', 'Q&A 포럼 멘토'],
  },
  {
    id: 'talent-2',
    userId: 'sample-user-2',
    userName: '이지은',
    reputation: 180,
    skills: ['Computer Vision', 'TensorFlow'],
    projectCount: 3,
    answerCount: 18,
    completedCourses: 5,
    highlights: ['의료 영상 프로젝트 참여', '위키 문서 12개 작성'],
  },
  {
    id: 'talent-3',
    userId: 'sample-user-3',
    userName: '박준영',
    reputation: 450,
    skills: ['ML', 'Data Science', 'Python'],
    projectCount: 8,
    answerCount: 76,
    completedCourses: 12,
    highlights: ['프로젝트 리더 3회', '챌린지 우승 2회', '멘토링 활동'],
  },
]

interface StoredData {
  partners: EnterprisePartner[]
}

const loadInitialData = (): StoredData => {
  const stored = loadFromStorage<StoredData>(STORAGE_KEY, { partners: [] })
  if (stored.partners.length > 0) {
    return stored
  }
  return { partners: getSamplePartners() }
}

const saveDataToStorage = (partners: EnterprisePartner[]) => {
  saveToStorage(STORAGE_KEY, { partners })
}

const loadInquiries = (): PartnerInquiry[] => {
  return loadFromStorage<PartnerInquiry[]>(INQUIRY_STORAGE_KEY, [])
}

export const useEnterpriseStore = create<EnterpriseState>((set, get) => {
  const initial = loadInitialData()
  return {
    partners: initial.partners,
    loading: false,
    inquiries: loadInquiries(),

    getPartners: (filter?: EnterpriseFilter) => {
      let result = [...get().partners]
      if (filter?.type) {
        result = result.filter((p) => p.type === filter.type)
      }
      if (filter?.field) {
        result = result.filter((p) =>
          p.fields.some((f) => f.toLowerCase().includes(filter.field!.toLowerCase()))
        )
      }
      if (filter?.search) {
        const search = filter.search.toLowerCase()
        result = result.filter(
          (p) =>
            p.name.toLowerCase().includes(search) ||
            p.description.toLowerCase().includes(search) ||
            p.fields.some((f) => f.toLowerCase().includes(search))
        )
      }
      return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    },

    getPartner: (id: string) => {
      return get().partners.find((p) => p.id === id) ?? null
    },

    getPositions: (filter?: PositionFilter) => {
      const allPositions = get().partners.flatMap((p) => p.positions)
      let result = allPositions.filter((p) => p.status === 'open')

      if (filter?.skill) {
        const skill = filter.skill.toLowerCase()
        result = result.filter((p) =>
          p.skills.some((s) => s.toLowerCase().includes(skill))
        )
      }
      if (filter?.type) {
        result = result.filter((p) => p.type === filter.type)
      }
      if (filter?.remoteOnly) {
        result = result.filter((p) => p.isRemote)
      }
      return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    },

    applyToPosition: (positionId: string, userId: string) => {
      set((state) => {
        const newPartners = state.partners.map((partner) => ({
          ...partner,
          positions: partner.positions.map((pos) => {
            if (pos.id !== positionId) return pos
            if (pos.applicants.includes(userId)) return pos
            return { ...pos, applicants: [...pos.applicants, userId] }
          }),
        }))
        saveDataToStorage(newPartners)
        return { partners: newPartners }
      })

      try {
        supabase.from('enterprise_applications').insert({
          position_id: positionId,
          user_id: userId,
          applied_at: new Date().toISOString(),
        })
      } catch (error) {
        console.error('Failed to sync enterprise application to Supabase:', error)
      }
    },

    getRecommendedTalents: (skills?: string[], minReputation?: number) => {
      let talents = getSampleRecommendations()
      if (skills && skills.length > 0) {
        talents = talents.filter((t) =>
          t.skills.some((s) => skills.some((sk) => s.toLowerCase().includes(sk.toLowerCase())))
        )
      }
      if (minReputation) {
        talents = talents.filter((t) => t.reputation >= minReputation)
      }
      return talents.sort((a, b) => b.reputation - a.reputation)
    },

    submitInquiry: async (data) => {
      const inquiry: PartnerInquiry = {
        id: `inquiry-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        ...data,
        status: 'pending',
        adminNote: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      set((state) => {
        const newInquiries = [inquiry, ...state.inquiries]
        saveToStorage(INQUIRY_STORAGE_KEY, newInquiries)
        return { inquiries: newInquiries }
      })

      // Try Supabase sync
      try {
        await supabase.from('partner_inquiries').insert({
          id: inquiry.id,
          company_name: inquiry.companyName,
          company_type: inquiry.companyType,
          contact_email: inquiry.contactEmail,
          interested_fields: inquiry.interestedFields,
          message: inquiry.message,
          status: inquiry.status,
          admin_note: inquiry.adminNote,
          created_at: inquiry.createdAt,
          updated_at: inquiry.updatedAt,
        })
      } catch (error) {
        console.error('Failed to sync inquiry to Supabase:', error)
      }

      return true
    },

    getInquiries: (filter?) => {
      let result = [...get().inquiries]
      if (filter?.status) {
        result = result.filter((i) => i.status === filter.status)
      }
      return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    },

    updateInquiryStatus: (id, status, adminNote) => {
      set((state) => {
        const newInquiries = state.inquiries.map((i) => {
          if (i.id !== id) return i
          return { ...i, status, adminNote: adminNote ?? i.adminNote, updatedAt: new Date().toISOString() }
        })
        saveToStorage(INQUIRY_STORAGE_KEY, newInquiries)
        return { inquiries: newInquiries }
      })

      // Try Supabase sync
      try {
        supabase.from('partner_inquiries').update({
          status,
          admin_note: adminNote ?? '',
          updated_at: new Date().toISOString(),
        }).eq('id', id)
      } catch (error) {
        console.error('Failed to sync inquiry status to Supabase:', error)
      }
    },
  }
})
