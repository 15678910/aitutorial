export interface GlossaryEntry {
  term: string
  aliases?: string[]
  definition: string
  category: 'computer' | 'coding' | 'web' | 'tool' | 'team' | 'ai'
}

export const glossary: GlossaryEntry[] = [
  // 컴퓨터 기초 (computer)
  {
    term: '컴퓨터',
    aliases: ['Computer'],
    definition: '계산을 빠르게 하고, 게임도 하고, 인터넷도 할 수 있는 전자기기예요. 스마트폰도 작은 컴퓨터랍니다!',
    category: 'computer'
  },
  {
    term: '소프트웨어',
    aliases: ['Software', 'SW'],
    definition: '컴퓨터에서 돌아가는 프로그램이에요. 카카오톡, 유튜브, 게임 앱 모두 소프트웨어예요. 눈에 보이지 않는 부분이에요.',
    category: 'computer'
  },
  {
    term: '하드웨어',
    aliases: ['Hardware', 'HW'],
    definition: '컴퓨터에서 손으로 만질 수 있는 부분이에요. 키보드, 마우스, 모니터, 본체 등이 하드웨어예요.',
    category: 'computer'
  },
  {
    term: '운영체제',
    aliases: ['OS', 'Operating System'],
    definition: '컴퓨터를 켜면 가장 먼저 실행되는 프로그램이에요. 윈도우, 맥OS, 안드로이드, iOS 같은 것들이에요.',
    category: 'computer'
  },
  {
    term: '프로그램',
    aliases: ['Program', '앱', '어플', '응용 프로그램'],
    definition: '컴퓨터에게 특정 일을 시키는 명령어 모음이에요. 카카오톡으로 메시지를 보내는 것도 프로그램 덕분이에요.',
    category: 'computer'
  },
  {
    term: '파일',
    aliases: ['File'],
    definition: '컴퓨터에 저장된 정보 묶음이에요. 사진, 문서, 음악 파일처럼 이름과 확장자(.jpg, .pdf 등)가 있어요.',
    category: 'computer'
  },
  {
    term: '폴더',
    aliases: ['Folder', '디렉토리', 'Directory'],
    definition: '파일들을 정리해서 넣어두는 상자 같은 거예요. 폴더 안에 또 폴더를 만들 수도 있어요.',
    category: 'computer'
  },
  {
    term: '데이터',
    aliases: ['Data'],
    definition: '컴퓨터가 다루는 모든 정보를 말해요. 글자, 숫자, 사진, 영상 모두 데이터예요.',
    category: 'computer'
  },
  {
    term: '데이터베이스',
    aliases: ['Database', 'DB'],
    definition: '데이터를 체계적으로 정리해서 저장하는 곳이에요. 학교 도서관의 도서 목록처럼 잘 정리된 거대한 서랍장이라고 생각하면 돼요.',
    category: 'computer'
  },
  {
    term: '알고리즘',
    aliases: ['Algorithm'],
    definition: '문제를 풀기 위한 단계별 방법이에요. 라면 끓이는 레시피처럼, 순서대로 따라하면 결과가 나와요.',
    category: 'computer'
  },
  {
    term: '인터페이스',
    aliases: ['Interface', 'UI'],
    definition: '사람과 컴퓨터가 소통하는 화면이에요. 버튼을 누르고, 글자를 입력하는 그 화면이 바로 인터페이스예요.',
    category: 'computer'
  },
  {
    term: '클라우드',
    aliases: ['Cloud', '클라우드 컴퓨팅'],
    definition: '인터넷에 있는 거대한 컴퓨터에 파일을 저장하는 거예요. 구글 드라이브나 아이클라우드처럼 어디서든 내 파일을 볼 수 있어요.',
    category: 'computer'
  },

  // 코딩/프로그래밍 (coding)
  {
    term: '코딩',
    aliases: ['Coding', '프로그래밍', 'Programming'],
    definition: '컴퓨터에게 일을 시키기 위해 컴퓨터가 알아듣는 말(코드)로 명령을 쓰는 거예요.',
    category: 'coding'
  },
  {
    term: '코드',
    aliases: ['Code', '소스코드', 'Source Code'],
    definition: '컴퓨터에게 내리는 명령어를 글로 적은 거예요. 마치 외국어처럼 컴퓨터만 알아듣는 특별한 언어예요.',
    category: 'coding'
  },
  {
    term: '변수',
    aliases: ['Variable'],
    definition: "값을 담아두는 상자예요. '내_이름 = 지은' 처럼, 상자에 이름을 붙이고 안에 값을 넣어둘 수 있어요.",
    category: 'coding'
  },
  {
    term: '함수',
    aliases: ['Function'],
    definition: "특정 일을 하는 명령어 묶음이에요. '인사하기()' 라는 함수를 만들면, 부를 때마다 '안녕하세요!'를 출력해줘요.",
    category: 'coding'
  },
  {
    term: '버그',
    aliases: ['Bug'],
    definition: "프로그램에 있는 실수나 오류예요. 원래 뜻은 '벌레'인데, 옛날에 진짜 벌레가 컴퓨터에 들어가서 고장 난 적이 있어서 이렇게 불러요!",
    category: 'coding'
  },
  {
    term: '디버깅',
    aliases: ['Debugging'],
    definition: '프로그램에서 버그(오류)를 찾아서 고치는 작업이에요. 탐정처럼 문제의 원인을 찾아 해결하는 거예요.',
    category: 'coding'
  },
  {
    term: '에러',
    aliases: ['Error', '오류'],
    definition: "프로그램이 예상대로 작동하지 않을 때 나타나는 문제예요. 빨간 글씨로 '뭐가 잘못됐어!'라고 알려줘요.",
    category: 'coding'
  },
  {
    term: '빌드',
    aliases: ['Build'],
    definition: '작성한 코드를 컴퓨터가 실행할 수 있는 형태로 변환하는 거예요. 레고 설명서(코드)를 보고 실제 레고(프로그램)를 조립하는 것과 비슷해요.',
    category: 'coding'
  },
  {
    term: '컴파일',
    aliases: ['Compile', '컴파일러'],
    definition: '사람이 쓴 코드를 컴퓨터가 이해할 수 있는 언어로 번역하는 거예요. 통역사 같은 역할이에요.',
    category: 'coding'
  },
  {
    term: '런타임',
    aliases: ['Runtime'],
    definition: "프로그램이 실제로 실행되고 있는 시간이에요. '런타임 에러'는 프로그램이 돌아가다가 갑자기 생긴 문제예요.",
    category: 'coding'
  },
  {
    term: '테스트',
    aliases: ['Test', '테스팅'],
    definition: '프로그램이 제대로 작동하는지 확인하는 거예요. 시험을 보는 것처럼 프로그램도 검사를 받아요.',
    category: 'coding'
  },
  {
    term: '리팩토링',
    aliases: ['Refactoring'],
    definition: '프로그램의 동작은 그대로 두고 코드를 더 깔끔하게 정리하는 거예요. 방 청소처럼 겉보기는 같은 방이지만 더 깨끗해지는 거예요.',
    category: 'coding'
  },
  {
    term: '라이브러리',
    aliases: ['Library'],
    definition: '다른 사람이 미리 만들어둔 코드 모음이에요. 도서관에서 책을 빌려 쓰는 것처럼, 필요한 기능을 가져다 쓸 수 있어요.',
    category: 'coding'
  },
  {
    term: '프레임워크',
    aliases: ['Framework'],
    definition: '프로그램을 만들 때 사용하는 뼈대예요. 집을 지을 때 철골 구조물처럼, 기본 틀을 제공해주어서 더 빠르게 만들 수 있어요.',
    category: 'coding'
  },
  {
    term: '패키지',
    aliases: ['Package'],
    definition: '여러 코드 파일을 하나로 묶어둔 꾸러미예요. 택배 상자처럼 필요한 것들이 한꺼번에 들어있어요.',
    category: 'coding'
  },
  {
    term: '모듈',
    aliases: ['Module'],
    definition: '큰 프로그램을 작은 조각으로 나눈 것이에요. 레고 블록처럼 각 조각이 특정 역할을 하고, 합치면 전체가 완성돼요.',
    category: 'coding'
  },
  {
    term: '스크립트',
    aliases: ['Script'],
    definition: '컴퓨터에게 내리는 짧은 명령어 목록이에요. 연극 대본(script)처럼 순서대로 실행돼요.',
    category: 'coding'
  },
  {
    term: '컴포넌트',
    aliases: ['Component'],
    definition: '화면을 구성하는 작은 부품이에요. 레고 블록처럼 버튼, 메뉴, 카드 등을 조합해서 웹 페이지를 만들어요.',
    category: 'coding'
  },
  {
    term: '자바스크립트',
    aliases: ['JavaScript', 'JS'],
    definition: '웹 페이지를 움직이게 만드는 프로그래밍 언어예요. 버튼을 누르면 무언가 일어나게 하는 건 대부분 자바스크립트 덕분이에요.',
    category: 'coding'
  },
  {
    term: '타입스크립트',
    aliases: ['TypeScript', 'TS'],
    definition: "자바스크립트에 '규칙 검사' 기능을 추가한 언어예요. 실수를 미리 잡아주어서 더 안전하게 코딩할 수 있어요.",
    category: 'coding'
  },
  {
    term: '파이썬',
    aliases: ['Python'],
    definition: '배우기 쉬운 프로그래밍 언어예요. 영어 문장처럼 읽기 쉽고, AI나 데이터 분석에 많이 쓰여요.',
    category: 'coding'
  },
  {
    term: 'JSON',
    aliases: ['제이슨'],
    definition: "데이터를 주고받을 때 쓰는 형식이에요. { 이름: '지은', 나이: 11 } 처럼 보기 쉽게 정리한 데이터 형식이에요.",
    category: 'coding'
  },

  // 웹/인터넷 (web)
  {
    term: '웹',
    aliases: ['Web', '웹사이트', 'Website'],
    definition: '인터넷에서 볼 수 있는 페이지들이에요. 네이버, 유튜브, 학교 홈페이지 모두 웹이에요.',
    category: 'web'
  },
  {
    term: '웹 앱',
    aliases: ['Web App', '웹 애플리케이션'],
    definition: '웹 브라우저에서 실행되는 프로그램이에요. 별도로 설치할 필요 없이 인터넷으로 바로 사용할 수 있어요.',
    category: 'web'
  },
  {
    term: '브라우저',
    aliases: ['Browser', '웹 브라우저'],
    definition: '인터넷 페이지를 보여주는 프로그램이에요. 크롬, 사파리, 엣지 같은 것들이에요.',
    category: 'web'
  },
  {
    term: '서버',
    aliases: ['Server'],
    definition: '다른 컴퓨터에게 정보를 보내주는 컴퓨터예요. 식당의 주방처럼, 요청을 받으면 필요한 데이터를 만들어서 보내줘요.',
    category: 'web'
  },
  {
    term: '클라이언트',
    aliases: ['Client'],
    definition: '서버에게 정보를 요청하는 쪽이에요. 식당의 손님처럼 주문(요청)을 하고 음식(데이터)을 받아요. 여러분의 브라우저가 클라이언트예요.',
    category: 'web'
  },
  {
    term: 'URL',
    aliases: ['주소', '웹 주소'],
    definition: '인터넷에서 특정 페이지를 찾아가는 주소예요. 집 주소처럼 https://www.naver.com 같은 게 URL이에요.',
    category: 'web'
  },
  {
    term: '도메인',
    aliases: ['Domain', '도메인 이름'],
    definition: "웹사이트의 이름이에요. 'naver.com', 'google.com' 같은 것이 도메인이에요. 숫자 주소 대신 기억하기 쉬운 이름을 쓰는 거예요.",
    category: 'web'
  },
  {
    term: '호스팅',
    aliases: ['Hosting', '웹 호스팅'],
    definition: '웹사이트를 인터넷에 올려서 다른 사람들이 볼 수 있게 하는 거예요. 인터넷 세상에 내 가게를 여는 것과 비슷해요.',
    category: 'web'
  },
  {
    term: '프론트엔드',
    aliases: ['Frontend', 'Front-end'],
    definition: '사용자가 직접 보고 만지는 화면 부분이에요. 웹사이트에서 보이는 버튼, 글자, 이미지 등이 모두 프론트엔드예요.',
    category: 'web'
  },
  {
    term: '백엔드',
    aliases: ['Backend', 'Back-end'],
    definition: '사용자에게 보이지 않는 뒷편 부분이에요. 데이터를 저장하고, 로그인을 확인하고, 계산하는 등의 일을 해요.',
    category: 'web'
  },
  {
    term: '풀스택',
    aliases: ['Full Stack', 'Fullstack'],
    definition: '프론트엔드(화면)와 백엔드(뒷편) 모두 다룰 수 있는 것을 말해요. 음식점에서 요리도 하고 서빙도 하는 것처럼요.',
    category: 'web'
  },
  {
    term: 'API',
    aliases: ['에이피아이'],
    definition: "프로그램끼리 대화하는 방법이에요. 식당의 메뉴판처럼, '이런 것을 요청하면 이런 것을 돌려줄게'라고 약속한 규칙이에요.",
    category: 'web'
  },
  {
    term: '리액트',
    aliases: ['React'],
    definition: '웹 화면을 만드는 데 사용하는 인기 있는 도구(라이브러리)예요. 레고 블록처럼 작은 부품(컴포넌트)을 조립해서 웹 페이지를 만들어요.',
    category: 'web'
  },
  {
    term: 'SPA',
    aliases: ['Single Page Application', '싱글 페이지'],
    definition: '페이지를 새로 불러오지 않고 화면이 바뀌는 웹 앱이에요. 앱처럼 부드럽게 화면이 전환돼요.',
    category: 'web'
  },
  {
    term: '라우팅',
    aliases: ['Routing'],
    definition: "웹사이트에서 주소에 따라 다른 페이지를 보여주는 기능이에요. '/home'이면 홈 화면, '/about'이면 소개 화면을 보여줘요.",
    category: 'web'
  },
  {
    term: '배포',
    aliases: ['Deploy', 'Deployment'],
    definition: '만든 프로그램을 인터넷에 올려서 모든 사람이 사용할 수 있게 하는 거예요. 완성된 작품을 전시회에 내놓는 것과 비슷해요.',
    category: 'web'
  },
  {
    term: 'HTML',
    aliases: ['에이치티엠엘', 'HyperText Markup Language'],
    definition: '웹 페이지의 뼈대를 만드는 언어예요. 제목, 문단, 이미지, 버튼 같은 요소를 <태그>로 감싸서 화면에 배치해요. 집을 지을 때 벽돌로 구조를 쌓는 것과 같아요.',
    category: 'web'
  },
  {
    term: 'CSS',
    aliases: ['씨에스에스', 'Cascading Style Sheets'],
    definition: '웹 페이지를 예쁘게 꾸미는 언어예요. 글자 색깔, 크기, 배경색, 위치 등을 정해줘요. HTML이 뼈대라면 CSS는 옷을 입히는 거예요.',
    category: 'web'
  },
  {
    term: 'TSX',
    aliases: ['tsx'],
    definition: 'TypeScript + JSX를 합친 파일 형식이에요. HTML처럼 화면을 만들면서 TypeScript로 안전하게 코딩할 수 있어요. React 프로젝트에서 많이 사용해요.',
    category: 'web'
  },
  {
    term: 'JSX',
    aliases: ['jsx'],
    definition: 'JavaScript 안에서 HTML처럼 화면을 만들 수 있는 문법이에요. 코드 안에 <div>안녕</div> 처럼 적으면 그대로 화면에 나타나요. React에서 사용하는 특별한 문법이에요.',
    category: 'web'
  },
  {
    term: 'REST',
    aliases: ['REST API', 'RESTful'],
    definition: '웹에서 데이터를 주고받는 규칙이에요. 주소(URL)로 요청하면 데이터를 보내주는 방식인데, GET은 가져오기, POST는 보내기, DELETE는 삭제하기 같은 약속이 있어요.',
    category: 'web'
  },
  {
    term: '엔드포인트',
    aliases: ['Endpoint', 'endpoint'],
    definition: 'API에서 특정 기능을 사용할 수 있는 주소예요. 식당의 각 메뉴판처럼, /users는 사용자 정보, /courses는 강좌 정보를 가져오는 주소예요.',
    category: 'web'
  },
  {
    term: 'Vercel',
    aliases: ['버셀'],
    definition: '웹사이트를 인터넷에 쉽게 올려주는 서비스예요. 코드를 GitHub에 올리면 자동으로 웹사이트가 만들어지고 전 세계 어디서든 볼 수 있게 해줘요.',
    category: 'web'
  },
  {
    term: 'Vite',
    aliases: ['비트'],
    definition: '웹 프로젝트를 빠르게 만들고 실행해주는 도구예요. 코드를 수정하면 바로바로 화면에 반영되어서 개발이 편해요.',
    category: 'web'
  },
  {
    term: 'Tailwind CSS',
    aliases: ['테일윈드'],
    definition: 'CSS를 클래스 이름으로 쉽게 쓸 수 있게 해주는 도구예요. "text-red-500"이라고 적으면 글자가 빨간색이 되는 것처럼, 미리 만들어진 스타일을 조합해서 사용해요.',
    category: 'web'
  },
  {
    term: 'Supabase',
    aliases: ['수파베이스'],
    definition: '데이터베이스, 로그인, 파일 저장 등 서버 기능을 쉽게 쓸 수 있게 해주는 서비스예요. 직접 서버를 만들지 않아도 앱의 뒷편 기능을 바로 사용할 수 있어요.',
    category: 'web'
  },

  // 개발 도구 (tool)
  {
    term: '터미널',
    aliases: ['Terminal', '명령줄', '명령 프롬프트', 'CLI'],
    definition: '컴퓨터에게 글자로 명령을 내리는 까만 화면이에요. 마우스로 클릭하는 대신 키보드로 직접 명령어를 입력해요.',
    category: 'tool'
  },
  {
    term: '에디터',
    aliases: ['Editor', '코드 에디터', 'IDE'],
    definition: '코드를 작성하는 프로그램이에요. 한글이나 워드처럼 글을 쓰는 도구인데, 코딩 전용이에요. VS Code가 대표적이에요.',
    category: 'tool'
  },
  {
    term: 'Git',
    aliases: ['깃', '버전 관리'],
    definition: '코드의 변경 기록을 저장하는 도구예요. 게임의 세이브 파일처럼 이전 상태로 되돌릴 수 있어요.',
    category: 'tool'
  },
  {
    term: 'GitHub',
    aliases: ['깃허브'],
    definition: '코드를 인터넷에 저장하고 다른 사람과 함께 작업할 수 있는 사이트예요. 코드의 구글 드라이브 같은 거예요.',
    category: 'tool'
  },
  {
    term: '커밋',
    aliases: ['Commit'],
    definition: "코드의 변경 내용을 저장하는 거예요. 게임에서 세이브하는 것처럼, '여기까지 했어!'라고 기록하는 거예요.",
    category: 'tool'
  },
  {
    term: '브랜치',
    aliases: ['Branch'],
    definition: '원래 코드를 건드리지 않고 따로 복사해서 작업하는 거예요. 나무의 가지(branch)처럼 갈라져 나온 작업 공간이에요.',
    category: 'tool'
  },
  {
    term: '머지',
    aliases: ['Merge', '병합'],
    definition: '따로 작업한 코드를 원래 코드에 합치는 거예요. 갈라진 나무 가지를 다시 하나로 붙이는 거예요.',
    category: 'tool'
  },
  {
    term: '풀 리퀘스트',
    aliases: ['Pull Request', 'PR'],
    definition: "'내가 수정한 코드를 확인해주세요'라고 요청하는 거예요. 숙제를 제출하고 선생님의 검토를 받는 것과 비슷해요.",
    category: 'tool'
  },
  {
    term: '저장소',
    aliases: ['Repository', 'Repo', '레포지토리'],
    definition: '코드를 보관하는 장소예요. 하나의 프로젝트에 관한 모든 코드와 기록이 들어있어요.',
    category: 'tool'
  },
  {
    term: 'npm',
    aliases: ['Node Package Manager'],
    definition: '자바스크립트용 도구 가게예요. 다른 개발자가 만든 편리한 기능을 쉽게 가져다 쓸 수 있게 해줘요.',
    category: 'tool'
  },
  {
    term: 'Node.js',
    aliases: ['노드'],
    definition: '자바스크립트를 브라우저 밖에서도 실행할 수 있게 해주는 도구예요. 덕분에 서버도 자바스크립트로 만들 수 있어요.',
    category: 'tool'
  },
  {
    term: '오픈소스',
    aliases: ['Open Source'],
    definition: '누구나 무료로 볼 수 있고 사용할 수 있는 코드예요. 레시피를 공개해서 누구나 따라 만들 수 있게 하는 것과 비슷해요.',
    category: 'tool'
  },
  {
    term: '플러그인',
    aliases: ['Plugin', '확장 프로그램', 'Extension'],
    definition: '프로그램에 새로운 기능을 추가하는 부품이에요. 스마트폰에 앱을 설치하는 것처럼 필요한 기능을 추가해요.',
    category: 'tool'
  },
  {
    term: 'SDK',
    aliases: ['개발 키트'],
    definition: '프로그램을 만들 때 필요한 도구 세트예요. 그림 도구 세트처럼 개발에 필요한 것들이 한 묶음으로 들어있어요.',
    category: 'tool'
  },
  {
    term: 'Claude Code',
    aliases: ['클라우드 코드'],
    definition: '터미널에서 AI와 함께 코딩할 수 있는 도구예요. 코드를 직접 읽고, 수정하고, 실행까지 해주는 AI 코딩 도우미예요.',
    category: 'tool'
  },
  {
    term: 'CLAUDE.md',
    definition: "Claude Code에게 프로젝트의 규칙을 알려주는 설명서 파일이에요. '이 프로젝트는 이렇게 해줘'라고 AI에게 알려주는 안내문이에요.",
    category: 'tool'
  },
  {
    term: '프롬프트',
    aliases: ['Prompt'],
    definition: "AI에게 무언가를 요청할 때 쓰는 질문이나 명령어예요. '그림 그려줘', '코드 설명해줘' 같은 것이 프롬프트예요.",
    category: 'tool'
  },
  {
    term: '토큰',
    aliases: ['Token'],
    definition: "AI가 글을 읽을 때 나누는 작은 조각이에요. '안녕하세요'를 '안녕' + '하세요'처럼 작은 단위로 쪼개서 이해해요.",
    category: 'tool'
  },

  // 협업/실무 (team)
  {
    term: '프로젝트',
    aliases: ['Project'],
    definition: "하나의 목표를 위해 진행하는 작업 전체를 말해요. '학교 웹사이트 만들기'처럼 시작부터 완성까지의 모든 일이에요.",
    category: 'team'
  },
  {
    term: '코드베이스',
    aliases: ['Codebase'],
    definition: "프로젝트의 모든 코드를 합쳐서 부르는 말이에요. 한 프로젝트에 있는 모든 파일과 코드를 통틀어 '코드베이스'라고 해요.",
    category: 'team'
  },
  {
    term: '대시보드',
    aliases: ['Dashboard'],
    definition: '중요한 정보를 한눈에 볼 수 있는 화면이에요. 자동차 계기판처럼 필요한 정보(방문자 수, 매출 등)를 모아서 보여줘요.',
    category: 'team'
  },
  {
    term: '코드 리뷰',
    aliases: ['Code Review'],
    definition: "다른 사람이 쓴 코드를 확인하고 조언해주는 거예요. 친구의 글을 읽고 '여기는 이렇게 하면 더 좋겠다'고 알려주는 것과 같아요.",
    category: 'team'
  },
  {
    term: '스타트업',
    aliases: ['Startup'],
    definition: '새로운 아이디어로 시작한 작은 회사예요. 새로운 앱이나 서비스를 만들어서 세상에 내놓으려는 도전적인 회사예요.',
    category: 'team'
  },
  {
    term: '개발자',
    aliases: ['Developer', '프로그래머', 'Programmer'],
    definition: '프로그램을 만드는 사람이에요. 코드를 작성해서 앱, 웹사이트, 게임 등을 만들어요.',
    category: 'team'
  },
  {
    term: '컨텍스트',
    aliases: ['Context', '맥락'],
    definition: "어떤 상황의 앞뒤 사정을 말해요. AI에게 '이 프로젝트는 쇼핑몰이야'라고 알려주면 더 정확한 도움을 줄 수 있어요.",
    category: 'team'
  },
  {
    term: '에이전트',
    aliases: ['Agent'],
    definition: '스스로 판단하고 행동하는 AI 프로그램이에요. 심부름꾼처럼 목표를 주면 알아서 계획을 세우고 실행해요.',
    category: 'team'
  },
  {
    term: '프로덕션',
    aliases: ['Production', '운영 환경'],
    definition: '실제 사용자가 이용하는 환경이에요. 연습(개발)이 끝나고 진짜 무대(인터넷)에 올린 상태를 말해요.',
    category: 'team'
  },
  {
    term: '로그',
    aliases: ['Log'],
    definition: '프로그램이 하는 일을 기록한 일지예요. 언제 무슨 일이 있었는지 적어두어서 문제가 생기면 원인을 찾을 수 있어요.',
    category: 'team'
  },
  {
    term: '자동완성',
    aliases: ['Autocomplete'],
    definition: "글자를 조금만 입력해도 나머지를 자동으로 완성해주는 기능이에요. 검색창에 '날'만 쳐도 '날씨'가 뜨는 것처럼요.",
    category: 'team'
  },
  {
    term: '마크다운',
    aliases: ['Markdown', 'MD'],
    definition: '간단한 기호로 글을 꾸미는 방법이에요. # 은 제목, ** **은 굵게, - 는 목록처럼 쉬운 기호로 문서를 예쁘게 만들 수 있어요.',
    category: 'team'
  },
  {
    term: '오케스트레이션',
    aliases: ['Orchestration'],
    definition: '여러 프로그램이나 AI가 함께 일할 때 조율하는 거예요. 오케스트라 지휘자처럼 각자의 역할을 정해주고 조화롭게 일하게 해요.',
    category: 'team'
  },
  {
    term: 'MCP',
    aliases: ['Model Context Protocol'],
    definition: 'AI가 외부 도구나 데이터를 사용할 수 있게 해주는 연결 규칙이에요. AI에게 인터넷, 파일, 검색 등을 쓸 수 있는 열쇠를 주는 거예요.',
    category: 'team'
  },

  // AI/머신러닝 (ai)
  {
    term: '인공지능',
    aliases: ['AI', 'Artificial Intelligence'],
    definition: '사람처럼 생각하고 배우는 컴퓨터 프로그램이에요. 시리나 알렉사처럼 말을 알아듣거나, 사진에서 고양이를 찾아내는 것도 인공지능이 하는 일이에요.',
    category: 'ai'
  },
  {
    term: '머신러닝',
    aliases: ['Machine Learning', 'ML'],
    definition: '컴퓨터가 직접 경험하면서 배우는 방법이에요. 시험 문제를 많이 풀어보면 실력이 느는 것처럼, 데이터를 많이 보면서 스스로 규칙을 찾아내요.',
    category: 'ai'
  },
  {
    term: '딥러닝',
    aliases: ['Deep Learning'],
    definition: "머신러닝의 한 종류로, 사람 뇌를 흉내 낸 방법이에요. '딥(깊은)'이란 뜻처럼 여러 층을 쌓아서 더 복잡한 것도 배울 수 있어요.",
    category: 'ai'
  },
  {
    term: '신경망',
    aliases: ['Neural Network'],
    definition: '사람 뇌의 신경세포를 따라 만든 AI 구조예요. 뇌세포들이 서로 연결되어 정보를 전달하는 것처럼, 컴퓨터도 비슷하게 연결해서 학습해요.',
    category: 'ai'
  },
  {
    term: '모델',
    aliases: ['Model'],
    definition: 'AI가 학습한 결과물이에요. 열심히 공부한 뒤 머릿속에 남은 지식 같은 거예요. 새로운 문제가 나오면 이 지식으로 답을 맞혀요.',
    category: 'ai'
  },
  {
    term: '학습',
    aliases: ['Training'],
    definition: 'AI에게 데이터를 보여주면서 가르치는 과정이에요. 수학 문제를 반복해서 풀면서 실력이 느는 것처럼, AI도 데이터를 반복해서 보면서 실력이 좋아져요.',
    category: 'ai'
  },
  {
    term: '훈련 데이터',
    aliases: ['Training Data'],
    definition: 'AI를 가르칠 때 사용하는 예시 자료예요. 수학 문제집처럼, AI가 공부하는 데 쓰는 문제와 답 모음이에요.',
    category: 'ai'
  },
  {
    term: '테스트 데이터',
    aliases: ['Test Data'],
    definition: 'AI가 얼마나 잘 배웠는지 확인하는 시험 문제예요. 연습 문제가 아닌 진짜 시험처럼, AI의 실력을 검증하는 데 쓰여요.',
    category: 'ai'
  },
  {
    term: '예측',
    aliases: ['Prediction'],
    definition: 'AI가 배운 것을 바탕으로 답을 추측하는 거예요. 내일 날씨를 예상하는 것처럼, AI도 데이터를 보고 결과를 미리 예상해요.',
    category: 'ai'
  },
  {
    term: '결정 트리',
    aliases: ['Decision Tree'],
    definition: "질문을 하나씩 물어보면서 답을 찾는 방법이에요. '스무고개' 놀이처럼 '이건 동물이야?' '다리가 4개야?' 하고 질문해서 답을 좁혀가요.",
    category: 'ai'
  },
  {
    term: '가지치기',
    aliases: ['Pruning'],
    definition: '결정 트리가 너무 복잡해지지 않게 불필요한 가지를 잘라내는 거예요. 나무를 예쁘게 다듬는 것처럼, AI도 쓸데없는 부분을 정리하면 더 잘 작동해요.',
    category: 'ai'
  },
  {
    term: '분류',
    aliases: ['Classification'],
    definition: '데이터를 종류별로 나누는 거예요. 과일 바구니에서 사과, 배, 귤을 골라 나누는 것처럼, AI도 데이터를 보고 어떤 종류인지 구분해요.',
    category: 'ai'
  },
  {
    term: '회귀',
    aliases: ['Regression'],
    definition: '숫자 값을 예측하는 거예요. 키와 나이로 몸무게를 예상하는 것처럼, 데이터의 패턴을 보고 숫자 결과를 맞혀요.',
    category: 'ai'
  },
  {
    term: '노드',
    aliases: ['Node'],
    definition: '결정 트리에서 질문이나 답이 들어있는 동그라미(점)예요. 스무고개의 각 질문 단계라고 생각하면 돼요.',
    category: 'ai'
  },
  {
    term: '리프 노드',
    aliases: ['Leaf Node'],
    definition: '결정 트리의 맨 끝에 있는 최종 답이에요. 나무의 나뭇잎처럼 더 이상 가지가 뻗지 않는 마지막 지점이에요.',
    category: 'ai'
  },
  {
    term: '과적합',
    aliases: ['Overfitting'],
    definition: 'AI가 연습 문제만 너무 외워서 새로운 문제를 못 푸는 상태예요. 수학 답을 외워서 똑같은 문제만 맞히고 응용 문제는 틀리는 것과 같아요.',
    category: 'ai'
  },
  {
    term: '과소적합',
    aliases: ['Underfitting'],
    definition: 'AI가 공부를 너무 적게 해서 연습 문제도 못 푸는 상태예요. 수업 시간에 졸아서 기본 문제도 틀리는 것과 같아요.',
    category: 'ai'
  },
  {
    term: '정확도',
    aliases: ['Accuracy'],
    definition: 'AI가 전체 문제 중에서 맞힌 비율이에요. 시험에서 100문제 중 90개를 맞히면 정확도 90%인 거예요.',
    category: 'ai'
  },
  {
    term: '교차 검증',
    aliases: ['Cross-Validation'],
    definition: 'AI의 실력을 여러 번 다른 시험으로 확인하는 방법이에요. 한 번 시험으로는 운이 좋았을 수도 있으니, 여러 번 시험 봐서 진짜 실력을 확인해요.',
    category: 'ai'
  },
  {
    term: '지도 학습',
    aliases: ['Supervised Learning'],
    definition: "선생님이 답을 알려주면서 가르치는 방식이에요. '이건 고양이, 이건 강아지' 하고 정답을 알려주면 AI가 그걸 보고 배워요.",
    category: 'ai'
  },
  {
    term: '비지도 학습',
    aliases: ['Unsupervised Learning'],
    definition: '정답 없이 AI가 스스로 규칙을 찾는 방식이에요. 선생님 없이 혼자 퍼즐을 맞추는 것처럼, 비슷한 것끼리 모으면서 패턴을 발견해요.',
    category: 'ai'
  },
  {
    term: '강화 학습',
    aliases: ['Reinforcement Learning'],
    definition: '시행착오로 배우는 방식이에요. 게임에서 이기면 보상을 받고 지면 벌을 받으면서, 점점 더 잘하는 방법을 찾아가요.',
    category: 'ai'
  },
  {
    term: '경사하강법',
    aliases: ['Gradient Descent'],
    definition: 'AI가 정답에 가까워지도록 조금씩 조정하는 방법이에요. 눈을 감고 산에서 내려가는 것처럼, 가장 낮은 곳(정답)을 향해 한 걸음씩 내려가요.',
    category: 'ai'
  },
  {
    term: '뉴런',
    aliases: ['Neuron'],
    definition: '신경망에서 정보를 받아서 처리하는 작은 단위예요. 뇌의 신경세포처럼, 정보를 받으면 계산한 뒤 다음 뉴런에게 전달해요.',
    category: 'ai'
  },
  {
    term: '가중치',
    aliases: ['Weight'],
    definition: 'AI가 각 정보에 부여하는 중요도예요. 시험에서 어떤 과목은 2배로 점수를 매기는 것처럼, 중요한 정보에는 더 높은 가중치를 줘요.',
    category: 'ai'
  },
  {
    term: '활성화 함수',
    aliases: ['Activation Function'],
    definition: "뉴런이 받은 정보를 다음으로 보낼지 결정하는 문지기예요. '이 정보는 중요하니까 통과!' 또는 '이건 별로니까 차단!' 하는 역할이에요.",
    category: 'ai'
  },
  {
    term: '레이어',
    aliases: ['Layer', '층'],
    definition: '신경망에서 뉴런들이 한 줄로 모인 것이에요. 케이크를 층층이 쌓는 것처럼, 레이어가 많을수록 더 복잡한 것을 학습할 수 있어요.',
    category: 'ai'
  },
  {
    term: '비선형',
    aliases: ['Non-linear'],
    definition: '직선이 아닌 구불구불한 관계를 말해요. 키가 크면 몸무게도 정확히 비례하지는 않는 것처럼, 현실의 대부분은 비선형이에요. AI는 이런 복잡한 관계도 배울 수 있어요.',
    category: 'ai'
  },
  {
    term: '하이퍼파라미터',
    aliases: ['Hyperparameter'],
    definition: 'AI를 학습시키기 전에 사람이 미리 정해주는 설정값이에요. 요리할 때 불 세기와 시간을 정하는 것처럼, 학습 속도나 반복 횟수 같은 것을 정해줘요.',
    category: 'ai'
  },
  {
    term: '에포크',
    aliases: ['Epoch'],
    definition: 'AI가 전체 훈련 데이터를 한 바퀴 다 보는 것을 1에포크라고 해요. 문제집을 처음부터 끝까지 한 번 푸는 것과 같아요. 보통 여러 에포크를 반복해요.',
    category: 'ai'
  },
  {
    term: '배치',
    aliases: ['Batch'],
    definition: '데이터를 한꺼번에 다 보지 않고 조금씩 나눠서 학습하는 묶음이에요. 급식에서 한 번에 다 안 주고 한 반씩 나눠서 주는 것과 비슷해요.',
    category: 'ai'
  },
  {
    term: '특성',
    aliases: ['Feature'],
    definition: 'AI가 판단할 때 보는 정보 항목이에요. 과일을 구분할 때 색깔, 크기, 모양을 보는 것처럼, AI도 여러 특성을 보고 판단해요.',
    category: 'ai'
  },
  {
    term: '레이블',
    aliases: ['Label'],
    definition: "데이터에 붙어있는 정답 딱지예요. 사진에 '고양이'라고 적어놓으면, AI는 그 사진이 고양이라는 걸 알고 학습해요.",
    category: 'ai'
  },
  {
    term: '데이터셋',
    aliases: ['Dataset'],
    definition: '학습에 사용하는 데이터 모음이에요. 문제집 한 권처럼, 여러 개의 데이터가 모여서 하나의 데이터셋을 이뤄요.',
    category: 'ai'
  },
  {
    term: '손실 함수',
    aliases: ['Loss Function'],
    definition: 'AI의 예측이 정답과 얼마나 다른지 측정하는 계산법이에요. 시험 채점처럼, 틀린 정도를 숫자로 알려줘서 AI가 더 잘하도록 도와줘요.',
    category: 'ai'
  },
  {
    term: '랜덤 포레스트',
    aliases: ['Random Forest'],
    definition: '결정 트리 여러 개를 합쳐서 더 정확하게 만든 방법이에요. 한 명보다 여러 명이 함께 투표하면 더 좋은 답이 나오는 것처럼, 여러 트리가 함께 결정해요.',
    category: 'ai'
  },
  {
    term: '탐욕적 알고리즘',
    aliases: ['Greedy Algorithm'],
    definition: '매 순간 가장 좋아 보이는 선택을 하는 방법이에요. 뷔페에서 눈앞에 맛있어 보이는 음식부터 담는 것처럼, 지금 당장 최선인 걸 골라요.',
    category: 'ai'
  },
  {
    term: '퍼셉트론',
    aliases: ['Perceptron'],
    definition: '가장 간단한 형태의 인공 신경망이에요. 여러 정보를 받아서 하나의 결과를 내놓는 작은 판단기인데, 사람 뇌의 신경세포 하나를 흉내 낸 거예요.',
    category: 'ai'
  },
  {
    term: '다층 퍼셉트론',
    aliases: ['MLP', 'Multi-Layer Perceptron'],
    definition: '퍼셉트론을 여러 층으로 쌓아 올린 신경망이에요. 한 층만으로는 풀 수 없는 복잡한 문제도, 여러 층이 협력하면 풀 수 있어요.',
    category: 'ai'
  },
  {
    term: 'XOR 게이트',
    aliases: ['XOR Gate', 'XOR'],
    definition: '두 입력이 서로 다를 때만 1을 출력하는 논리 회로예요. "둘 중 하나만 참일 때 참"이라는 규칙인데, 단일 퍼셉트론으로는 풀 수 없는 유명한 문제예요.',
    category: 'ai'
  },
  {
    term: 'AND 게이트',
    aliases: ['AND Gate'],
    definition: '두 입력이 모두 1일 때만 1을 출력하는 논리 회로예요. "둘 다 참이어야 참"이라는 규칙이에요. 두 스위치를 모두 켜야 불이 켜지는 것과 같아요.',
    category: 'ai'
  },
  {
    term: 'OR 게이트',
    aliases: ['OR Gate'],
    definition: '두 입력 중 하나라도 1이면 1을 출력하는 논리 회로예요. "둘 중 하나만 참이어도 참"이라는 규칙이에요.',
    category: 'ai'
  },
  {
    term: '선형',
    aliases: ['Linear'],
    definition: '직선으로 나타낼 수 있는 관계를 말해요. 아이스크림을 1개 사면 1000원, 2개면 2000원처럼 일정한 비율로 변하는 거예요.',
    category: 'ai'
  },
  {
    term: '입력층',
    aliases: ['Input Layer'],
    definition: '신경망에서 맨 처음 데이터를 받아들이는 층이에요. 우리 눈이나 귀처럼, 바깥 정보를 처음 받아들이는 역할을 해요.',
    category: 'ai'
  },
  {
    term: '은닉층',
    aliases: ['Hidden Layer', 'Hidden Layers'],
    definition: '입력층과 출력층 사이에 숨어있는 층이에요. 눈에 보이지 않지만 열심히 계산하면서 패턴을 찾아내는 핵심 부분이에요.',
    category: 'ai'
  },
  {
    term: '출력층',
    aliases: ['Output Layer'],
    definition: '신경망에서 최종 결과를 내놓는 마지막 층이에요. 모든 계산이 끝난 뒤 "정답은 이거야!"라고 알려주는 역할이에요.',
    category: 'ai'
  },
  {
    term: 'AI 겨울',
    aliases: ['AI Winter', 'AI 침체기'],
    definition: 'AI 연구가 잘 안 풀려서 관심과 투자가 줄어든 시기를 말해요. 봄이 오기 전 추운 겨울처럼, AI도 발전이 멈춘 것처럼 보였던 시기가 있었어요.',
    category: 'ai'
  },
  {
    term: '역전파',
    aliases: ['Backpropagation', '백프로파게이션'],
    definition: 'AI가 틀린 답을 고치기 위해 거꾸로 돌아가면서 가중치를 조정하는 방법이에요. 시험에서 틀린 문제를 복습하면서 어디서 실수했는지 찾아가는 것과 같아요.',
    category: 'ai'
  },
  {
    term: '편향',
    aliases: ['Bias'],
    definition: '뉴런에 추가로 더해주는 기본값이에요. 시험에서 기본 점수(가산점)를 주는 것처럼, 결과를 조금씩 조정해서 더 정확하게 만들어줘요.',
    category: 'ai'
  }
]

// Helper function to find a matching glossary entry
export function findGlossaryEntry(text: string): GlossaryEntry | null {
  const normalizedText = text.toLowerCase().trim()

  for (const entry of glossary) {
    if (entry.term.toLowerCase() === normalizedText) {
      return entry
    }
    if (entry.aliases) {
      for (const alias of entry.aliases) {
        if (alias.toLowerCase() === normalizedText) {
          return entry
        }
      }
    }
  }

  return null
}
