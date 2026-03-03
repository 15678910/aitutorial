import type { SectionContext, DiagnosticResult, LearningLevel, LearningStyle } from '../types/learningGuide'

// --- Intent classification ---

type UserIntent = 'explain' | 'example' | 'quiz' | 'why' | 'general'

const intentKeywords: Record<UserIntent, string[]> = {
  explain: ['설명', '알려', '뭐야', '뭔가', '이해', '모르겠', '어렵'],
  example: ['예시', '실생활', '일상', '어디에 쓰', '활용'],
  quiz: ['퀴즈', '문제', '시험', '테스트', '확인'],
  why: ['왜', '이유', '중요', '배워야'],
  general: [],
}

function classifyIntent(message: string): UserIntent {
  const lower = message.toLowerCase()
  for (const intent of ['explain', 'example', 'quiz', 'why'] as UserIntent[]) {
    if (intentKeywords[intent].some(kw => lower.includes(kw))) {
      return intent
    }
  }
  return 'general'
}

// --- Topic matching ---

interface TopicEntry {
  id: string
  keywords: string[]
  answers: Record<UserIntent, Record<LearningLevel, string>>
  followUps: string[]
}

const topicKnowledgeBase: TopicEntry[] = [
  // 1. Claude Code / AI 코딩 도구
  {
    id: 'claude-code',
    keywords: ['claude', '클로드', 'ai 코딩', 'ai 도구', '코딩 도구', 'claude code'],
    answers: {
      explain: {
        beginner: 'Claude Code는 AI가 코딩을 도와주는 똑똑한 친구예요! 우리가 말로 "이런 프로그램 만들어줘"라고 하면, AI가 코드를 대신 써주는 거예요. 마치 로봇 비서가 대신 글을 써주는 것과 비슷해요! 🤖',
        intermediate: 'Claude Code는 터미널에서 동작하는 AI 코딩 도구예요. 코드를 작성하고, 파일을 읽고, 오류를 고치는 것까지 도와줘요. 명령어를 입력하면 AI가 알아서 작업을 처리해준답니다.',
        advanced: 'Claude Code는 Anthropic에서 만든 에이전트형 AI 코딩 도구예요. 터미널에서 자연어로 지시하면 파일 읽기/쓰기, 코드 생성, 디버깅, git 작업 등을 자율적으로 수행해요. MCP 프로토콜도 지원합니다.',
      },
      example: {
        beginner: '예를 들어 "구구단 프로그램 만들어줘"라고 말하면, Claude Code가 알아서 코드를 만들어줘요! 마치 요리 레시피를 말하면 로봇이 요리를 해주는 것처럼요. 🍳',
        intermediate: '실제로 Claude Code에게 "할 일 목록 앱 만들어줘"라고 하면, 파일을 만들고 코드를 작성하고 실행까지 해줘요. 숙제를 도와주는 과외 선생님 같은 거예요!',
        advanced: '실무에서는 "이 프로젝트에 로그인 기능 추가해줘"라고 하면 Claude Code가 기존 코드를 분석하고, 필요한 파일을 수정하고, 테스트까지 실행해요. 여러 파일을 한꺼번에 다룰 수도 있어요.',
      },
      quiz: {
        beginner: '퀴즈! Claude Code에게 일을 시키려면 어떻게 해야 할까요?\n1) 코드를 직접 타이핑한다\n2) 우리말로 하고 싶은 것을 설명한다\n3) 버튼을 누른다\n\n정답은 2번! 우리말로 설명하면 AI가 알아서 코드를 만들어줘요. 👍',
        intermediate: '퀴즈! Claude Code가 할 수 있는 것은?\n1) 코드 작성과 수정\n2) 파일 읽기와 만들기\n3) 오류 찾아서 고치기\n4) 위의 모두\n\n정답은 4번! Claude Code는 이 모든 것을 할 수 있는 만능 도구예요.',
        advanced: '퀴즈! Claude Code가 다른 AI 챗봇과 다른 점은?\n1) 실제 파일 시스템에 접근할 수 있다\n2) 터미널 명령어를 실행할 수 있다\n3) 프로젝트 전체를 이해할 수 있다\n4) 위의 모두\n\n정답은 4번! 에이전트형 도구라서 실제 환경에서 작업이 가능해요.',
      },
      why: {
        beginner: '코딩을 배울 때 AI 도구가 있으면 훨씬 쉽고 재미있어요! 어려운 부분은 AI가 도와주고, 우리는 아이디어를 내는 데 집중할 수 있거든요. 미래에는 AI와 함께 일하는 것이 당연해질 거예요! 🚀',
        intermediate: 'AI 코딩 도구를 잘 활용하면 개발 속도가 훨씬 빨라져요. 반복적인 작업은 AI에게 맡기고, 창의적인 부분에 집중할 수 있어요. 프로그래머의 생산성을 크게 높여주는 도구예요.',
        advanced: 'AI 코딩 도구는 소프트웨어 개발의 패러다임을 바꾸고 있어요. 코드 작성뿐 아니라 설계, 디버깅, 리팩토링까지 AI와 협업하는 시대예요. 이 도구를 잘 다루는 능력이 핵심 경쟁력이 됩니다.',
      },
      general: {
        beginner: 'Claude Code는 AI가 코딩을 도와주는 도구예요! 우리가 하고 싶은 것을 말하면 AI가 코드를 만들어줘요. 어렵지 않으니 걱정하지 마세요! 😊',
        intermediate: 'Claude Code는 터미널에서 자연어로 코딩할 수 있는 AI 도구예요. 궁금한 점이 있으면 편하게 물어보세요!',
        advanced: 'Claude Code는 에이전트형 AI 코딩 도구로, 복잡한 개발 작업도 자율적으로 처리할 수 있어요. 더 자세한 내용이 궁금하면 알려주세요!',
      },
    },
    followUps: ['Claude Code를 시작하는 방법이 궁금해요', '어떤 것을 만들 수 있어요?', '직접 해볼 수 있어요?'],
  },
  // 2. 터미널 / 명령줄
  {
    id: 'terminal',
    keywords: ['터미널', '명령줄', '명령어', 'terminal', 'cmd', '커맨드', '셸', 'shell', '콘솔'],
    answers: {
      explain: {
        beginner: '터미널은 컴퓨터와 글자로 대화하는 창이에요! 보통은 마우스로 클릭하지만, 터미널에서는 글자를 입력해서 컴퓨터에게 명령을 내려요. 마치 컴퓨터에게 편지를 쓰는 것과 같아요! 💻',
        intermediate: '터미널은 텍스트 기반으로 컴퓨터를 조작하는 프로그램이에요. 파일 만들기, 폴더 이동, 프로그램 실행 등을 명령어로 할 수 있어요. 개발자들이 가장 많이 쓰는 도구 중 하나예요.',
        advanced: '터미널(CLI)은 운영체제와 직접 소통하는 인터페이스예요. GUI보다 빠르고 자동화가 쉬워서 개발 작업에 필수적이에요. bash, zsh, PowerShell 등 다양한 셸이 있어요.',
      },
      example: {
        beginner: '터미널은 컴퓨터에게 말하는 특별한 창이에요! 예를 들어 "ls"를 입력하면 폴더 안에 뭐가 있는지 보여주고, "mkdir 내폴더"를 입력하면 새 폴더를 만들어줘요. 🗂️',
        intermediate: '예를 들어 터미널에서 "cd 프로젝트폴더"로 이동하고, "code ."으로 에디터를 열고, "npm start"로 프로그램을 실행할 수 있어요. 마우스 클릭보다 훨씬 빨라요!',
        advanced: '실제 개발에서는 "git commit -m 메시지"로 코드를 저장하고, "npm run build"로 빌드하고, "ssh 서버"로 원격 접속해요. 파이프(|)로 명령을 연결해서 복잡한 작업도 한 줄로 처리할 수 있어요.',
      },
      quiz: {
        beginner: '퀴즈! 터미널은 컴퓨터와 어떻게 대화하는 곳인가요?\n1) 그림을 그려서\n2) 글자를 입력해서\n3) 노래를 불러서\n\n정답은 2번! 터미널에서는 글자(명령어)로 컴퓨터에게 명령을 내려요. ✏️',
        intermediate: '퀴즈! 터미널에서 새 폴더를 만드는 명령어는?\n1) newfolder\n2) create\n3) mkdir\n\n정답은 3번! mkdir은 "make directory"의 줄임말로 새 폴더를 만들어줘요.',
        advanced: '퀴즈! 터미널에서 현재 폴더의 파일 목록을 최근 수정 순으로 보는 명령어는?\n1) ls -lt\n2) dir -new\n3) show files\n\n정답은 1번! ls -lt는 시간(t) 순으로 긴(l) 목록을 보여줘요.',
      },
      why: {
        beginner: '터미널을 배우면 컴퓨터를 더 멋지게 다룰 수 있어요! Claude Code도 터미널에서 사용하거든요. 처음엔 낯설지만, 익숙해지면 마우스보다 더 빠르고 편해요! 🎮',
        intermediate: '모든 개발자가 터미널을 사용해요. 프로그램 실행, 패키지 설치, 버전 관리 등 개발의 거의 모든 작업이 터미널에서 시작돼요. 코딩의 기본 중의 기본이에요!',
        advanced: '터미널은 자동화와 효율성의 핵심이에요. 스크립트를 작성해서 반복 작업을 자동화하고, CI/CD 파이프라인, 서버 관리, 배포까지 모두 CLI 기반이에요.',
      },
      general: {
        beginner: '터미널은 컴퓨터에게 글자로 명령을 내리는 창이에요. 처음엔 신기하고 어려울 수 있지만, 조금만 배우면 금방 익숙해질 거예요! 💪',
        intermediate: '터미널은 개발자의 필수 도구예요. 명령어를 하나씩 배워가면 점점 편해진답니다!',
        advanced: '터미널은 개발 워크플로우의 중심이에요. 궁금한 명령어나 기능이 있으면 물어보세요!',
      },
    },
    followUps: ['자주 쓰는 터미널 명령어 알려줘', '터미널은 어떻게 열어요?', '터미널이 무서워요'],
  },
  // 3. Node.js / npm
  {
    id: 'nodejs',
    keywords: ['node', 'nodejs', 'npm', '노드', '패키지', 'package'],
    answers: {
      explain: {
        beginner: 'Node.js는 자바스크립트라는 프로그래밍 언어를 실행해주는 프로그램이에요! npm은 다른 사람들이 만든 유용한 코드를 쉽게 가져와서 쓸 수 있게 해주는 도구예요. 마치 레고 블록을 가져다 조립하는 것처럼요! 🧱',
        intermediate: 'Node.js는 브라우저 밖에서 자바스크립트를 실행하는 런타임이에요. npm은 Node Package Manager의 줄임말로, 수백만 개의 오픈소스 패키지를 설치하고 관리해줘요.',
        advanced: 'Node.js는 V8 엔진 기반의 서버사이드 자바스크립트 런타임이에요. npm은 세계 최대의 패키지 레지스트리로, package.json으로 의존성을 관리하고, npx로 패키지를 임시 실행할 수도 있어요.',
      },
      example: {
        beginner: '예를 들어, 우리가 웹사이트를 만들고 싶으면 Node.js를 설치하고, npm으로 필요한 도구들을 가져올 수 있어요. "npm install"이라고 치면 마법처럼 필요한 것들이 설치돼요! ✨',
        intermediate: '실제로 "npm create vite@latest"를 입력하면 웹 프로젝트가 자동으로 만들어져요. "npm install axios"를 하면 인터넷 통신에 필요한 도구가 설치되고요.',
        advanced: '프로젝트에서 "npm init -y"로 초기화하고, "npm install express"로 서버 프레임워크를 설치한 뒤, package.json의 scripts에 "start": "node server.js"를 추가해서 실행할 수 있어요.',
      },
      quiz: {
        beginner: '퀴즈! npm은 무엇의 줄임말일까요?\n1) New Program Maker\n2) Node Package Manager\n3) Nice Programming Machine\n\n정답은 2번! npm은 Node Package Manager로, 유용한 코드 묶음(패키지)을 관리해주는 도구예요. 📦',
        intermediate: '퀴즈! Node.js 프로젝트에서 패키지 정보를 담고 있는 파일은?\n1) index.js\n2) package.json\n3) node.config\n\n정답은 2번! package.json은 프로젝트의 이름, 버전, 사용하는 패키지 등을 기록해요.',
        advanced: '퀴즈! npm에서 개발용 패키지만 설치하는 옵션은?\n1) npm install --save\n2) npm install --dev-only\n3) npm install --save-dev\n\n정답은 3번! --save-dev는 개발할 때만 필요한 패키지를 devDependencies에 추가해요.',
      },
      why: {
        beginner: 'Node.js와 npm은 코딩의 기본 도구예요! Claude Code를 사용하려면 Node.js가 꼭 필요해요. 마치 그림을 그리려면 붓과 물감이 필요한 것처럼요! 🎨',
        intermediate: 'Node.js는 현대 웹 개발의 기반이에요. 프론트엔드, 백엔드 모두 자바스크립트로 만들 수 있고, npm으로 수백만 개의 패키지를 활용할 수 있어서 개발 속도가 빨라져요.',
        advanced: 'Node.js 생태계는 현재 가장 큰 오픈소스 생태계예요. 풀스택 개발, 서버리스, CLI 도구 등 다양한 분야에서 사용되며, 취업 시장에서도 핵심 기술이에요.',
      },
      general: {
        beginner: 'Node.js는 프로그램을 실행해주는 도구이고, npm은 유용한 코드를 가져오는 도구예요. 함께 배워볼까요? 😊',
        intermediate: 'Node.js와 npm은 웹 개발의 필수 도구예요. 궁금한 점이 있으면 물어보세요!',
        advanced: 'Node.js 생태계에 대해 더 알고 싶은 것이 있으면 물어보세요!',
      },
    },
    followUps: ['Node.js는 어떻게 설치해요?', 'npm install은 뭐예요?', '패키지가 뭐예요?'],
  },
  // 4. 프로젝트 / 폴더 구조
  {
    id: 'project-structure',
    keywords: ['프로젝트', '폴더', '구조', '디렉토리', 'src', '파일 구조', '정리'],
    answers: {
      explain: {
        beginner: '프로젝트 폴더는 우리가 만드는 프로그램의 집이에요! 방이 여러 개 있는 집처럼, 폴더 안에 여러 파일이 정리되어 있어요. 잘 정리된 방처럼 파일도 잘 정리하면 찾기 쉬워요! 🏠',
        intermediate: '프로젝트 구조는 코드를 종류별로 정리하는 방법이에요. 보통 src 폴더에 소스 코드를, public 폴더에 이미지 등을, package.json에 프로젝트 설정을 저장해요.',
        advanced: '좋은 프로젝트 구조는 유지보수성과 확장성에 직결돼요. 컴포넌트, 유틸리티, 타입, 스토어 등을 분리하고, 관심사의 분리(SoC) 원칙을 따르는 것이 중요해요.',
      },
      example: {
        beginner: '프로젝트 폴더는 학교 사물함 같아요! 교과서는 한 칸, 필통은 다른 칸에 넣듯이, 코드 파일도 종류별로 폴더에 나눠 담아요. "src" 폴더는 코드를 넣는 칸이에요! 🎒',
        intermediate: '예를 들어 웹 프로젝트에서는 src/components에 화면 조각들, src/lib에 도구 함수들, src/data에 데이터 파일들을 넣어요. 각 폴더가 역할을 가지고 있어요.',
        advanced: '실제 프로젝트에서는 src/components, src/hooks, src/store, src/types, src/lib 등으로 나누고, 각 도메인별로 하위 폴더를 만들어요. barrel export(index.ts)로 임포트를 깔끔하게 관리하기도 해요.',
      },
      quiz: {
        beginner: '퀴즈! 프로젝트에서 코드 파일을 보통 어디에 저장할까요?\n1) Desktop 폴더\n2) src 폴더\n3) 휴지통\n\n정답은 2번! src는 "source(소스)"의 줄임말로, 코드를 모아두는 폴더예요. 📁',
        intermediate: '퀴즈! package.json 파일의 역할은?\n1) 프로젝트 설정과 패키지 정보 저장\n2) 사진을 저장하는 파일\n3) 비밀번호를 저장하는 파일\n\n정답은 1번! 프로젝트 이름, 버전, 사용하는 패키지 목록 등을 담고 있어요.',
        advanced: '퀴즈! 다음 중 관심사의 분리 원칙을 잘 따르는 구조는?\n1) 모든 코드를 하나의 파일에 작성\n2) 컴포넌트, 로직, 스타일을 각각 분리\n3) 파일명을 가나다순으로 정렬\n\n정답은 2번! 각 요소를 역할별로 분리하면 유지보수가 쉬워져요.',
      },
      why: {
        beginner: '폴더를 잘 정리하면 필요한 파일을 빨리 찾을 수 있어요! 방이 어지러우면 필요한 물건을 못 찾는 것처럼, 코드도 잘 정리해야 해요. 좋은 습관을 처음부터 들이는 게 중요해요! 🌟',
        intermediate: '프로젝트 구조는 팀 협업의 기본이에요. 모두가 같은 규칙으로 파일을 정리하면 다른 사람의 코드도 쉽게 이해할 수 있어요. 나중에 프로젝트가 커져도 관리가 수월해요.',
        advanced: '클린 아키텍처와 좋은 폴더 구조는 기술 부채를 줄이는 핵심이에요. 초기에 구조를 잘 잡으면 확장과 리팩토링이 쉬워지고, 새로운 팀원의 온보딩도 빨라져요.',
      },
      general: {
        beginner: '프로젝트 폴더는 코드를 종류별로 정리하는 곳이에요. 잘 정리하면 나중에 찾기 쉬워요! 📂',
        intermediate: '프로젝트 구조를 이해하면 코드를 효율적으로 관리할 수 있어요. 궁금한 점이 있으면 물어보세요!',
        advanced: '좋은 프로젝트 구조에 대해 더 알고 싶으면 물어보세요!',
      },
    },
    followUps: ['src 폴더는 뭐예요?', '파일 이름은 어떻게 지어요?', '폴더를 만드는 방법 알려줘'],
  },
  // 5. 인증 / API 키
  {
    id: 'auth-apikey',
    keywords: ['인증', 'api', '키', 'key', '로그인', '비밀번호', '토큰', 'api키', '인증키'],
    answers: {
      explain: {
        beginner: 'API 키는 특별한 비밀 열쇠예요! 어떤 서비스를 사용하려면 이 열쇠가 필요해요. 마치 놀이공원에 들어가려면 입장권이 필요한 것처럼, AI 서비스를 사용하려면 API 키라는 입장권이 있어야 해요. 🔑',
        intermediate: 'API 키는 서비스를 사용할 수 있는 인증 코드예요. Claude Code를 쓰려면 Anthropic API 키가 필요하고, 이 키로 누가 얼마나 사용하는지 추적할 수 있어요. 절대 다른 사람에게 공개하면 안 돼요!',
        advanced: 'API 키는 클라이언트를 식별하는 인증 토큰이에요. OAuth, JWT, API Key 등 다양한 인증 방식이 있고, 환경변수나 .env 파일에 저장해서 소스코드에 노출되지 않게 관리하는 것이 보안의 기본이에요.',
      },
      example: {
        beginner: 'API 키는 비밀 열쇠와 같아요! 집 열쇠를 아무에게나 주면 안 되는 것처럼, API 키도 나만 알고 있어야 해요. Claude Code를 쓸 때 이 열쇠를 넣어주면 AI가 동작해요. 🏠',
        intermediate: '예를 들어 Claude Code를 설치하면 "API 키를 입력하세요"라고 나와요. Anthropic 사이트에서 키를 발급받아 입력하면 돼요. 이 키가 있어야 AI가 동작해요. .env 파일에 저장하면 편리해요.',
        advanced: '실무에서는 .env 파일에 ANTHROPIC_API_KEY=sk-... 형태로 저장하고, .gitignore에 .env를 추가해서 절대 git에 올리지 않아요. CI/CD에서는 환경변수로 주입하고요.',
      },
      quiz: {
        beginner: '퀴즈! API 키를 다른 사람에게 보여줘도 될까요?\n1) 네, 괜찮아요\n2) 아니요, 비밀이에요\n3) 선생님한테만 보여줘도 돼요\n\n정답은 2번! API 키는 비밀 열쇠라서 꼭 나만 알고 있어야 해요. 🤫',
        intermediate: '퀴즈! API 키를 안전하게 보관하는 방법은?\n1) 코드에 직접 적기\n2) 환경변수나 .env 파일에 저장하기\n3) 메모장에 적어두기\n\n정답은 2번! .env 파일에 저장하고 git에 올리지 않는 것이 안전해요.',
        advanced: '퀴즈! API 키가 실수로 git에 올라갔을 때 해야 할 일은?\n1) 그냥 두기\n2) 키를 즉시 재발급하고, git 히스토리에서 제거\n3) 커밋만 삭제하기\n\n정답은 2번! 키를 즉시 무효화하고 새로 발급받은 뒤, git 히스토리까지 정리해야 해요.',
      },
      why: {
        beginner: 'API 키는 AI 서비스를 사용하기 위해 꼭 필요한 입장권이에요! 비밀번호처럼 소중하게 관리해야 해요. 다른 사람이 내 키를 쓰면 내 사용량으로 계산되거든요. 💰',
        intermediate: '인증은 보안의 기본이에요. API 키가 유출되면 다른 사람이 내 계정으로 서비스를 쓸 수 있어서 요금 폭탄을 맞을 수도 있어요. 안전한 관리 방법을 아는 것이 중요해요.',
        advanced: '보안은 개발의 핵심 요소예요. API 키 관리, 환경변수 설정, 시크릿 매니저 활용 등은 현업 개발자의 필수 역량이에요. 하나의 키 유출이 전체 시스템 보안을 위협할 수 있어요.',
      },
      general: {
        beginner: 'API 키는 AI 서비스를 쓰기 위한 비밀 열쇠예요. 꼭 비밀로 잘 간직해야 해요! 🔐',
        intermediate: 'API 키 관리는 보안의 기본이에요. 안전하게 관리하는 방법이 궁금하면 물어보세요!',
        advanced: 'API 인증과 보안에 대해 더 알고 싶으면 물어보세요!',
      },
    },
    followUps: ['API 키는 어디서 받아요?', 'API 키를 잃어버리면 어떻게 해요?', '.env 파일이 뭐예요?'],
  },
  // 6. 프롬프트 / 질문법
  {
    id: 'prompt',
    keywords: ['프롬프트', 'prompt', '질문법', '질문하는 방법', '지시', '요청'],
    answers: {
      explain: {
        beginner: '프롬프트는 AI에게 하는 "부탁"이에요! "숙제 도와줘"보다 "수학 3단원 문제 5번 풀어줘"라고 하면 더 정확한 도움을 받을 수 있어요. AI에게 잘 부탁하는 방법을 프롬프트라고 해요. 💬',
        intermediate: '프롬프트는 AI에게 주는 지시문이에요. 구체적으로 쓸수록 좋은 결과를 얻을 수 있어요. 배경 설명, 원하는 형식, 예시를 포함하면 AI가 의도를 더 잘 파악해요.',
        advanced: '프롬프트 엔지니어링은 AI의 출력을 최적화하는 기법이에요. 역할 지정, 단계별 사고(CoT), 퓨샷 예시, 제약조건 명시 등의 기법을 조합해서 원하는 결과를 이끌어낼 수 있어요.',
      },
      example: {
        beginner: '나쁜 프롬프트: "코드 짜줘"\n좋은 프롬프트: "구구단 2단을 출력하는 파이썬 코드 만들어줘"\n\n구체적으로 말할수록 AI가 내 마음을 잘 알아차려요! 🎯',
        intermediate: '예를 들어 Claude Code에게 "이 파일에 입력값 검사 기능을 추가하고, 잘못된 입력이면 경고 메시지를 보여줘"처럼 구체적으로 말하면, 정확히 원하는 코드를 만들어줘요.',
        advanced: '효과적인 프롬프트 예시: "TypeScript로 이메일 유효성 검사 함수를 작성해줘. 정규식을 사용하고, 에러 메시지를 한국어로 반환하며, 단위 테스트도 함께 작성해줘." 제약조건과 형식을 명시하면 결과가 훨씬 좋아요.',
      },
      quiz: {
        beginner: '퀴즈! AI에게 더 좋은 답을 받으려면 어떻게 해야 할까요?\n1) 짧게 한 단어로 말하기\n2) 구체적으로 자세히 설명하기\n3) 아무렇게나 말하기\n\n정답은 2번! 구체적으로 설명할수록 AI가 더 잘 이해해요. 👏',
        intermediate: '퀴즈! 좋은 프롬프트에 포함하면 좋은 것은?\n1) 배경 설명과 구체적 요구사항\n2) 원하는 출력 형식\n3) 예시\n4) 위의 모두\n\n정답은 4번! 배경, 요구사항, 형식, 예시를 포함하면 최상의 결과를 얻을 수 있어요.',
        advanced: '퀴즈! Chain of Thought(CoT) 프롬프팅이란?\n1) AI에게 단계별로 생각하도록 유도하는 기법\n2) 여러 AI를 연결하는 기법\n3) 대화를 이어가는 기법\n\n정답은 1번! "단계별로 생각해봐"라고 하면 AI가 논리적으로 추론하는 능력이 향상돼요.',
      },
      why: {
        beginner: '같은 AI라도 질문하는 방법에 따라 완전히 다른 답이 나와요! 프롬프트를 잘 쓰면 AI를 100배 더 잘 활용할 수 있어요. AI 시대의 필수 능력이에요! 🌟',
        intermediate: '프롬프트 작성 능력은 AI 활용의 핵심이에요. 같은 도구라도 잘 사용하면 결과가 달라지듯, 좋은 프롬프트는 AI의 성능을 극대화해줘요.',
        advanced: '프롬프트 엔지니어링은 새로운 전문 분야로 자리잡고 있어요. AI 시스템의 동작을 정밀하게 제어하고 최적화하는 능력은 앞으로 더욱 중요해질 거예요.',
      },
      general: {
        beginner: '프롬프트는 AI에게 잘 부탁하는 방법이에요. 구체적으로 말할수록 좋은 답을 받을 수 있어요! 💡',
        intermediate: '프롬프트 작성법에 대해 더 알고 싶으면 물어보세요!',
        advanced: '프롬프트 엔지니어링의 고급 기법이 궁금하면 물어보세요!',
      },
    },
    followUps: ['좋은 프롬프트 예시 보여줘', '프롬프트 잘 쓰는 팁 알려줘', 'Claude Code에서 어떻게 질문해요?'],
  },
  // 7. 파일 읽기/쓰기
  {
    id: 'file-io',
    keywords: ['파일', '읽기', '쓰기', '저장', '만들기', '파일 생성', '파일 수정', '텍스트 파일'],
    answers: {
      explain: {
        beginner: '파일은 컴퓨터에 정보를 저장하는 종이 같은 거예요! 글을 쓰면 저장되고, 나중에 다시 열어서 읽을 수 있어요. 코딩에서도 파일을 만들고, 읽고, 고치는 작업을 자주 해요. 📄',
        intermediate: '파일 입출력(I/O)은 프로그램이 파일을 읽고 쓰는 작업이에요. 텍스트 파일, JSON, CSV 등 다양한 형식을 다룰 수 있어요. Claude Code도 파일을 읽고 수정하는 것이 핵심 기능이에요.',
        advanced: '파일 I/O는 프로그래밍의 기본이에요. 동기/비동기 처리, 스트림, 버퍼, 인코딩 등을 이해하면 대용량 파일도 효율적으로 처리할 수 있어요. Node.js의 fs 모듈이 대표적이에요.',
      },
      example: {
        beginner: 'Claude Code에게 "안녕하세요라고 쓴 파일을 만들어줘"라고 하면, 파일을 만들어줘요! 마치 AI가 대신 일기장에 글을 써주는 것과 같아요. 📝',
        intermediate: '예를 들어 Claude Code에게 "config.json 파일을 읽어서 포트 번호를 3000에서 8080으로 바꿔줘"라고 하면 파일을 읽고, 수정하고, 저장까지 해줘요.',
        advanced: '실무에서는 "src/utils 폴더에 있는 모든 .ts 파일에서 console.log를 제거해줘"처럼 여러 파일을 한꺼번에 처리하도록 지시할 수 있어요. Claude Code가 파일을 탐색하고 일괄 수정해요.',
      },
      quiz: {
        beginner: '퀴즈! 컴퓨터에서 정보를 저장하는 것을 뭐라고 할까요?\n1) 파일\n2) 풍선\n3) 사탕\n\n정답은 1번! 파일은 컴퓨터에 정보를 저장하는 기본 단위예요. 💾',
        intermediate: '퀴즈! JSON 파일은 어떤 용도로 많이 쓸까요?\n1) 음악 재생\n2) 데이터와 설정 저장\n3) 그림 저장\n\n정답은 2번! JSON은 데이터를 구조적으로 저장하는 텍스트 형식이에요.',
        advanced: '퀴즈! 대용량 파일을 읽을 때 효율적인 방법은?\n1) 전체를 한 번에 메모리에 로드\n2) 스트림으로 조금씩 읽기\n3) 파일을 복사한 뒤 읽기\n\n정답은 2번! 스트림 방식은 메모리를 절약하면서 큰 파일을 처리할 수 있어요.',
      },
      why: {
        beginner: '코딩은 파일을 다루는 것이 기본이에요! 코드도 파일에 저장하고, 데이터도 파일에 저장해요. 파일을 다루는 방법을 알면 컴퓨터를 더 잘 활용할 수 있어요. 🗄️',
        intermediate: '모든 프로그램은 파일을 읽고 써요. 설정 파일, 데이터베이스, 로그 파일 등 파일 I/O를 이해하면 다양한 프로그래밍 작업을 할 수 있어요.',
        advanced: '파일 시스템 이해는 시스템 프로그래밍과 DevOps의 기본이에요. 권한 관리, 경로 처리, 원자적 쓰기 등을 이해하면 안정적인 프로그램을 만들 수 있어요.',
      },
      general: {
        beginner: '파일은 컴퓨터에 정보를 저장하는 종이 같은 거예요. Claude Code가 파일을 만들고 읽고 고치는 것을 도와줘요! 😊',
        intermediate: '파일 다루기는 프로그래밍의 기본이에요. 궁금한 점이 있으면 물어보세요!',
        advanced: '파일 I/O에 대해 더 알고 싶으면 물어보세요!',
      },
    },
    followUps: ['파일을 만드는 방법 알려줘', 'JSON 파일이 뭐예요?', 'Claude Code로 파일을 고칠 수 있어요?'],
  },
  // 8. 코딩 일반
  {
    id: 'coding-general',
    keywords: ['코딩', '프로그래밍', '개발', '코드', '프로그램', '소프트웨어', '변수', '함수', '자바스크립트'],
    answers: {
      explain: {
        beginner: '코딩은 컴퓨터에게 일을 시키는 방법이에요! 우리가 말로 친구에게 부탁하듯이, 코딩은 컴퓨터가 알아듣는 말로 명령을 적어주는 거예요. 레고 블록을 조립하듯 코드를 하나씩 조립하면 프로그램이 만들어져요! 🧩',
        intermediate: '코딩은 프로그래밍 언어를 사용해서 컴퓨터에게 지시를 내리는 작업이에요. 변수에 값을 저장하고, 함수로 동작을 정의하고, 조건문으로 판단을 하고, 반복문으로 작업을 반복해요.',
        advanced: '소프트웨어 개발은 설계, 구현, 테스트, 배포의 과정이에요. 디자인 패턴, 자료구조, 알고리즘을 이해하고, 클린 코드 원칙을 따르면 유지보수 가능한 좋은 소프트웨어를 만들 수 있어요.',
      },
      example: {
        beginner: '예를 들어 "1부터 10까지 더해줘"를 코드로 쓰면 컴퓨터가 순식간에 55라고 계산해줘요! 계산기보다 훨씬 빠르고, 더 복잡한 것도 할 수 있어요. 🔢',
        intermediate: '예를 들어 간단한 계산기를 만들 수 있어요. 사용자가 숫자 두 개와 연산자를 입력하면, 프로그램이 결과를 보여주는 거예요. 변수, 조건문, 함수를 모두 사용해요.',
        advanced: '실제로 웹 앱을 만들 때는 React로 UI를 구성하고, API로 백엔드와 통신하며, 상태 관리 라이브러리로 데이터를 관리해요. 이 모든 것이 코딩으로 이루어져요.',
      },
      quiz: {
        beginner: '퀴즈! 코딩은 무엇을 하는 것인가요?\n1) 컴퓨터에게 명령을 내리는 것\n2) 컴퓨터를 고치는 것\n3) 인터넷을 연결하는 것\n\n정답은 1번! 코딩은 컴퓨터가 이해하는 말로 명령을 적어주는 거예요. 👩‍💻',
        intermediate: '퀴즈! 변수란 무엇인가요?\n1) 변하지 않는 숫자\n2) 값을 저장하는 이름 붙은 공간\n3) 함수의 다른 이름\n\n정답은 2번! 변수는 데이터를 담아두는 상자에 이름을 붙인 것과 같아요.',
        advanced: '퀴즈! 함수의 장점이 아닌 것은?\n1) 코드 재사용\n2) 프로그램 속도 향상 (항상)\n3) 코드 가독성 향상\n\n정답은 2번! 함수는 코드를 정리하고 재사용하기 위한 것이지, 항상 속도를 높이는 것은 아니에요.',
      },
      why: {
        beginner: '코딩을 배우면 게임, 앱, 웹사이트 등 원하는 것을 직접 만들 수 있어요! 미래에는 거의 모든 직업에서 코딩 능력이 도움이 될 거예요. 마치 읽기와 쓰기처럼 중요해요! 🚀',
        intermediate: '코딩은 문제 해결 능력과 논리적 사고를 키워줘요. 프로그래밍을 배우면 복잡한 문제를 단계별로 풀어가는 능력이 생겨요. 이 능력은 어떤 분야에서든 큰 자산이에요.',
        advanced: '소프트웨어가 세상을 바꾸고 있어요. AI, 웹, 모바일, IoT 등 모든 기술의 기반이 코딩이에요. 개발 능력은 아이디어를 현실로 만드는 핵심 도구예요.',
      },
      general: {
        beginner: '코딩은 컴퓨터에게 명령을 내리는 방법이에요. 재미있고 신기한 것들을 많이 만들 수 있어요! 😊',
        intermediate: '코딩에 대해 궁금한 것이 있으면 편하게 물어보세요!',
        advanced: '개발에 관한 궁금한 점이 있으면 물어보세요!',
      },
    },
    followUps: ['코딩을 어디서부터 시작해요?', '변수가 뭐예요?', '프로그래밍 언어는 뭐가 있어요?'],
  },
]

