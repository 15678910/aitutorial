export type MiniLabType = 'slider' | 'toggle' | 'drag-sort' | 'comparison' | 'poll'

export interface MiniLabEntry {
  id: string
  keywords: string[]
  courseSlug?: string
  title: string
  description: string
  type: MiniLabType
  config: SliderConfig | ToggleConfig | DragSortConfig | ComparisonConfig | PollConfig
  feedbackMessage: string
}

export interface SliderConfig {
  type: 'slider'
  sliders: { label: string; min: number; max: number; step: number; defaultValue: number; unit: string }[]
  resultLabel: string
  formula: string  // description of how sliders affect result (displayed to user)
}

export interface ToggleConfig {
  type: 'toggle'
  toggles: { label: string; onLabel: string; offLabel: string; defaultOn: boolean }[]
  scenarios: { combination: boolean[]; result: string; emoji: string }[]
}

export interface DragSortConfig {
  type: 'drag-sort'
  items: { id: string; label: string; emoji: string }[]
  correctOrder: string[]  // item IDs in correct order
  question: string
}

export interface ComparisonConfig {
  type: 'comparison'
  leftTitle: string
  rightTitle: string
  leftItems: string[]
  rightItems: string[]
  leftEmoji: string
  rightEmoji: string
}

export interface PollConfig {
  type: 'poll'
  question: string
  options: { id: string; label: string; emoji: string }[]
}

