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
            인공지능 기술이 빠르게 발전하는 시대, AI 리터러시는 모든 사람에게 필수적인 역량이 되었습니다.
            우리는 <strong>무료</strong>로, <strong>체계적</strong>으로, <strong>누구나 이해할 수 있는</strong>
            AI 교육을 제공하여 기술 격차를 줄이고자 합니다.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">플랫폼 특징</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { icon: '🎓', title: '완전 무료', desc: '모든 코스와 콘텐츠를 무료로 제공합니다. 숨겨진 비용이 없습니다.' },
            { icon: '📚', title: '체계적 커리큘럼', desc: 'AI 입문부터 딥러닝, 생성형 AI까지 7개 코스의 단계별 학습 경로를 제공합니다.' },
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
            { name: 'Claude Code 마스터하기', desc: 'AI 코딩 도구의 활용법과 프롬프트 작성법을 배웁니다.', level: '입문' },
            { name: 'Claude AI 헌법', desc: 'Constitutional AI와 AI 안전성, 민주적 AI 거버넌스를 학습합니다.', level: '중급' },
          ].map((course, i) => (
            <div key={i} className="flex items-center gap-4 bg-surface border border-gray-200 rounded-xl p-4 hover:shadow-sm transition-shadow">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary font-bold text-sm shrink-0">
                {i + 1}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{course.name}</h3>
                <p className="text-sm text-gray-600">{course.desc}</p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full shrink-0 ${course.level === '입문' ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'}`}>
                {course.level}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Inspiration */}
      <section className="mb-16">
        <div className="bg-gray-50 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">영감</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            이 플랫폼은 핀란드 헬싱키 대학교의{' '}
            <a href="https://www.elementsofai.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">
              Elements of AI
            </a>
            {' '}프로젝트에서 영감을 받아 만들어졌습니다.
            Elements of AI는 AI 교육의 민주화를 선도하며 전 세계 100만 명 이상이 수강한 온라인 코스입니다.
          </p>
          <p className="text-gray-700 leading-relaxed">
            우리는 한국어 사용자를 위해 더 넓은 범위의 AI 주제를 다루며,
            최신 생성형 AI와 실습 중심의 콘텐츠를 추가하여 보다 깊이 있는 학습 경험을 제공합니다.
          </p>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">기술 스택</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: 'React 19', desc: 'UI 프레임워크' },
            { name: 'TypeScript', desc: '타입 안전성' },
            { name: 'Tailwind CSS', desc: '스타일링' },
            { name: 'Supabase', desc: '백엔드 & DB' },
            { name: 'Vite 7', desc: '빌드 도구' },
            { name: 'Zustand', desc: '상태 관리' },
            { name: 'Vercel', desc: '호스팅 & CDN' },
            { name: 'Claude Code', desc: 'AI 개발 도구' },
          ].map((tech, i) => (
            <div key={i} className="text-center p-4 bg-surface border border-gray-200 rounded-xl">
              <p className="font-semibold text-gray-900 text-sm">{tech.name}</p>
              <p className="text-xs text-gray-500 mt-1">{tech.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section>
        <div className="text-center bg-surface border border-gray-200 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">문의 및 피드백</h2>
          <p className="text-gray-600 mb-6">
            플랫폼에 대한 의견이나 제안이 있으시면 언제든지 알려주세요.
          </p>
          <a
            href="https://github.com/15678910/aitutorial/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            GitHub에서 의견 남기기
          </a>
        </div>
      </section>
    </div>
  )
}
