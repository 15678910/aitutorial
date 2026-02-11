import {
  NeuronSimulator,
  DecisionBoundary,
  DataLabeler,
  GradientDescent,
  CodePlayground,
} from '../interactive'

interface InteractiveSectionProps {
  sectionId: string
}

type InteractiveWidget = {
  component: React.ComponentType
  title: string
}

const SECTION_WIDGET_MAP: Record<string, InteractiveWidget> = {
  // AI Intro Chapter 2 - Core Concepts
  'ai-intro-ch2-s1': {
    component: NeuronSimulator,
    title: '뉴런 시뮬레이터',
  },
  'ai-intro-ch2-s2': {
    component: DataLabeler,
    title: '데이터 라벨링 체험',
  },
  'ai-intro-ch2-s3': {
    component: GradientDescent,
    title: '경사하강법 시각화',
  },
  // ML Basics - Classification sections
  'ml-basics-ch1-s2': {
    component: DecisionBoundary,
    title: '결정 경계 시각화',
  },
  // Deep Learning - Neural Network sections
  'deep-learning-ch1-s1': {
    component: NeuronSimulator,
    title: '뉴런 시뮬레이터',
  },
  // Building AI (Making AI) - Algorithm sections
  'building-ai-ch1-s3': {
    component: () => (
      <CodePlayground
        title="언덕 오르기 알고리즘"
        description="언덕 오르기 알고리즘으로 최댓값을 찾아보세요. 현재 위치에서 더 높은 곳으로만 이동합니다."
        initialCode={`// 언덕 오르기 함수 구현하기
function hillClimbing(start, step) {
  let current = start;
  let value = f(current);

  // TODO: 좌우로 step만큼 이동하며 더 나은 위치를 찾으세요
  // 더 이상 개선되지 않으면 멈춥니다

  return current;
}

// 테스트 함수 (f(x) = -(x-5)^2 + 10)
function f(x) {
  return -(x - 5) ** 2 + 10;
}

const result = hillClimbing(0, 0.5);
console.log("최댓값 위치: " + result);`}
        expectedOutput="최댓값 위치: 5"
        hint="while 루프를 사용해서 left = current - step, right = current + step을 계산하고, f(left)와 f(right)를 비교해보세요."
      />
    ),
    title: '언덕 오르기 실습',
  },
  'building-ai-ch3-s1': {
    component: () => (
      <CodePlayground
        title="선형 회귀 구현하기"
        description="간단한 선형 회귀를 구현해보세요. y = mx + b 형태의 직선을 데이터에 맞춥니다."
        initialCode={`// 선형 회귀 함수 구현
function linearRegression(x, y) {
  const n = x.length;

  // TODO: x와 y의 평균을 구하세요
  const meanX = 0;
  const meanY = 0;

  // TODO: 기울기 m을 계산하세요
  // m = Σ((x - meanX) * (y - meanY)) / Σ((x - meanX)^2)
  let numerator = 0;
  let denominator = 0;

  for (let i = 0; i < n; i++) {
    // 여기에 코드 작성
  }

  const m = numerator / denominator;
  const b = meanY - m * meanX;

  return { m, b };
}

// 테스트 데이터
const x = [1, 2, 3, 4, 5];
const y = [2, 4, 6, 8, 10];
const result = linearRegression(x, y);
console.log("기울기: " + result.m + ", 절편: " + result.b);`}
        expectedOutput="기울기: 2, 절편: 0"
        hint="meanX = x의 합 / n, meanY = y의 합 / n 입니다. 그다음 for 루프에서 numerator += (x[i] - meanX) * (y[i] - meanY) 를 계산하세요."
      />
    ),
    title: '선형 회귀 실습',
  },
  'building-ai-ch4-s3': {
    component: () => (
      <CodePlayground
        title="뉴런 계산 구현하기"
        description="인공 뉴런의 출력값을 계산해보세요. 가중합을 구한 후 활성화 함수를 적용합니다."
        initialCode={`// 시그모이드 활성화 함수
function sigmoid(x) {
  return 1 / (1 + Math.exp(-x));
}

// 뉴런 출력 계산
function neuronOutput(inputs, weights, bias) {
  // TODO: 가중합을 계산하세요
  // sum = (inputs[0] * weights[0]) + (inputs[1] * weights[1]) + ... + bias
  let sum = 0;

  // TODO: 시그모이드 함수를 적용하세요
  return 0;
}

// 테스트
const inputs = [0.5, 0.8];
const weights = [0.4, 0.6];
const bias = 0.1;
const output = neuronOutput(inputs, weights, bias);
console.log(output.toFixed(4));`}
        expectedOutput="0.7109"
        hint="for 루프로 sum += inputs[i] * weights[i]를 계산하고, sum += bias를 더한 후 sigmoid(sum)을 반환하세요."
      />
    ),
    title: '뉴런 계산 실습',
  },
}

export default function InteractiveSection({ sectionId }: InteractiveSectionProps) {
  const widgetConfig = SECTION_WIDGET_MAP[sectionId]

  if (!widgetConfig) {
    return null
  }

  const WidgetComponent = widgetConfig.component

  return (
    <div className="mt-12 border-t border-gray-200 pt-12">
      <div className="mb-6 flex items-center gap-3">
        <span className="text-2xl">🎮</span>
        <h2 className="text-xl font-bold text-gray-900">직접 체험해보세요</h2>
      </div>
      <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
        <h3 className="mb-4 text-lg font-semibold text-gray-800">{widgetConfig.title}</h3>
        <WidgetComponent />
      </div>
    </div>
  )
}
