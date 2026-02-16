export interface WhyItMattersEntry {
  keywords: string[]  // keywords to match against section/chapter titles
  courseSlug?: string  // optional: restrict to specific course
  emoji: string
  title: string
  realLifeExamples: {
    title: string
    description: string
    icon: string
  }[]
  studentQuestion: string  // thought-provoking question
}

export const whyItMattersData: WhyItMattersEntry[] = [
  // AI 기초 / 인공지능이란
  {
    keywords: ['인공지능', 'AI란', 'AI의 정의', '인공지능이란'],
    emoji: '🤖',
    title: 'AI는 이미 여러분 곁에 있어요!',
    realLifeExamples: [
      { title: '유튜브 추천', description: '좋아하는 영상을 끝없이 추천해주는 것도 AI예요', icon: '📺' },
      { title: '시리 & 빅스비', description: '"오늘 날씨 알려줘"라고 말하면 대답하는 음성 비서', icon: '🗣️' },
      { title: '게임 속 NPC', description: '게임에서 적이 여러분을 쫓아오는 것도 AI 덕분이에요', icon: '🎮' },
    ],
    studentQuestion: '여러분이 오늘 사용한 것 중에 AI가 숨어있는 것은 무엇일까요?',
  },
  // 머신러닝 / 기계학습
  {
    keywords: ['머신러닝', '기계학습', 'machine learning', '학습 알고리즘'],
    emoji: '🧠',
    title: '기계도 경험으로 배울 수 있어요!',
    realLifeExamples: [
      { title: '스팸 메일 필터', description: '수천 개의 스팸을 보고 배워서 자동으로 걸러내요', icon: '📧' },
      { title: '맞춤법 자동 교정', description: '카톡에서 오타를 고쳐주는 것도 학습한 결과예요', icon: '✏️' },
      { title: '음악 추천', description: '멜론이나 스포티파이가 취향을 파악하는 방법이에요', icon: '🎵' },
    ],
    studentQuestion: '사람이 공부하는 것과 기계가 학습하는 것은 어떤 점이 다를까요?',
  },
  // 신경망 / 뉴런
  {
    keywords: ['신경망', '뉴런', '퍼셉트론', 'neural', '뉴럴'],
    emoji: '🔗',
    title: '우리 뇌를 따라 만든 기술이에요!',
    realLifeExamples: [
      { title: '얼굴 인식 잠금', description: '스마트폰이 여러분 얼굴을 알아보는 원리예요', icon: '📱' },
      { title: '자율주행 자동차', description: '테슬라가 신호등을 인식하고 길을 찾는 비밀이에요', icon: '🚗' },
      { title: '의료 진단', description: 'X-ray 사진에서 병을 찾아내는 AI 의사예요', icon: '🏥' },
    ],
    studentQuestion: '우리 뇌에는 약 860억 개의 뉴런이 있어요. AI의 인공 뉴런은 몇 개가 필요할까요?',
  },
  // 딥러닝
  {
    keywords: ['딥러닝', 'deep learning', '심층학습', '깊은 학습'],
    emoji: '🏗️',
    title: '층층이 쌓아서 더 똑똑하게!',
    realLifeExamples: [
      { title: 'ChatGPT', description: '대화하듯 글을 쓰는 AI의 핵심 기술이에요', icon: '💬' },
      { title: 'AI 그림 그리기', description: '글만 쓰면 그림을 그려주는 DALL-E도 딥러닝이에요', icon: '🎨' },
      { title: '실시간 번역', description: '파파고나 구글 번역이 점점 자연스러워지는 이유예요', icon: '🌐' },
    ],
    studentQuestion: '"깊은" 학습이라는 이름은 왜 붙었을까요? 무엇이 깊은 걸까요?',
  },
  // CNN / 컴퓨터 비전 / 이미지
  {
    keywords: ['CNN', '합성곱', '컴퓨터 비전', '이미지 인식', '영상', '사진'],
    emoji: '👁️',
    title: '컴퓨터에게 눈을 선물했어요!',
    realLifeExamples: [
      { title: '인스타그램 필터', description: '얼굴을 인식하고 귀여운 필터를 씌워주는 기술이에요', icon: '📸' },
      { title: 'QR 코드 인식', description: '카메라로 QR코드를 읽는 것도 이미지 인식이에요', icon: '📲' },
      { title: '무인 계산대', description: '물건을 인식해서 자동으로 계산하는 마트 시스템이에요', icon: '🛒' },
    ],
    studentQuestion: '여러분은 고양이와 강아지를 어떻게 구분하나요? 컴퓨터는 어떻게 할까요?',
  },
  // RNN / 시퀀스 / 자연어
  {
    keywords: ['RNN', 'LSTM', '시퀀스', '순환', '자연어', 'NLP', '텍스트', '언어 모델'],
    emoji: '📝',
    title: '컴퓨터가 말과 글을 이해해요!',
    realLifeExamples: [
      { title: '자동 완성', description: '검색할 때 글자만 치면 나머지를 예측해주는 기술이에요', icon: '🔍' },
      { title: '챗봇 상담원', description: '쇼핑몰에서 질문하면 대답해주는 AI 상담원이에요', icon: '🤖' },
      { title: '감정 분석', description: '리뷰가 긍정적인지 부정적인지 자동으로 판단해요', icon: '😊' },
    ],
    studentQuestion: '"나는 배가 고프다"와 "나는 배를 탔다"에서 "배"의 의미가 다른데, AI는 어떻게 구분할까요?',
  },
  // 생성형 AI / 생성 모델
  {
    keywords: ['생성형', '생성 AI', 'generative', 'GAN', 'VAE', 'Diffusion', '생성 모델'],
    emoji: '✨',
    title: 'AI가 새로운 것을 만들어요!',
    realLifeExamples: [
      { title: 'AI 작곡', description: '사운드 AI가 새로운 노래를 만들어요', icon: '🎶' },
      { title: '가상 인플루언서', description: '실제로 존재하지 않는 사람의 얼굴을 만들어요', icon: '👤' },
      { title: '게임 세계 생성', description: '매번 다른 맵을 자동으로 만드는 게임도 있어요', icon: '🗺️' },
    ],
    studentQuestion: 'AI가 만든 그림과 사람이 그린 그림을 구분할 수 있을까요? 그래야 할까요?',
  },
  // LLM / Transformer / GPT
  {
    keywords: ['LLM', 'Transformer', 'GPT', 'ChatGPT', '대규모 언어', '트랜스포머', '어텐션'],
    emoji: '🚀',
    title: '대화하는 AI의 비밀!',
    realLifeExamples: [
      { title: '숙제 도우미', description: 'ChatGPT에게 모르는 것을 물어보는 것도 LLM 기술이에요', icon: '📚' },
      { title: '코딩 도우미', description: 'GitHub Copilot이 코드를 자동으로 써주는 것도 같은 원리예요', icon: '💻' },
      { title: '요약 봇', description: '긴 글을 짧게 요약해주는 AI도 이 기술을 써요', icon: '📋' },
    ],
    studentQuestion: 'ChatGPT는 정말 "이해"하고 대답하는 걸까요, 아니면 패턴을 따라하는 걸까요?',
  },
  // 데이터 / 분류 / 지도학습
  {
    keywords: ['데이터', '분류', '지도학습', 'supervised', '레이블', '학습 데이터', '데이터셋'],
    emoji: '📊',
    title: '좋은 데이터가 좋은 AI를 만들어요!',
    realLifeExamples: [
      { title: '넷플릭스 추천', description: '여러분의 시청 데이터로 다음 볼 영화를 추천해요', icon: '🎬' },
      { title: '건강 앱', description: '걸음 수 데이터로 운동량을 분석해줘요', icon: '⌚' },
      { title: '날씨 예보', description: '수십 년의 기상 데이터로 내일 날씨를 예측해요', icon: '🌤️' },
    ],
    studentQuestion: '쓰레기를 잘 분류하는 AI를 만들려면 어떤 데이터가 필요할까요?',
  },
  // 비지도학습 / 클러스터링
  {
    keywords: ['비지도', 'unsupervised', '클러스터링', '군집화', '차원 축소'],
    emoji: '🔍',
    title: '정답 없이도 패턴을 찾아요!',
    realLifeExamples: [
      { title: '고객 그룹 나누기', description: '쇼핑몰이 비슷한 취향의 고객끼리 그룹을 나눠요', icon: '👥' },
      { title: '이상 탐지', description: '신용카드 부정 사용을 자동으로 감지해요', icon: '🔐' },
      { title: '뉴스 분류', description: '비슷한 뉴스끼리 자동으로 묶어주는 포털 사이트예요', icon: '📰' },
    ],
    studentQuestion: '만약 외계인을 분류해야 한다면, 어떤 기준으로 나눌 수 있을까요?',
  },
  // 과적합 / 모델 평가
  {
    keywords: ['과적합', '과소적합', '평가', '검증', '교차검증', '테스트', '정확도'],
    emoji: '⚖️',
    title: 'AI도 시험을 봐야 해요!',
    realLifeExamples: [
      { title: '시험 공부와 똑같아요', description: '문제집만 외우면 새 문제를 못 풀듯, AI도 마찬가지예요', icon: '📝' },
      { title: '자동차 안전 테스트', description: '자율주행 AI도 수천 번 테스트를 거쳐야 도로에 나가요', icon: '🚗' },
      { title: '앱 리뷰 분석', description: 'AI가 가짜 리뷰를 정확히 걸러내는지 계속 확인해요', icon: '⭐' },
    ],
    studentQuestion: '시험 문제를 미리 알고 공부한 학생의 점수를 믿을 수 있을까요? AI도 마찬가지라면?',
  },
  // AI 윤리 / 편향
  {
    keywords: ['윤리', '편향', '공정', '책임', 'bias', '프라이버시', '개인정보'],
    emoji: '⚠️',
    title: 'AI도 실수하고 차별할 수 있어요!',
    realLifeExamples: [
      { title: '채용 AI 편향', description: '아마존의 AI가 여성 지원자를 불리하게 평가한 사건이 있었어요', icon: '🏢' },
      { title: '딥페이크', description: 'AI로 가짜 영상을 만들어 사기에 사용할 수 있어요', icon: '🎭' },
      { title: '개인정보 보호', description: 'AI가 여러분의 사진을 동의 없이 학습할 수도 있어요', icon: '🔒' },
    ],
    studentQuestion: 'AI가 시험 채점을 한다면, 공정할까요? 어떤 문제가 생길 수 있을까요?',
  },
  // 프롬프트 / 프롬프트 엔지니어링
  {
    keywords: ['프롬프트', 'prompt', '명령어', '질문법', '프롬프트 엔지니어링'],
    emoji: '💡',
    title: 'AI에게 질문하는 것도 실력이에요!',
    realLifeExamples: [
      { title: 'ChatGPT 잘 쓰기', description: '같은 질문도 어떻게 하느냐에 따라 답이 완전히 달라져요', icon: '💬' },
      { title: 'AI 그림 주문', description: '"예쁜 풍경"보다 "석양이 지는 바닷가, 수채화 스타일"이 더 좋은 그림을 만들어요', icon: '🎨' },
      { title: '검색 잘하기', description: '구글에서 원하는 결과를 찾는 것도 비슷한 원리예요', icon: '🔍' },
    ],
    studentQuestion: '"맛있는 것 추천해줘"와 "서울 강남에서 1만원 이하 점심 맛집 추천해줘" 중 어떤 질문이 더 좋은 답을 받을까요?',
  },
  // 강화학습
  {
    keywords: ['강화학습', 'reinforcement', '보상', '에이전트', '환경'],
    emoji: '🎯',
    title: '시행착오로 배우는 AI!',
    realLifeExamples: [
      { title: '알파고', description: '바둑을 스스로 수백만 번 두며 세계 챔피언을 이긴 AI예요', icon: '⚫' },
      { title: '로봇 걷기', description: '넘어지면서 걷는 법을 스스로 터득하는 로봇이에요', icon: '🤖' },
      { title: '게임 AI', description: 'AI가 마리오 게임을 스스로 클리어하는 영상 본 적 있나요?', icon: '🎮' },
    ],
    studentQuestion: '여러분이 자전거 타는 법을 배운 과정과 강화학습은 어떤 점이 비슷할까요?',
  },
  // Python / 코딩 / 프로그래밍
  {
    keywords: ['파이썬', 'Python', '코딩', '프로그래밍', '코드', '변수', '함수'],
    emoji: '🐍',
    title: 'AI를 만드는 도구를 배워요!',
    realLifeExamples: [
      { title: '게임 만들기', description: '파이썬으로 간단한 게임을 직접 만들 수 있어요', icon: '🕹️' },
      { title: '데이터 분석', description: '학교 성적 데이터를 그래프로 만들 수 있어요', icon: '📊' },
      { title: '자동화', description: '반복적인 작업을 컴퓨터가 대신하게 만들 수 있어요', icon: '⚙️' },
    ],
    studentQuestion: '여러분이 매일 하는 일 중에 코딩으로 자동화할 수 있는 것은 무엇일까요?',
  },
  // RAG / 벡터DB
  {
    keywords: ['RAG', '벡터', '임베딩', '검색 증강', '지식 기반'],
    emoji: '📚',
    title: 'AI에게 교과서를 읽게 하는 방법!',
    realLifeExamples: [
      { title: 'AI 과외 선생님', description: '교과서를 학습한 AI가 여러분의 질문에 정확히 답해줘요', icon: '👨‍🏫' },
      { title: '고객 상담 봇', description: '회사 매뉴얼을 읽고 정확한 답변을 하는 상담원 AI예요', icon: '🤖' },
      { title: '논문 검색', description: '수만 개의 논문에서 원하는 정보를 찾아주는 AI예요', icon: '🔬' },
    ],
    studentQuestion: '시험 볼 때 오픈북이면 성적이 올라가듯, AI도 자료를 보면 더 정확해질까요?',
  },
]