export const miniLabsData: MiniLabEntry[] = [
  // AI 기초 - 슬라이더: AI 능력치 조절
  {
    id: 'lab-ai-abilities',
    keywords: ['인공지능', 'AI란', 'AI의 정의'],
    title: 'AI 능력치를 조절해 보세요!',
    description: '슬라이더를 움직여 AI의 능력치를 바꿔보세요. 어떤 AI가 만들어질까요?',
    type: 'slider',
    config: {
      type: 'slider',
      sliders: [
        { label: '언어 이해력', min: 0, max: 100, step: 10, defaultValue: 50, unit: '%' },
        { label: '이미지 인식력', min: 0, max: 100, step: 10, defaultValue: 30, unit: '%' },
        { label: '창의력', min: 0, max: 100, step: 10, defaultValue: 20, unit: '%' },
      ],
      resultLabel: '이 AI는...',
      formula: '능력치 조합에 따라 챗봇, 자율주행, 아티스트 등 다양한 AI가 됩니다!',
    },
    feedbackMessage: '각 능력치를 바꿀 때마다 AI의 특성이 달라져요. 모든 걸 다 잘하는 AI를 만들 수 있을까요?',
  },
  // 머신러닝 - 투표: 지도학습 vs 비지도학습
  {
    id: 'lab-ml-poll',
    keywords: ['머신러닝', '기계학습', '지도학습', '비지도학습'],
    title: '어떤 학습 방법이 더 좋을까요?',
    description: '다음 상황에서 어떤 방법이 적합할지 투표해보세요!',
    type: 'poll',
    config: {
      type: 'poll',
      question: '쓰레기 분류 AI를 만든다면 어떤 방법이 좋을까요?',
      options: [
        { id: 'supervised', label: '사람이 분류한 데이터로 학습 (지도학습)', emoji: '👨‍🏫' },
        { id: 'unsupervised', label: 'AI가 스스로 패턴을 찾게 하기 (비지도학습)', emoji: '🤖' },
        { id: 'reinforcement', label: '맞으면 보상, 틀리면 벌점 (강화학습)', emoji: '🎯' },
        { id: 'hybrid', label: '여러 방법을 섞어서 사용', emoji: '🔀' },
      ],
    },
    feedbackMessage: '정답은 없어요! 상황에 따라 최적의 방법이 달라져요. 다른 친구들은 어떻게 생각했는지 비교해보세요.',
  },
  // 신경망 - 토글: 뉴런 활성화
  {
    id: 'lab-neuron-toggle',
    keywords: ['신경망', '뉴런', '퍼셉트론'],
    title: '뉴런을 켜고 꺼 보세요!',
    description: '입력 뉴런을 켜거나 끄면 출력이 어떻게 바뀌는지 확인해보세요.',
    type: 'toggle',
    config: {
      type: 'toggle',
      toggles: [
        { label: '입력 1: 밝기', onLabel: '밝음', offLabel: '어두움', defaultOn: true },
        { label: '입력 2: 크기', onLabel: '큼', offLabel: '작음', defaultOn: false },
        { label: '입력 3: 움직임', onLabel: '있음', offLabel: '없음', defaultOn: false },
      ],
      scenarios: [
        { combination: [true, true, true], result: '🐕 강아지를 감지했어요! (큰 물체가 밝은 곳에서 움직임)', emoji: '✅' },
        { combination: [true, true, false], result: '🪑 가구인 것 같아요 (큰 물체, 밝음, 안 움직임)', emoji: '🤔' },
        { combination: [true, false, true], result: '🐈 고양이일 수 있어요 (작은 물체가 밝은 곳에서 움직임)', emoji: '🤔' },
        { combination: [false, false, false], result: '❓ 아무것도 감지할 수 없어요 (어둡고, 작고, 안 움직임)', emoji: '❌' },
      ],
    },
    feedbackMessage: '입력 조합에 따라 AI의 판단이 완전히 달라져요! 실제 신경망에는 이런 뉴런이 수백만 개 있어요.',
  },
  // 딥러닝 - 비교: 얕은 vs 깊은 네트워크
  {
    id: 'lab-depth-comparison',
    keywords: ['딥러닝', 'deep learning', '심층'],
    title: '얕은 AI vs 깊은 AI 비교!',
    description: '신경망의 깊이에 따라 무엇을 할 수 있는지 비교해보세요.',
    type: 'comparison',
    config: {
      type: 'comparison',
      leftTitle: '얕은 신경망 (1~2층)',
      rightTitle: '깊은 신경망 (수십~수백 층)',
      leftItems: [
        '간단한 분류 (스팸/정상)',
        '기본 패턴 인식',
        '빠른 학습 속도',
        '적은 데이터로 OK',
      ],
      rightItems: [
        '복잡한 이미지 인식',
        '자연어 이해 및 생성',
        '자율주행 판단',
        '대량의 데이터 필요',
      ],
      leftEmoji: '🏠',
      rightEmoji: '🏢',
    },
    feedbackMessage: '항상 깊은 게 좋은 건 아니에요! 간단한 문제에는 얕은 네트워크가 더 효율적이에요.',
  },
  // CNN - 드래그 정렬: 이미지 인식 순서
  {
    id: 'lab-cnn-order',
    keywords: ['CNN', '합성곱', '이미지 인식', '비전'],
    title: 'CNN이 이미지를 분석하는 순서를 맞춰보세요!',
    description: '컴퓨터가 사진을 인식하는 단계를 올바른 순서로 정렬해보세요.',
    type: 'drag-sort',
    config: {
      type: 'drag-sort',
      items: [
        { id: 'edge', label: '가장자리(선) 감지', emoji: '📐' },
        { id: 'texture', label: '질감/패턴 인식', emoji: '🧶' },
        { id: 'part', label: '부분(귀, 눈, 코) 인식', emoji: '👃' },
        { id: 'object', label: '전체 물체 인식 → "고양이!"', emoji: '🐱' },
        { id: 'pixel', label: '픽셀 입력 받기', emoji: '🟦' },
      ],
      correctOrder: ['pixel', 'edge', 'texture', 'part', 'object'],
      question: 'CNN이 "고양이"를 인식하기까지의 순서를 맞춰보세요!',
    },
    feedbackMessage: '픽셀 → 선 → 패턴 → 부분 → 전체! CNN은 간단한 특징부터 복잡한 특징 순서로 학습해요.',
  },
  // 생성형 AI - 투표
  {
    id: 'lab-gen-ai-poll',
    keywords: ['생성형', 'generative', 'GAN', '생성 AI'],
    title: 'AI가 만든 것 vs 사람이 만든 것',
    description: 'AI가 만든 창작물에 대해 어떻게 생각하나요?',
    type: 'poll',
    config: {
      type: 'poll',
      question: 'AI가 그린 그림이 미술 대회에서 1등을 했어요. 이것은...',
      options: [
        { id: 'fair', label: '공정해요! AI도 도구니까', emoji: '✅' },
        { id: 'unfair', label: '불공정해요! 사람만 참가해야 해요', emoji: '❌' },
        { id: 'separate', label: 'AI 부문을 따로 만들어야 해요', emoji: '🔀' },
        { id: 'unsure', label: '아직 잘 모르겠어요', emoji: '🤔' },
      ],
    },
    feedbackMessage: '이런 윤리적 질문에는 정답이 없어요. 다양한 관점에서 생각해보는 것이 중요해요!',
  },
  // LLM - 슬라이더: Temperature 조절
  {
    id: 'lab-temperature',
    keywords: ['LLM', 'GPT', 'ChatGPT', '대규모 언어', '트랜스포머'],
    title: 'AI의 "창의력 온도"를 조절해보세요!',
    description: 'Temperature를 바꾸면 AI의 답변이 어떻게 달라지는지 확인해보세요.',
    type: 'slider',
    config: {
      type: 'slider',
      sliders: [
        { label: 'Temperature (창의력)', min: 0, max: 100, step: 10, defaultValue: 50, unit: '' },
      ],
      resultLabel: '이 설정으로 AI가 쓴 동화:',
      formula: '낮으면 정확하지만 뻔한 답, 높으면 창의적이지만 엉뚱한 답이 나와요!',
    },
    feedbackMessage: 'Temperature 0에 가까우면 "옛날 옛적에 왕자와 공주가...", 100에 가까우면 "보라색 코끼리가 하늘을 날며..."',
  },
  // 데이터 - 드래그 정렬: 좋은 데이터 만들기
  {
    id: 'lab-data-quality',
    keywords: ['데이터', '학습 데이터', '데이터셋', '레이블'],
    title: '좋은 데이터의 조건을 순서대로!',
    description: 'AI에게 좋은 데이터를 만드는 과정을 순서대로 정렬해보세요.',
    type: 'drag-sort',
    config: {
      type: 'drag-sort',
      items: [
        { id: 'collect', label: '데이터 수집하기', emoji: '📥' },
        { id: 'clean', label: '오류/중복 제거하기', emoji: '🧹' },
        { id: 'label', label: '라벨(정답) 달기', emoji: '🏷️' },
        { id: 'balance', label: '균형 있게 맞추기', emoji: '⚖️' },
        { id: 'split', label: '학습/검증/테스트 나누기', emoji: '✂️' },
      ],
      correctOrder: ['collect', 'clean', 'label', 'balance', 'split'],
      question: 'AI를 위한 데이터 준비 과정을 올바른 순서로 정렬하세요!',
    },
    feedbackMessage: '수집 → 정제 → 라벨링 → 균형 → 분할! 좋은 AI는 좋은 데이터에서 시작돼요.',
  },
  // AI 윤리 - 투표
  {
    id: 'lab-ethics-poll',
    keywords: ['윤리', '편향', '공정', '책임'],
    title: 'AI 윤리 딜레마!',
    description: '다음 상황에서 여러분은 어떤 선택을 하겠어요?',
    type: 'poll',
    config: {
      type: 'poll',
      question: '자율주행차가 사고를 피할 수 없는 상황에서, AI는 누구를 보호해야 할까요?',
      options: [
        { id: 'passenger', label: '탑승자를 보호', emoji: '🚗' },
        { id: 'pedestrian', label: '보행자를 보호', emoji: '🚶' },
        { id: 'minimize', label: '피해를 최소화하는 방향', emoji: '📊' },
        { id: 'human', label: '이런 결정은 AI가 하면 안 됨', emoji: '🙅' },
      ],
    },
    feedbackMessage: '이것이 유명한 "트롤리 딜레마"의 AI 버전이에요. 전 세계 학자들도 아직 답을 찾지 못했어요!',
  },
  // 강화학습 - 토글: 보상 시스템 실험
  {
    id: 'lab-reward-toggle',
    keywords: ['강화학습', 'reinforcement', '보상', '에이전트'],
    title: '보상 시스템을 설계해보세요!',
    description: '로봇에게 어떤 보상을 주면 미로를 잘 탈출할까요?',
    type: 'toggle',
    config: {
      type: 'toggle',
      toggles: [
        { label: '골인 보상', onLabel: '+100점', offLabel: '보상 없음', defaultOn: true },
        { label: '벽 충돌 벌점', onLabel: '-10점', offLabel: '벌점 없음', defaultOn: false },
        { label: '시간 보너스', onLabel: '빠를수록 +점', offLabel: '시간 무관', defaultOn: false },
      ],
      scenarios: [
        { combination: [true, true, true], result: '🏆 최적 설정! 빠르고 정확하게 탈출하는 AI가 됩니다', emoji: '⭐' },
        { combination: [true, true, false], result: '👍 안전하지만 느린 AI — 충돌은 피하지만 시간은 오래 걸려요', emoji: '🐢' },
        { combination: [true, false, false], result: '😅 골인은 하지만 벽에 막 부딪히는 AI', emoji: '💥' },
        { combination: [false, false, false], result: '❌ 아무 보상이 없으면 AI는 아무것도 배우지 못해요!', emoji: '😴' },
      ],
    },
    feedbackMessage: '보상 설계가 AI의 행동을 결정해요! 잘못된 보상은 예상 못한 행동을 만들 수 있어요.',
  },
]