// --- Style adaptation ---

function adaptToStyle(answer: string, style: LearningStyle): string {
  switch (style) {
    case 'visual':
      // Visual learners: keep emojis and analogies as-is
      return answer
    case 'textual':
      // Textual learners: remove emojis for cleaner text
      return answer
        .replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, '')
        .replace(/\s{2,}/g, ' ')
        .trim()
    case 'example-based':
      // Example-based learners: keep as-is (examples are already embedded)
      return answer
    default:
      return answer
  }
}

// --- Fallback responses ---

const fallbackByIntent: Record<UserIntent, Record<LearningLevel, string>> = {
  explain: {
    beginner: '좋은 질문이에요! 이 내용은 처음 들으면 조금 어려울 수 있는데, 쉽게 말하면 컴퓨터가 더 똑똑하게 일하도록 도와주는 기술이에요. 위의 학습 내용을 다시 한번 천천히 읽어보면 도움이 될 거예요! 💪',
    intermediate: '이 개념은 코딩과 AI를 이해하는 데 중요한 부분이에요. 학습 자료를 참고해서 기본 원리를 이해하고, 직접 실습해보면 더 잘 이해될 거예요!',
    advanced: '이 주제에 대해 더 깊이 탐구해보면 좋겠어요. 관련 문서나 공식 가이드를 참고하면 실전에서 활용할 수 있는 지식을 얻을 수 있어요.',
  },
  example: {
    beginner: '실생활에서 찾아보면, 우리가 매일 쓰는 앱이나 웹사이트에서 이 기술이 사용되고 있어요! 스마트폰만 봐도 코딩으로 만들어진 것들이 가득해요. 📱',
    intermediate: '이 기술은 웹 개발, 앱 개발, 데이터 분석 등 다양한 분야에서 활용돼요. 직접 작은 프로젝트를 만들어보면 어디에 쓰이는지 더 잘 느낄 수 있어요.',
    advanced: '실무에서는 이 기술이 매우 광범위하게 사용돼요. 오픈소스 프로젝트를 살펴보면 실제 활용 사례를 많이 찾을 수 있어요.',
  },
  quiz: {
    beginner: '자, 간단한 퀴즈를 풀어볼까요? 오늘 배운 내용 중에서 가장 기억에 남는 것을 친구에게 설명해보세요. 설명할 수 있으면 정말 잘 이해한 거예요! 🏆',
    intermediate: '지금까지 배운 내용을 정리해볼게요. 핵심 개념 3가지를 적어보고, 각각을 한 문장으로 설명할 수 있는지 확인해보세요!',
    advanced: '학습한 내용을 실제로 적용해보는 것이 최고의 테스트예요. 작은 프로젝트를 만들어보면서 이해도를 확인해보세요.',
  },
  why: {
    beginner: '이걸 배우면 컴퓨터와 AI를 더 잘 이해할 수 있어요! 미래에는 코딩과 AI를 아는 사람이 많이 필요해지니까, 지금 배우는 것이 큰 도움이 될 거예요. 🌈',
    intermediate: '이 기술은 현대 소프트웨어 개발에서 핵심적인 역할을 해요. 이해하고 나면 다른 개념들도 쉽게 배울 수 있는 기초가 돼요.',
    advanced: '이 기술을 마스터하면 더 복잡한 시스템을 설계하고 구현할 수 있는 기반이 생겨요. 실전 경험을 쌓으면서 깊이를 더해보세요.',
  },
  general: {
    beginner: '궁금한 것이 있으면 뭐든 물어보세요! 쉬운 말로 친절하게 설명해줄게요. 함께 배우면 더 재미있을 거예요! 😊',
    intermediate: '이 주제에 대해 더 알고 싶은 것이 있으면 구체적으로 물어보세요. 더 자세히 설명해줄 수 있어요!',
    advanced: '더 깊이 있는 질문도 환영해요. 구체적인 사례나 코드 예시가 필요하면 알려주세요!',
  },
}