// Fallback entries for courses without specific topic matches
export const fallbackByCourseSlugs: Record<string, WhyItMattersEntry> = {
  'ai-intro': {
    keywords: [],
    emoji: '🌟',
    title: 'AI는 미래를 바꾸는 기술이에요!',
    realLifeExamples: [
      { title: '스마트폰 속 AI', description: '카메라, 음성인식, 추천 — 스마트폰 곳곳에 AI가 숨어있어요', icon: '📱' },
      { title: '학교에서의 AI', description: 'AI 튜터, 자동 채점, 맞춤 학습 — 교육도 변하고 있어요', icon: '🏫' },
      { title: '미래 직업', description: 'AI를 이해하면 어떤 직업을 가져도 큰 도움이 돼요', icon: '💼' },
    ],
    studentQuestion: '10년 후에는 AI가 어떤 새로운 일을 하고 있을까요?',
  },
  'ml-basics': {
    keywords: [],
    emoji: '📈',
    title: '데이터에서 패턴을 찾는 마법!',
    realLifeExamples: [
      { title: '시험 점수 예측', description: '공부 시간 데이터로 다음 시험 점수를 예측할 수 있어요', icon: '📝' },
      { title: '날씨 예보', description: '과거 데이터를 분석해서 미래 날씨를 예측하는 것과 같아요', icon: '🌤️' },
      { title: '추천 시스템', description: '여러분의 취향을 분석해서 좋아할 것을 추천해줘요', icon: '🎯' },
    ],
    studentQuestion: '여러분의 하루 루틴에서 패턴을 찾을 수 있을까요?',
  },
  'deep-learning': {
    keywords: [],
    emoji: '🏗️',
    title: '더 깊이, 더 정확하게!',
    realLifeExamples: [
      { title: '음성 인식', description: '"시리야"하고 부르면 알아듣는 기술의 핵심이에요', icon: '🎤' },
      { title: '자동 자막', description: '유튜브 자동 자막도 딥러닝으로 만들어져요', icon: '📺' },
      { title: 'AI 진단', description: '피부 사진으로 질병을 감지하는 AI 앱이 있어요', icon: '🔬' },
    ],
    studentQuestion: '왜 "깊을수록" 더 잘할까요? 항상 깊은 게 좋을까요?',
  },
  'generative-ai': {
    keywords: [],
    emoji: '✨',
    title: 'AI가 창작을 해요!',
    realLifeExamples: [
      { title: 'AI 웹툰', description: 'AI가 그린 웹툰이 실제로 연재되고 있어요', icon: '📖' },
      { title: 'AI 음악', description: '기분에 맞는 음악을 AI가 즉석에서 만들어줘요', icon: '🎵' },
      { title: 'AI 패션', description: 'AI가 디자인한 옷이 패션쇼에 나왔어요', icon: '👗' },
    ],
    studentQuestion: 'AI가 만든 작품에도 저작권이 있을까요?',
  },
}

