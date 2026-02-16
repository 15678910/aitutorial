export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Hero */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">AI 학습 플랫폼 소개</h1>
        <p className="text-xl text-gray-600 leading-relaxed">
          누구나 무료로 인공지능을 배울 수 있는 온라인 학습 플랫폼입니다.
        </p>
      </div>

      {/* Mission */}
      <section className="mb-16">
        <div className="bg-gradient-to-r from-primary to-accent rounded-2xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">우리의 미션</h2>
          <p className="text-lg leading-relaxed opacity-90">
            AI의 기초부터 최신 생성형 AI까지, <strong>무료</strong>로 제공되는 체계적인 온라인 학습 과정을 통해
            인공지능의 세계를 탐험하고, <strong>인간의 집단지성과 AI의 협업</strong>으로 인류 문명에 이바지하는 것입니다.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">플랫폼 특징</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { icon: '🎓', title: '완전 무료', desc: '모든 코스와 콘텐츠를 무료로 제공합니다. 숨겨진 비용이 없습니다.' },
            { icon: '📚', title: '체계적 커리큘럼', desc: 'AI 입문부터 딥러닝, 생성형 AI까지 10개 코스의 단계별 학습 경로를 제공합니다.' },
            { icon: '✍️', title: '퀴즈 & 에세이 평가', desc: '각 섹션마다 퀴즈로 이해도를 점검하고, 에세이와 피어리뷰로 심화 학습합니다.' },
            { icon: '🏆', title: '수료증 발급', desc: '코스 완료 시 성적이 포함된 수료증을 발급받을 수 있습니다.' },
            { icon: '💬', title: '토론 시스템', desc: '각 학습 섹션에서 다른 학습자들과 토론하며 함께 성장합니다.' },
            { icon: '📖', title: '용어 사전', desc: '전문 용어를 클릭하면 쉬운 해설이 표시되어 학습 효율을 높입니다.' },
          ].map((feature, i) => (
            <div key={i} className="bg-surface border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
              <span className="text-3xl mb-3 block">{feature.icon}</span>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Courses Overview */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">학습 코스</h2>
        <div className="space-y-4">
          {[
            { name: 'AI 입문', desc: 'AI의 기본 개념, 역사, 활용 분야를 학습합니다.', level: '입문' },
            { name: '머신러닝 기초', desc: '지도학습, 비지도학습, 강화학습의 핵심 원리를 이해합니다.', level: '입문' },
            { name: '딥러닝과 신경망', desc: '인공신경망, CNN, RNN 등 딥러닝의 구조와 원리를 배웁니다.', level: '중급' },
            { name: '생성형 AI와 LLM', desc: 'GPT, 프롬프트 엔지니어링, AI 윤리를 다룹니다.', level: '중급' },
            { name: 'AI 만들기', desc: '파이썬으로 실제 AI 모델을 구현하는 실습 과정입니다.', level: '중급' },
            { name: 'Claude Code 입문', desc: 'AI 코딩 도구의 설치, 기본 사용법, 프롬프트 작성법을 배웁니다.', level: '입문' },
            { name: 'Claude Code 실전 활용', desc: '팀 협업, 풀스택 개발, CI/CD 자동화, 대규모 프로젝트 관리를 마스터합니다.', level: '중급' },
            { name: 'Claude Code 고급 마스터', desc: '멀티 에이전트, 커스텀 MCP 서버, 레거시 현대화, 프로덕션 자동화를 다룹니다.', level: '고급' },
            { name: 'Claude AI 헌법', desc: 'Constitutional AI와 AI 안전성, 민주적 AI 거버넌스를 학습합니다.', level: '중급' },
            { name: 'Claude Cowork 활용', desc: 'AI 데스크톱 에이전트로 파일 관리, 문서 작업, MCP 연동, 업무 자동화를 배웁니다.', level: '입문' },
          ].map((course, i) => (
            <div key={i} className="flex items-center gap-4 bg-surface border border-gray-200 rounded-xl p-4 hover:shadow-sm transition-shadow">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary font-bold text-sm shrink-0">
                {i + 1}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{course.name}</h3>
                <p className="text-sm text-gray-600">{course.desc}</p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full shrink-0 ${course.level === '입문' ? 'bg-green-50 text-green-700' : course.level === '고급' ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-700'}`}>
                {course.level}
              </span>
            </div>
          ))}
        </div>
      </section>

    </div>
  )
}
