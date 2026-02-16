export interface GuideTipEntry {
  keywords: string[]
  courseSlug?: string
  tips: {
    type: 'think' | 'try' | 'discuss' | 'connect'
    icon: string
    label: string
    prompt: string
  }[]
}

export const guideTipsData: GuideTipEntry[] = [
  // AI 기초
  {
    keywords: ['인공지능', 'AI란', 'AI의 정의'],
    tips: [
      { type: 'think', icon: '🧠', label: '생각해보기', prompt: '만약 로봇이 감정을 느낄 수 있다면, 그것도 "지능"이라고 할 수 있을까요?' },
      { type: 'try', icon: '🔧', label: '직접 해보기', prompt: '시리나 빅스비에게 "너는 AI야?"라고 물어보세요. 어떤 대답을 하나요?' },
      { type: 'discuss', icon: '💬', label: '친구와 토론', prompt: '친구에게 "AI가 뭔지" 30초 안에 설명해보세요. 쉽지 않죠?' },
      { type: 'connect', icon: '🔗', label: '생활 속 연결', prompt: '오늘 하루 동안 AI 없이는 불편했을 순간을 3가지 떠올려보세요.' },
    ],
  },
  // 머신러닝
  {
    keywords: ['머신러닝', '기계학습', '학습 알고리즘'],
    tips: [
      { type: 'think', icon: '🧠', label: '생각해보기', prompt: '100장의 고양이 사진만 보고 배운 AI가 처음 보는 고양이도 알아볼 수 있을까요? 왜 그럴까요?' },
      { type: 'try', icon: '🔧', label: '직접 해보기', prompt: '종이에 동그라미와 세모를 10개씩 그리고, 친구에게 규칙을 설명하지 않고 분류하게 해보세요.' },
      { type: 'discuss', icon: '💬', label: '친구와 토론', prompt: '"기계가 학습한다"는 것이 사람이 공부하는 것과 어떻게 다른지 친구와 이야기해보세요.' },
      { type: 'connect', icon: '🔗', label: '생활 속 연결', prompt: '여러분이 새로운 게임을 배울 때 어떤 과정을 거치나요? 기계도 비슷한 과정을 거쳐요.' },
    ],
  },
  // 신경망
  {
    keywords: ['신경망', '뉴런', '퍼셉트론', '뉴럴'],
    tips: [
      { type: 'think', icon: '🧠', label: '생각해보기', prompt: '뉴런 하나는 별로 똑똑하지 않아요. 그런데 수백만 개가 모이면 왜 똑똑해질까요?' },
      { type: 'try', icon: '🔧', label: '직접 해보기', prompt: '친구 5명이 각각 하나의 뉴런 역할을 해보세요. 숫자를 전달하고 임계값을 넘으면 다음 친구에게 보내세요!' },
      { type: 'discuss', icon: '💬', label: '친구와 토론', prompt: '"인공 신경망"이 진짜 뇌와 같다고 할 수 있을까요? 어떤 점이 다를까요?' },
      { type: 'connect', icon: '🔗', label: '생활 속 연결', prompt: '학급 반장 선거도 신경망과 비슷해요. 각자 의견(입력)이 모여서 하나의 결과(출력)가 나오죠!' },
    ],
  },
  // 딥러닝
  {
    keywords: ['딥러닝', 'deep learning', '심층'],
    tips: [
      { type: 'think', icon: '🧠', label: '생각해보기', prompt: '왜 층을 더 많이 쌓으면 더 복잡한 패턴을 배울 수 있을까요? 반대로 너무 많으면 어떤 문제가 생길까요?' },
      { type: 'try', icon: '🔧', label: '직접 해보기', prompt: '종이를 한 번 접으면 2층, 두 번 접으면 4층... 10번 접으면 몇 층일까요? 이것이 "깊다"의 힘이에요!' },
      { type: 'discuss', icon: '💬', label: '친구와 토론', prompt: '딥러닝이 왜 최근에야 급발전했는지 친구와 추측해보세요. (힌트: 데이터, 컴퓨터 성능, 알고리즘)' },
      { type: 'connect', icon: '🔗', label: '생활 속 연결', prompt: '레고 블록을 층층이 쌓아서 집을 만드는 것처럼, 딥러닝도 간단한 것을 쌓아서 복잡한 것을 만들어요.' },
    ],
  },
  // CNN / 이미지
  {
    keywords: ['CNN', '합성곱', '이미지', '비전', '사진'],
    tips: [
      { type: 'think', icon: '🧠', label: '생각해보기', prompt: '여러분이 "고양이"를 알아보려면 귀? 수염? 눈? 무엇을 먼저 볼까요? CNN도 비슷하게 특징을 찾아요.' },
      { type: 'try', icon: '🔧', label: '직접 해보기', prompt: '사진의 한 부분만 보고 무슨 사진인지 맞춰보세요. CNN의 "필터"가 하는 일과 비슷해요!' },
      { type: 'discuss', icon: '💬', label: '친구와 토론', prompt: '사람의 눈은 색맹이면 색을 못 보는데, AI도 "보지 못하는" 것이 있을까요?' },
      { type: 'connect', icon: '🔗', label: '생활 속 연결', prompt: '돋보기로 그림을 확대하면 점들이 보이죠? CNN도 이미지를 작은 조각으로 나눠서 분석해요.' },
    ],
  },
  // 생성형 AI
  {
    keywords: ['생성형', 'generative', 'GAN', '생성 모델', 'GPT', 'ChatGPT'],
    tips: [
      { type: 'think', icon: '🧠', label: '생각해보기', prompt: 'AI가 "창작"을 한다면, 그것은 진짜 창의력일까요? 사람의 창의력과 뭐가 다를까요?' },
      { type: 'try', icon: '🔧', label: '직접 해보기', prompt: 'ChatGPT에게 같은 질문을 3번 해보세요. 매번 다른 답이 나온다면, 왜 그럴까요?' },
      { type: 'discuss', icon: '💬', label: '친구와 토론', prompt: 'AI가 만든 음악이 사람이 만든 음악보다 더 인기 있다면, 작곡가라는 직업은 사라질까요?' },
      { type: 'connect', icon: '🔗', label: '생활 속 연결', prompt: '여러분이 글을 쓸 때 이전에 읽었던 것들에서 영향받듯, AI도 학습한 데이터에서 영향받아요.' },
    ],
  },
  // 데이터 / 분류
  {
    keywords: ['데이터', '분류', '지도학습', '학습 데이터', '레이블'],
    tips: [
      { type: 'think', icon: '🧠', label: '생각해보기', prompt: '데이터에 잘못된 라벨이 붙어있으면 AI는 어떻게 될까요? "가짜 뉴스를 배운 AI"를 상상해보세요.' },
      { type: 'try', icon: '🔧', label: '직접 해보기', prompt: '교실 친구들을 3개 그룹으로 나눠보세요. 어떤 기준으로 나눴나요? 다른 기준도 가능한가요?' },
      { type: 'discuss', icon: '💬', label: '친구와 토론', prompt: '"좋은 데이터"란 무엇일까요? 많으면 무조건 좋을까요?' },
      { type: 'connect', icon: '🔗', label: '생활 속 연결', prompt: '도서관에서 책을 분류하는 것과 AI의 분류가 비슷해요. 기준이 중요하죠!' },
    ],
  },
  // 과적합 / 평가
  {
    keywords: ['과적합', '평가', '검증', '정확도', '테스트'],
    tips: [
      { type: 'think', icon: '🧠', label: '생각해보기', prompt: '시험 범위를 완벽히 외웠는데 응용 문제가 나오면 못 푸는 학생... AI도 이런 문제가 있을까요?' },
      { type: 'try', icon: '🔧', label: '직접 해보기', prompt: '친구의 얼굴 5장만 보고 그려보세요. 그 다음 다른 사진을 보면 비슷한가요? 이것이 과적합이에요!' },
      { type: 'discuss', icon: '💬', label: '친구와 토론', prompt: '"100% 정확한 AI"는 가능할까요? 왜 가능하거나 불가능한지 토론해보세요.' },
      { type: 'connect', icon: '🔗', label: '생활 속 연결', prompt: '새 신발을 살 때 가게에서 신어보는 것(검증)과 실제로 걸어보는 것(테스트)의 차이를 생각해보세요.' },
    ],
  },
  // AI 윤리
  {
    keywords: ['윤리', '편향', '공정', '책임', '프라이버시'],
    tips: [
      { type: 'think', icon: '🧠', label: '생각해보기', prompt: 'AI가 범죄 예측을 한다면, 특정 지역 사람들을 차별하는 건 아닐까요?' },
      { type: 'try', icon: '🔧', label: '직접 해보기', prompt: 'AI 이미지 생성기에 "과학자"를 그려달라고 해보세요. 어떤 모습으로 나오나요? 편향이 보이나요?' },
      { type: 'discuss', icon: '💬', label: '친구와 토론', prompt: '자율주행 자동차가 사고를 내면 책임은 누구에게 있을까요? 운전자? 제조사? AI?' },
      { type: 'connect', icon: '🔗', label: '생활 속 연결', prompt: 'SNS에서 보는 뉴스가 한쪽으로 치우쳐 보인 적 있나요? 이것도 AI 편향의 한 예예요.' },
    ],
  },
  // 프롬프트
  {
    keywords: ['프롬프트', 'prompt', '질문법'],
    tips: [
      { type: 'think', icon: '🧠', label: '생각해보기', prompt: '왜 같은 AI인데 질문하는 방법에 따라 전혀 다른 답이 나올까요?' },
      { type: 'try', icon: '🔧', label: '직접 해보기', prompt: 'AI에게 "시 써줘"라고 한 것과 "벚꽃이 지는 봄날 아침에 대한 5줄 시를 써줘"를 비교해보세요!' },
      { type: 'discuss', icon: '💬', label: '친구와 토론', prompt: '프롬프트 엔지니어링이 미래에 중요한 직업 능력이 될까요? 왜 그렇게 생각하나요?' },
      { type: 'connect', icon: '🔗', label: '생활 속 연결', prompt: '선생님께 질문할 때도 구체적으로 물어보면 더 좋은 답을 받죠? AI도 마찬가지예요.' },
    ],
  },
  // 강화학습
  {
    keywords: ['강화학습', 'reinforcement', '보상', '에이전트'],
    tips: [
      { type: 'think', icon: '🧠', label: '생각해보기', prompt: '강아지에게 간식으로 "앉아"를 가르치는 것과 강화학습은 어떤 점이 비슷할까요?' },
      { type: 'try', icon: '🔧', label: '직접 해보기', prompt: '친구에게 "뜨거워/차가워" 게임을 해보세요. 숨긴 물건에 가까우면 "뜨거워!" — 이것이 강화학습이에요!' },
      { type: 'discuss', icon: '💬', label: '친구와 토론', prompt: '사람도 보상(용돈, 칭찬)으로 동기부여되죠? AI의 보상은 뭘까요?' },
      { type: 'connect', icon: '🔗', label: '생활 속 연결', prompt: '게임에서 레벨업하면 기분 좋죠? 강화학습 AI도 "점수"가 올라가면 그 행동을 더 많이 해요.' },
    ],
  },
  // 코딩 / Python
  {
    keywords: ['파이썬', 'Python', '코딩', '프로그래밍', '코드'],
    tips: [
      { type: 'think', icon: '🧠', label: '생각해보기', prompt: '왜 AI 개발에는 파이썬이 가장 많이 쓰일까요? 다른 언어로는 안 될까요?' },
      { type: 'try', icon: '🔧', label: '직접 해보기', prompt: '코드를 한 줄 바꿔보세요. 어떤 결과가 달라지나요? 실험이 최고의 선생님이에요!' },
      { type: 'discuss', icon: '💬', label: '친구와 토론', prompt: '코딩을 못해도 AI를 잘 활용할 수 있을까요? 코딩을 꼭 배워야 할까요?' },
      { type: 'connect', icon: '🔗', label: '생활 속 연결', prompt: '요리 레시피처럼, 코드도 순서대로 따라하면 결과물이 나와요. 재료(데이터)와 레시피(알고리즘)가 중요해요!' },
    ],
  },
  // RAG / 벡터
  {
    keywords: ['RAG', '벡터', '임베딩', '검색'],
    tips: [
      { type: 'think', icon: '🧠', label: '생각해보기', prompt: '오픈북 시험에서 책을 찾는 시간이 오래 걸리면 어떡하죠? AI도 빨리 찾는 방법이 필요해요!' },
      { type: 'try', icon: '🔧', label: '직접 해보기', prompt: '"사과"와 비슷한 단어를 5개 적어보세요. "과일", "빨간색", "아이폰"... AI도 이런 연결을 숫자로 표현해요!' },
      { type: 'discuss', icon: '💬', label: '친구와 토론', prompt: 'AI가 거짓말을 하는 "할루시네이션"을 줄이려면 어떻게 해야 할까요?' },
      { type: 'connect', icon: '🔗', label: '생활 속 연결', prompt: '도서관에서 원하는 책을 찾을 때 목차와 색인을 쓰죠? RAG는 AI에게 이런 도구를 주는 거예요.' },
    ],
  },
]