// Default fallback for any course
export const defaultFallback: WhyItMattersEntry = {
  keywords: [],
  emoji: '💡',
  title: '이 개념이 중요한 이유!',
  realLifeExamples: [
    { title: '문제 해결 능력', description: '이 개념을 알면 복잡한 문제를 체계적으로 풀 수 있어요', icon: '🧩' },
    { title: '미래 준비', description: 'AI 시대에 꼭 필요한 기초 지식이에요', icon: '🚀' },
    { title: '창의적 활용', description: '이해하고 나면 자신만의 아이디어를 만들 수 있어요', icon: '💡' },
  ],
  studentQuestion: '이 내용을 배우면 여러분의 생활에서 어떻게 활용할 수 있을까요?',
}

// Helper function to find matching entry
export function findWhyItMatters(courseSlug: string, sectionTitle: string, chapterTitle: string): WhyItMattersEntry {
  const searchText = `${sectionTitle} ${chapterTitle}`.toLowerCase()

  // Try specific topic match first
  const matched = whyItMattersData.find(entry => {
    if (entry.courseSlug && entry.courseSlug !== courseSlug) return false
    return entry.keywords.some(keyword => searchText.includes(keyword.toLowerCase()))
  })
  if (matched) return matched

  // Try course-specific fallback
  if (fallbackByCourseSlugs[courseSlug]) return fallbackByCourseSlugs[courseSlug]

  // Default fallback
  return defaultFallback
}
