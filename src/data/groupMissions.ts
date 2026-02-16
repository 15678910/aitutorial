import type { GroupMission } from '../types/studyGroup'

export const groupMissionsData: GroupMission[] = [
  {
    id: 'mission-school-ai',
    title: 'AI가 우리 학교를 바꾼다면?',
    description: '우리 학교에 AI를 도입한다면 어떤 변화가 생길지 함께 상상하고 발표해보세요!',
    type: 'discussion',
    courseSlug: 'ai-intro',
    difficulty: 'easy',
    estimatedMinutes: 30,
    steps: [
      { id: 'step1', title: '아이디어 모으기', description: 'AI가 학교에서 할 수 있는 일을 각자 3개씩 적기', type: 'write', isCompleted: false },
      { id: 'step2', title: '토론하기', description: '가장 좋은 아이디어 3개를 함께 고르기', type: 'discuss', isCompleted: false },
      { id: 'step3', title: '발표 준비', description: '선정된 아이디어를 정리하여 발표 자료 만들기', type: 'present', isCompleted: false },
    ],
    rewardPoints: 30,
  },
  {
    id: 'mission-fair-ai',
    title: '공정한 AI 심판 만들기',
    description: 'AI 채점 시스템이 공정하려면 어떤 조건이 필요할까요? 규칙을 직접 만들어보세요!',
    type: 'discussion',
    courseSlug: 'ai-intro',
    difficulty: 'medium',
    estimatedMinutes: 45,
    steps: [
      { id: 'step1', title: '불공정한 사례 찾기', description: 'AI가 편향된 판단을 한 실제 사례 조사하기', type: 'write', isCompleted: false },
      { id: 'step2', title: '공정성 규칙 만들기', description: '공정한 AI를 위한 규칙 5가지 만들기', type: 'discuss', isCompleted: false },
      { id: 'step3', title: '규칙 테스트', description: '만든 규칙으로 가상 시나리오 테스트해보기', type: 'try', isCompleted: false },
      { id: 'step4', title: '결과 공유', description: '다른 그룹에게 규칙과 결과 발표하기', type: 'present', isCompleted: false },
    ],
    rewardPoints: 50,
  },
  {
    id: 'mission-my-ai-idea',
    title: '나만의 AI 아이디어 해커톤',
    description: '우리 반/동네/가족을 위한 AI 서비스를 기획해보세요!',
    type: 'research',
    courseSlug: 'ai-intro',
    difficulty: 'medium',
    estimatedMinutes: 60,
    steps: [
      { id: 'step1', title: '문제 발견', description: '주변에서 AI로 해결할 수 있는 불편한 점 찾기', type: 'write', isCompleted: false },
      { id: 'step2', title: '아이디어 구체화', description: 'AI 서비스의 이름, 기능, 사용자 정하기', type: 'write', isCompleted: false },
      { id: 'step3', title: '프로토타입 그리기', description: '종이에 화면을 그려보기 (종이 프로토타이핑)', type: 'try', isCompleted: false },
      { id: 'step4', title: '피드백 받기', description: '다른 그룹에게 아이디어 발표하고 피드백 받기', type: 'present', isCompleted: false },
    ],
    rewardPoints: 60,
  },
  {
    id: 'mission-ai-vs-human',
    title: 'AI vs 사람 대결!',
    description: 'AI와 사람이 각각 같은 문제를 풀어보고 결과를 비교해보세요!',
    type: 'experiment',
    courseSlug: 'ml-basics',
    difficulty: 'easy',
    estimatedMinutes: 30,
    steps: [
      { id: 'step1', title: '문제 선정', description: '분류, 예측, 추천 중 하나의 문제 고르기', type: 'discuss', isCompleted: false },
      { id: 'step2', title: '사람 도전', description: '그룹원들이 직접 문제를 풀어보기', type: 'try', isCompleted: false },
      { id: 'step3', title: 'AI 결과 확인', description: 'ChatGPT 등 AI에게 같은 문제를 주고 비교하기', type: 'try', isCompleted: false },
      { id: 'step4', title: '분석하기', description: '사람과 AI 각각의 장단점 정리하고 토론하기', type: 'discuss', isCompleted: false },
    ],
    rewardPoints: 40,
  },
  {
    id: 'mission-data-detective',
    title: '데이터 탐정단',
    description: '주변의 데이터를 수집하고 분석하여 숨겨진 패턴을 찾아보세요!',
    type: 'experiment',
    courseSlug: 'ml-basics',
    difficulty: 'medium',
    estimatedMinutes: 50,
    steps: [
      { id: 'step1', title: '데이터 주제 선정', description: '급식 메뉴, 등교 시간, 취미 등 조사할 주제 정하기', type: 'discuss', isCompleted: false },
      { id: 'step2', title: '데이터 수집', description: '설문조사 또는 관찰로 데이터 모으기 (최소 20개)', type: 'try', isCompleted: false },
      { id: 'step3', title: '패턴 찾기', description: '수집한 데이터에서 규칙이나 패턴 찾아보기', type: 'write', isCompleted: false },
      { id: 'step4', title: '발표하기', description: '발견한 패턴을 시각화해서 발표하기', type: 'present', isCompleted: false },
    ],
    rewardPoints: 50,
  },
  {
    id: 'mission-prompt-battle',
    title: '프롬프트 배틀!',
    description: '같은 주제로 누가 더 좋은 프롬프트를 만드는지 겨뤄보세요!',
    type: 'experiment',
    courseSlug: 'generative-ai',
    difficulty: 'easy',
    estimatedMinutes: 25,
    steps: [
      { id: 'step1', title: '주제 정하기', description: '그림, 글, 코드 중 AI에게 시킬 주제 정하기', type: 'discuss', isCompleted: false },
      { id: 'step2', title: '프롬프트 작성', description: '각자 최고의 프롬프트 작성하기 (비밀!)', type: 'write', isCompleted: false },
      { id: 'step3', title: 'AI 결과 비교', description: '각 프롬프트의 결과물을 비교하고 투표하기', type: 'try', isCompleted: false },
      { id: 'step4', title: '노하우 공유', description: '좋은 프롬프트의 비결을 서로 공유하기', type: 'discuss', isCompleted: false },
    ],
    rewardPoints: 35,
  },
  {
    id: 'mission-ai-news-report',
    title: 'AI 뉴스 탐구 보고서',
    description: '최근 AI 관련 뉴스를 조사하고 분석 보고서를 작성해보세요!',
    type: 'research',
    courseSlug: 'ai-intro',
    difficulty: 'hard',
    estimatedMinutes: 60,
    steps: [
      { id: 'step1', title: '뉴스 수집', description: '최근 한 달간 AI 관련 뉴스 3개 이상 찾기', type: 'write', isCompleted: false },
      { id: 'step2', title: '핵심 분석', description: '각 뉴스의 AI 기술과 사회적 영향 분석하기', type: 'write', isCompleted: false },
      { id: 'step3', title: '토론하기', description: 'AI가 사회에 미치는 긍정적/부정적 영향 토론하기', type: 'discuss', isCompleted: false },
      { id: 'step4', title: '보고서 발표', description: '분석 보고서를 정리하여 발표하기', type: 'present', isCompleted: false },
    ],
    rewardPoints: 70,
  },
  {
    id: 'mission-teach-ai',
    title: 'AI 선생님 되기',
    description: '다른 학생이나 부모님에게 AI 개념을 쉽게 가르쳐보세요!',
    type: 'presentation',
    courseSlug: 'ai-intro',
    difficulty: 'hard',
    estimatedMinutes: 45,
    steps: [
      { id: 'step1', title: '주제 선정', description: '가르칠 AI 개념 하나 선택하기', type: 'discuss', isCompleted: false },
      { id: 'step2', title: '쉬운 설명 만들기', description: '초등학생도 이해할 수 있는 비유와 예시 준비하기', type: 'write', isCompleted: false },
      { id: 'step3', title: '리허설', description: '그룹 내에서 먼저 발표하고 피드백 받기', type: 'present', isCompleted: false },
      { id: 'step4', title: '실제 교육', description: '다른 학생이나 가족에게 직접 가르치기', type: 'present', isCompleted: false },
    ],
    rewardPoints: 80,
  },
]

// Helper to get missions for a course
export function getMissionsForCourse(courseSlug: string): GroupMission[] {
  return groupMissionsData.filter(m => m.courseSlug === courseSlug)
}

// Get all unique course slugs that have missions
export function getCourseSlugsWithMissions(): string[] {
  return [...new Set(groupMissionsData.map(m => m.courseSlug))]
}