// Fallback tips for any topic
export const defaultGuideTips: GuideTipEntry = {
  keywords: [],
  tips: [
    { type: 'think', icon: '🧠', label: '생각해보기', prompt: '이 개념이 없다면 우리 생활은 어떻게 달라질까요?' },
    { type: 'try', icon: '🔧', label: '직접 해보기', prompt: '이 개념을 실생활에서 찾아보세요. 의외로 가까이에 있을 거예요!' },
    { type: 'discuss', icon: '💬', label: '친구와 토론', prompt: '오늘 배운 내용을 친구에게 1분 안에 설명해보세요.' },
    { type: 'connect', icon: '🔗', label: '생활 속 연결', prompt: '이 기술이 여러분의 꿈과 어떻게 연결될 수 있을지 상상해보세요.' },
  ],
}

// Helper function to find matching tips
export function findGuideTips(courseSlug: string, sectionTitle: string, chapterTitle: string): GuideTipEntry {
  const searchText = `${sectionTitle} ${chapterTitle}`.toLowerCase()

  const matched = guideTipsData.find(entry => {
    if (entry.courseSlug && entry.courseSlug !== courseSlug) return false
    return entry.keywords.some(keyword => searchText.includes(keyword.toLowerCase()))
  })

  return matched || defaultGuideTips
}
