export interface GlossaryEntry {
  term: string
  aliases?: string[]  // alternative terms that should also match
  definition: string
  category: 'ai' | 'ml' | 'dev' | 'data' | 'web'
}

export const glossary: GlossaryEntry[] = [
  // AI 기초
  {
    term: 'AI',
    aliases: ['인공지능', 'Artificial Intelligence'],
    definition: '인간의 학습능력, 추론능력, 지각능력을 인공적으로 구현한 컴퓨터 시스템입니다.',
    category: 'ai'
  },
  {
    term: '머신러닝',
    aliases: ['Machine Learning', 'ML'],
    definition: '데이터를 기반으로 패턴을 학습하여 예측이나 결정을 수행하는 인공지능의 한 분야입니다.',
    category: 'ml'
  },
  {
    term: '딥러닝',
    aliases: ['Deep Learning', 'DL'],
    definition: '다층 신경망을 사용하여 데이터의 복잡한 패턴을 학습하는 머신러닝 기법입니다.',
    category: 'ml'
  },
  {
    term: '신경망',
    aliases: ['Neural Network', 'NN', '뉴럴 네트워크'],
    definition: '인간의 뇌 구조를 모방한 알고리즘으로, 입력층-은닉층-출력층으로 구성된 학습 모델입니다.',
    category: 'ml'
  },
  {
    term: '자연어 처리',
    aliases: ['NLP', 'Natural Language Processing'],
    definition: '컴퓨터가 인간의 언어를 이해하고 처리할 수 있도록 하는 인공지능 기술입니다.',
    category: 'ai'
  },
  {
    term: '컴퓨터 비전',
    aliases: ['Computer Vision', 'CV'],
    definition: '컴퓨터가 디지털 이미지나 비디오를 이해하고 분석할 수 있게 하는 인공지능 분야입니다.',
    category: 'ai'
  },
  {
    term: '강한 AI',
    aliases: ['Strong AI', 'AGI', '범용 인공지능'],
    definition: '인간처럼 다양한 분야에서 사고하고 학습할 수 있는 범용 인공지능입니다.',
    category: 'ai'
  },
  {
    term: '약한 AI',
    aliases: ['Weak AI', 'Narrow AI', '특화 인공지능'],
    definition: '특정 작업이나 영역에서만 작동하도록 설계된 인공지능입니다.',
    category: 'ai'
  },
  {
    term: '튜링 테스트',
    aliases: ['Turing Test'],
    definition: '기계가 인간과 구별할 수 없는 수준의 지능적 행동을 보이는지 평가하는 테스트입니다.',
    category: 'ai'
  },
  {
    term: '생성형 AI',
    aliases: ['Generative AI', '생성 AI'],
    definition: '텍스트, 이미지, 음성 등 새로운 콘텐츠를 생성할 수 있는 인공지능 모델입니다.',
    category: 'ai'
  },
  {
    term: 'LLM',
    aliases: ['Large Language Model', '대규모 언어 모델'],
    definition: '방대한 텍스트 데이터로 학습된 대형 언어 처리 모델로, 텍스트 이해와 생성이 가능합니다.',
    category: 'ai'
  },
  {
    term: 'GPT',
    aliases: ['Generative Pre-trained Transformer'],
    definition: 'Transformer 구조를 기반으로 사전 학습된 생성형 언어 모델입니다.',
    category: 'ai'
  },
  {
    term: 'Transformer',
    aliases: ['트랜스포머'],
    definition: 'Attention 메커니즘을 사용하여 시퀀스 데이터를 처리하는 딥러닝 모델 아키텍처입니다.',
    category: 'ml'
  },
  {
    term: '프롬프트',
    aliases: ['Prompt'],
    definition: 'AI 모델에게 원하는 작업을 수행하도록 지시하는 입력 텍스트입니다.',
    category: 'ai'
  },
  {
    term: '프롬프트 엔지니어링',
    aliases: ['Prompt Engineering'],
    definition: 'AI 모델로부터 원하는 결과를 얻기 위해 효과적인 프롬프트를 설계하는 기법입니다.',
    category: 'ai'
  },
  {
    term: '토큰',
    aliases: ['Token'],
    definition: '텍스트를 작은 단위로 나눈 것으로, AI 모델이 처리하는 기본 단위입니다.',
    category: 'ai'
  },
  {
    term: '파인튜닝',
    aliases: ['Fine-tuning', '미세조정'],
    definition: '사전 학습된 모델을 특정 작업에 맞게 추가로 학습시키는 과정입니다.',
    category: 'ml'
  },
  {
    term: '전이학습',
    aliases: ['Transfer Learning'],
    definition: '한 작업에서 학습한 지식을 다른 관련 작업에 적용하는 머신러닝 기법입니다.',
    category: 'ml'
  },
  {
    term: '디퓨전 모델',
    aliases: ['Diffusion Model'],
    definition: '노이즈를 점진적으로 제거하면서 이미지를 생성하는 생성형 AI 모델입니다.',
    category: 'ai'
  },

  // 머신러닝 기법
  {
    term: '지도학습',
    aliases: ['Supervised Learning'],
    definition: '레이블이 있는 데이터로 학습하여 입력과 출력의 관계를 학습하는 방법입니다.',
    category: 'ml'
  },
  {
    term: '비지도학습',
    aliases: ['Unsupervised Learning'],
    definition: '레이블이 없는 데이터에서 패턴이나 구조를 스스로 찾아내는 학습 방법입니다.',
    category: 'ml'
  },
  {
    term: '강화학습',
    aliases: ['Reinforcement Learning', 'RL'],
    definition: '에이전트가 환경과 상호작용하며 보상을 최대화하는 방향으로 학습하는 방법입니다.',
    category: 'ml'
  },
  {
    term: '준지도학습',
    aliases: ['Semi-supervised Learning'],
    definition: '소량의 레이블 데이터와 다량의 레이블 없는 데이터를 함께 사용하는 학습 방법입니다.',
    category: 'ml'
  },
  {
    term: '선형 회귀',
    aliases: ['Linear Regression'],
    definition: '변수 간의 선형 관계를 모델링하여 연속적인 값을 예측하는 알고리즘입니다.',
    category: 'ml'
  },
  {
    term: '로지스틱 회귀',
    aliases: ['Logistic Regression'],
    definition: '입력 데이터를 두 개 이상의 클래스로 분류하는 알고리즘입니다.',
    category: 'ml'
  },
  {
    term: '결정 트리',
    aliases: ['Decision Tree'],
    definition: '데이터를 나무 구조로 분할하여 분류나 회귀를 수행하는 알고리즘입니다.',
    category: 'ml'
  },
  {
    term: '랜덤 포레스트',
    aliases: ['Random Forest'],
    definition: '여러 개의 결정 트리를 조합하여 예측 성능을 높인 앙상블 알고리즘입니다.',
    category: 'ml'
  },
  {
    term: 'SVM',
    aliases: ['Support Vector Machine', '서포트 벡터 머신'],
    definition: '데이터를 최적으로 분리하는 초평면을 찾아 분류하는 알고리즘입니다.',
    category: 'ml'
  },
  {
    term: 'KNN',
    aliases: ['K-Nearest Neighbors', 'K-최근접 이웃'],
    definition: '가장 가까운 K개의 데이터 포인트를 기반으로 분류나 회귀를 수행하는 알고리즘입니다.',
    category: 'ml'
  },
  {
    term: '나이브 베이즈',
    aliases: ['Naive Bayes'],
    definition: '베이즈 정리를 기반으로 한 확률적 분류 알고리즘입니다.',
    category: 'ml'
  },

  // 딥러닝 개념
  {
    term: '경사 하강법',
    aliases: ['Gradient Descent'],
    definition: '손실 함수의 최솟값을 찾기 위해 기울기의 반대 방향으로 가중치를 업데이트하는 최적화 알고리즘입니다.',
    category: 'ml'
  },
  {
    term: '손실 함수',
    aliases: ['Loss Function'],
    definition: '모델의 예측값과 실제값 간의 차이를 측정하는 함수입니다.',
    category: 'ml'
  },
  {
    term: '비용 함수',
    aliases: ['Cost Function'],
    definition: '전체 훈련 데이터에 대한 손실의 평균으로, 모델의 전체적인 성능을 나타냅니다.',
    category: 'ml'
  },
  {
    term: '과적합',
    aliases: ['Overfitting'],
    definition: '모델이 훈련 데이터에만 과도하게 맞춰져 새로운 데이터에 대한 성능이 떨어지는 현상입니다.',
    category: 'ml'
  },
  {
    term: '과소적합',
    aliases: ['Underfitting'],
    definition: '모델이 너무 단순하여 훈련 데이터의 패턴조차 제대로 학습하지 못하는 현상입니다.',
    category: 'ml'
  },
  {
    term: '교차 검증',
    aliases: ['Cross Validation', 'CV'],
    definition: '데이터를 여러 부분으로 나누어 모델의 성능을 평가하는 기법입니다.',
    category: 'ml'
  },
  {
    term: '정밀도',
    aliases: ['Precision'],
    definition: '모델이 양성으로 예측한 것 중 실제로 양성인 비율을 나타내는 평가 지표입니다.',
    category: 'ml'
  },
  {
    term: '재현율',
    aliases: ['Recall', 'Sensitivity'],
    definition: '실제 양성인 것 중 모델이 양성으로 예측한 비율을 나타내는 평가 지표입니다.',
    category: 'ml'
  },
  {
    term: 'F1 Score',
    aliases: ['F1 스코어'],
    definition: '정밀도와 재현율의 조화평균으로, 두 지표의 균형을 나타내는 평가 지표입니다.',
    category: 'ml'
  },
  {
    term: 'ROC',
    aliases: ['Receiver Operating Characteristic', 'ROC 곡선'],
    definition: '분류 모델의 성능을 시각화하는 곡선으로, 참 양성률과 거짓 양성률의 관계를 나타냅니다.',
    category: 'ml'
  },
  {
    term: 'AUC',
    aliases: ['Area Under Curve'],
    definition: 'ROC 곡선 아래의 면적으로, 모델의 전체적인 분류 성능을 나타내는 지표입니다.',
    category: 'ml'
  },
  {
    term: 'CNN',
    aliases: ['Convolutional Neural Network', '합성곱 신경망'],
    definition: '이미지 처리에 특화된 신경망으로, 합성곱 연산을 통해 이미지의 특징을 추출합니다.',
    category: 'ml'
  },
  {
    term: 'RNN',
    aliases: ['Recurrent Neural Network', '순환 신경망'],
    definition: '시퀀스 데이터 처리에 특화된 신경망으로, 이전 정보를 기억하며 학습합니다.',
    category: 'ml'
  },
  {
    term: 'LSTM',
    aliases: ['Long Short-Term Memory'],
    definition: '장기 의존성 문제를 해결한 RNN의 한 종류로, 긴 시퀀스 데이터를 효과적으로 처리합니다.',
    category: 'ml'
  },
  {
    term: '역전파',
    aliases: ['Backpropagation'],
    definition: '신경망의 가중치를 업데이트하기 위해 오차를 역방향으로 전파하는 알고리즘입니다.',
    category: 'ml'
  },
  {
    term: '활성화 함수',
    aliases: ['Activation Function'],
    definition: '신경망의 뉴런이 비선형성을 가지도록 하는 함수로, ReLU, Sigmoid, Tanh 등이 있습니다.',
    category: 'ml'
  },
  {
    term: '드롭아웃',
    aliases: ['Dropout'],
    definition: '과적합을 방지하기 위해 학습 시 일부 뉴런을 무작위로 비활성화하는 기법입니다.',
    category: 'ml'
  },
  {
    term: '배치 정규화',
    aliases: ['Batch Normalization'],
    definition: '각 층의 입력을 정규화하여 학습 속도와 안정성을 향상시키는 기법입니다.',
    category: 'ml'
  },
  {
    term: '하이퍼파라미터',
    aliases: ['Hyperparameter'],
    definition: '모델 학습 전에 사용자가 설정하는 매개변수로, 학습률, 배치 크기 등이 있습니다.',
    category: 'ml'
  },
  {
    term: '에폭',
    aliases: ['Epoch'],
    definition: '전체 훈련 데이터셋을 한 번 완전히 학습한 것을 의미하는 단위입니다.',
    category: 'ml'
  },
  {
    term: '배치 사이즈',
    aliases: ['Batch Size'],
    definition: '한 번의 학습 과정에서 사용되는 훈련 데이터의 개수입니다.',
    category: 'ml'
  },
  {
    term: '학습률',
    aliases: ['Learning Rate'],
    definition: '경사 하강법에서 가중치를 업데이트할 때 적용되는 크기를 결정하는 값입니다.',
    category: 'ml'
  },

  // 개발 용어
  {
    term: 'Conventional Commits',
    aliases: ['컨벤셔널 커밋'],
    definition: '일관성 있는 커밋 메시지 형식을 위한 규칙으로, feat, fix, docs 등의 타입을 사용합니다.',
    category: 'dev'
  },
  {
    term: 'Pull Request',
    aliases: ['PR', '풀 리퀘스트'],
    definition: '코드 변경 사항을 리뷰하고 병합하기 위해 요청하는 Git 워크플로우의 핵심 기능입니다.',
    category: 'dev'
  },
  {
    term: 'Git',
    aliases: ['깃'],
    definition: '분산 버전 관리 시스템으로, 코드의 변경 이력을 추적하고 협업을 지원합니다.',
    category: 'dev'
  },
  {
    term: 'GitHub',
    aliases: ['깃허브'],
    definition: 'Git 저장소를 호스팅하고 협업 기능을 제공하는 웹 기반 플랫폼입니다.',
    category: 'dev'
  },
  {
    term: 'Branch',
    aliases: ['브랜치'],
    definition: '독립적인 작업 흐름을 위해 코드를 분기시킨 것으로, 동시에 여러 작업을 진행할 수 있게 합니다.',
    category: 'dev'
  },
  {
    term: 'Merge',
    aliases: ['머지', '병합'],
    definition: '서로 다른 브랜치의 변경 사항을 하나로 합치는 작업입니다.',
    category: 'dev'
  },
  {
    term: 'Commit',
    aliases: ['커밋'],
    definition: '코드 변경 사항을 저장소에 기록하는 행위로, 스냅샷을 생성합니다.',
    category: 'dev'
  },
  {
    term: 'API',
    aliases: ['Application Programming Interface'],
    definition: '소프트웨어 간 상호작용을 위한 인터페이스로, 데이터와 기능을 제공합니다.',
    category: 'dev'
  },
  {
    term: 'REST API',
    aliases: ['RESTful API'],
    definition: 'HTTP 프로토콜을 사용하여 자원을 관리하는 웹 API 아키텍처 스타일입니다.',
    category: 'web'
  },
  {
    term: 'JSON',
    aliases: ['JavaScript Object Notation'],
    definition: '데이터 교환을 위한 경량 텍스트 형식으로, 키-값 쌍으로 구조화됩니다.',
    category: 'web'
  },
  {
    term: 'TypeScript',
    aliases: ['TS', '타입스크립트'],
    definition: 'JavaScript에 정적 타입을 추가한 프로그래밍 언어로, 더 안전한 코드 작성이 가능합니다.',
    category: 'dev'
  },
  {
    term: 'React',
    aliases: ['리액트'],
    definition: '사용자 인터페이스를 구축하기 위한 JavaScript 라이브러리로, 컴포넌트 기반 개발을 지원합니다.',
    category: 'web'
  },
  {
    term: 'Vite',
    aliases: ['비트'],
    definition: '빠른 개발 서버와 빌드 도구를 제공하는 차세대 프론트엔드 빌드 툴입니다.',
    category: 'web'
  },
  {
    term: 'Supabase',
    aliases: ['수파베이스'],
    definition: 'PostgreSQL 기반의 오픈소스 Firebase 대안으로, 백엔드 서비스를 제공합니다.',
    category: 'web'
  },
  {
    term: 'PostgreSQL',
    aliases: ['Postgres', '포스트그레SQL'],
    definition: '강력한 오픈소스 관계형 데이터베이스 관리 시스템입니다.',
    category: 'data'
  },
  {
    term: 'RLS',
    aliases: ['Row Level Security', '행 수준 보안'],
    definition: '데이터베이스에서 각 행에 대한 접근 권한을 세밀하게 제어하는 보안 기능입니다.',
    category: 'data'
  },
  {
    term: 'OAuth',
    aliases: ['오어스'],
    definition: '안전한 인증 및 권한 부여를 위한 개방형 표준 프로토콜입니다.',
    category: 'web'
  },
  {
    term: '컴포넌트',
    aliases: ['Component'],
    definition: 'UI를 구성하는 독립적이고 재사용 가능한 코드 조각입니다.',
    category: 'web'
  },
  {
    term: '라우팅',
    aliases: ['Routing'],
    definition: 'URL 경로에 따라 적절한 페이지나 컴포넌트를 표시하는 메커니즘입니다.',
    category: 'web'
  },
  {
    term: 'SPA',
    aliases: ['Single Page Application', '싱글 페이지 애플리케이션'],
    definition: '페이지 전환 없이 동적으로 콘텐츠를 업데이트하는 웹 애플리케이션입니다.',
    category: 'web'
  },
  {
    term: 'SSR',
    aliases: ['Server-Side Rendering', '서버 사이드 렌더링'],
    definition: '서버에서 HTML을 생성하여 클라이언트에 전달하는 렌더링 방식입니다.',
    category: 'web'
  },
  {
    term: '번들링',
    aliases: ['Bundling'],
    definition: '여러 파일을 하나로 묶어 최적화하는 과정으로, 로딩 성능을 향상시킵니다.',
    category: 'web'
  },
  {
    term: '코드 스플리팅',
    aliases: ['Code Splitting'],
    definition: '번들을 작은 청크로 나누어 필요할 때만 로드하는 최적화 기법입니다.',
    category: 'web'
  },
  {
    term: 'CI/CD',
    aliases: ['Continuous Integration/Continuous Deployment', '지속적 통합/배포'],
    definition: '코드 변경을 자동으로 테스트하고 배포하는 개발 프랙티스입니다.',
    category: 'dev'
  },
  {
    term: '배포',
    aliases: ['Deploy', 'Deployment'],
    definition: '애플리케이션을 프로덕션 환경에 올려 사용자가 접근할 수 있게 하는 과정입니다.',
    category: 'dev'
  },
  {
    term: '프로덕션',
    aliases: ['Production', '운영 환경'],
    definition: '실제 사용자가 사용하는 실서비스 환경입니다.',
    category: 'dev'
  },
  {
    term: '스테이징',
    aliases: ['Staging', '스테이징 환경'],
    definition: '프로덕션과 동일한 환경에서 배포 전 테스트를 수행하는 환경입니다.',
    category: 'dev'
  },

  // 데이터 관련
  {
    term: '데이터셋',
    aliases: ['Dataset'],
    definition: '머신러닝 학습에 사용되는 데이터의 집합으로, 훈련/검증/테스트 세트로 나뉩니다.',
    category: 'data'
  },
  {
    term: '피처',
    aliases: ['Feature', '특성'],
    definition: '머신러닝 모델의 입력으로 사용되는 개별 측정 가능한 속성입니다.',
    category: 'data'
  },
  {
    term: '레이블',
    aliases: ['Label'],
    definition: '지도학습에서 예측하고자 하는 목표 값으로, 정답 데이터를 의미합니다.',
    category: 'data'
  },
  {
    term: '정규화',
    aliases: ['Normalization'],
    definition: '데이터의 범위를 일정한 스케일로 변환하여 모델 학습을 안정화하는 기법입니다.',
    category: 'data'
  },
  {
    term: '스케일링',
    aliases: ['Scaling'],
    definition: '데이터의 크기나 범위를 조정하여 특정 범위 내로 맞추는 전처리 과정입니다.',
    category: 'data'
  },
  {
    term: '편향',
    aliases: ['Bias'],
    definition: '모델의 예측이 실제 값과 체계적으로 차이나는 정도로, 단순화로 인한 오차입니다.',
    category: 'ml'
  },
  {
    term: '분산',
    aliases: ['Variance'],
    definition: '서로 다른 훈련 데이터에 대해 모델의 예측이 변동하는 정도입니다.',
    category: 'ml'
  },
  {
    term: '앙상블',
    aliases: ['Ensemble'],
    definition: '여러 모델을 결합하여 더 나은 예측 성능을 얻는 머신러닝 기법입니다.',
    category: 'ml'
  },
  {
    term: '부트스트랩',
    aliases: ['Bootstrap'],
    definition: '데이터를 무작위로 복원 추출하여 여러 샘플을 생성하는 통계적 기법입니다.',
    category: 'data'
  }
]

// Helper function to find a matching glossary entry
export function findGlossaryEntry(text: string): GlossaryEntry | null {
  const normalizedText = text.toLowerCase().trim()

  for (const entry of glossary) {
    // Check if the text matches the main term
    if (entry.term.toLowerCase() === normalizedText) {
      return entry
    }

    // Check if the text matches any of the aliases
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
