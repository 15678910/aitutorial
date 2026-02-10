import {
  NeuronSimulator,
  DecisionBoundary,
  DataLabeler,
  GradientDescent,
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