// Default mini lab for unmatched topics
export const defaultMiniLab: MiniLabEntry = {
  id: 'lab-default-poll',
  keywords: [],
  title: '오늘 배운 내용, 어땠나요?',
  description: '이 섹션에서 배운 내용에 대한 생각을 나눠보세요!',
  type: 'poll',
  config: {
    type: 'poll',
    question: '이 내용의 난이도는 어땠나요?',
    options: [
      { id: 'easy', label: '쉬웠어요! 더 어려운 걸 원해요', emoji: '😊' },
      { id: 'right', label: '딱 좋았어요!', emoji: '👍' },
      { id: 'hard', label: '좀 어려웠어요', emoji: '😅' },
      { id: 'lost', label: '무슨 말인지 모르겠어요', emoji: '😵' },
    ],
  },
  feedbackMessage: '솔직한 의견 감사해요! 어렵다고 느끼는 건 자연스러운 거예요. 천천히 다시 읽어보세요!',
}

// Helper function to find matching mini lab
export function findMiniLab(courseSlug: string, sectionTitle: string, chapterTitle: string): MiniLabEntry {
  const searchText = `${sectionTitle} ${chapterTitle}`.toLowerCase()

  const matched = miniLabsData.find(entry => {
    if (entry.courseSlug && entry.courseSlug !== courseSlug) return false
    return entry.keywords.some(keyword => searchText.includes(keyword.toLowerCase()))
  })

  return matched || defaultMiniLab
}