// --- Follow-up question suggestions ---

const defaultFollowUps = [
  '이것을 쉬운 말로 다시 설명해줘',
  '실생활에서 어디에 쓰여요?',
  '퀴즈를 내줘',
]

// --- Main export ---

export function generateLocalGuideAnswer(
  message: string,
  sectionContext: SectionContext,
  diagnosticResult?: DiagnosticResult,
): string {
  const level: LearningLevel = diagnosticResult?.level ?? 'beginner'
  const style: LearningStyle = diagnosticResult?.style ?? 'example-based'
  const intent = classifyIntent(message)

  // Build search text from message + section context fields
  const searchText = `${message} ${sectionContext.sectionTitle} ${sectionContext.chapterTitle} ${sectionContext.sectionContent}`.toLowerCase()

  // Try to match a topic from the knowledge base
  for (const topic of topicKnowledgeBase) {
    const matched = topic.keywords.some(kw => searchText.includes(kw.toLowerCase()))
    if (!matched) continue

    const answer = topic.answers[intent][level]
    const styled = adaptToStyle(answer, style)
    return formatResponse(styled, topic.followUps)
  }

  // Fallback: use intent + level based generic response
  const fallback = fallbackByIntent[intent][level]
  const styled = adaptToStyle(fallback, style)
  return formatResponse(styled, defaultFollowUps)
}

function formatResponse(answer: string, followUps: string[]): string {
  const chips = followUps.map(q => `- ${q}`).join('\n')
  return `${answer}\n\n혹시 더 궁금한 것이 있나요?\n${chips}`
}
