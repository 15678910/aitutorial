import { useState } from 'react'
import { findMiniLab, type SliderConfig, type ToggleConfig, type DragSortConfig, type ComparisonConfig, type PollConfig } from '../../data/miniLabs'

interface MiniLabProps {
  courseSlug: string
  sectionTitle: string
  chapterTitle: string
}

export default function MiniLab({ courseSlug, sectionTitle, chapterTitle }: MiniLabProps) {
  const lab = findMiniLab(courseSlug, sectionTitle, chapterTitle)

  if (!lab) {
    return null
  }

  return (
    <div className="my-8 rounded-xl border-2 border-transparent bg-gradient-to-r from-purple-500/10 to-indigo-500/10 p-6">
      <div className="mb-4">
        <h3 className="text-xl font-bold text-purple-700 dark:text-purple-300 flex items-center gap-2">
          <span>🔬</span>
          <span>직접 실험해 보세요!</span>
        </h3>
        <p className="mt-2 text-lg font-semibold text-gray-800 dark:text-gray-200">{lab.title}</p>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{lab.description}</p>
      </div>

      <div className="my-6">
        {lab.type === 'slider' && <SliderWidget config={lab.config as SliderConfig} feedbackMessage={lab.feedbackMessage} />}
        {lab.type === 'toggle' && <ToggleWidget config={lab.config as ToggleConfig} feedbackMessage={lab.feedbackMessage} />}
        {lab.type === 'drag-sort' && <DragSortWidget config={lab.config as DragSortConfig} feedbackMessage={lab.feedbackMessage} />}
        {lab.type === 'comparison' && <ComparisonWidget config={lab.config as ComparisonConfig} feedbackMessage={lab.feedbackMessage} />}
        {lab.type === 'poll' && <PollWidget config={lab.config as PollConfig} feedbackMessage={lab.feedbackMessage} labId={`${courseSlug}-${sectionTitle}-${chapterTitle}`} />}
      </div>
    </div>
  )
}

function SliderWidget({ config, feedbackMessage }: { config: SliderConfig; feedbackMessage: string }) {
  const [values, setValues] = useState<number[]>(config.sliders.map(s => s.defaultValue))
  const [showFeedback, setShowFeedback] = useState(false)

  const handleSliderChange = (index: number, value: number) => {
    const newValues = [...values]
    newValues[index] = value
    setValues(newValues)
    setShowFeedback(true)
  }

  const getResultText = () => {
    if (config.sliders.length === 1) {
      // Temperature slider case
      const value = values[0]
      const min = config.sliders[0].min
      const max = config.sliders[0].max
      const range = max - min
      const normalized = (value - min) / range

      if (normalized < 0.33) {
        return "📏 매우 정확하고 예측 가능한 답변"
      } else if (normalized < 0.67) {
        return "⚖️ 균형잡힌 답변"
      } else {
        return "🌈 매우 창의적이고 독특한 답변"
      }
    } else {
      // Multiple sliders - find highest value
      const maxValue = Math.max(...values)
      const maxIndex = values.indexOf(maxValue)

      switch (maxIndex) {
        case 0:
          return "📝 텍스트 기반 AI (챗봇, 번역기)"
        case 1:
          return "👁️ 시각 AI (자율주행, 의료 진단)"
        case 2:
          return "🎨 창작 AI (그림, 음악, 글)"
        default:
          return "⚖️ 균형잡힌 AI 시스템"
      }
    }
  }

  return (
    <div className="space-y-6">
      {config.sliders.map((slider, index) => (
        <div key={index} className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {slider.label}
          </label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min={slider.min}
              max={slider.max}
              step={slider.step}
              value={values[index]}
              onChange={(e) => handleSliderChange(index, Number(e.target.value))}
              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
            <span className="min-w-[80px] text-right text-sm font-semibold text-purple-600 dark:text-purple-400">
              {values[index]}{slider.unit}
            </span>
          </div>
        </div>
      ))}

      {config.resultLabel && (
        <div className="mt-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {config.resultLabel}
          </p>
          <p className="text-lg font-semibold text-purple-700 dark:text-purple-300">
            {getResultText()}
          </p>
          {config.formula && (
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 font-mono">
              {config.formula}
            </p>
          )}
        </div>
      )}

      {showFeedback && feedbackMessage && (
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-800 dark:text-blue-200">{feedbackMessage}</p>
        </div>
      )}
    </div>
  )
}

function ToggleWidget({ config, feedbackMessage }: { config: ToggleConfig; feedbackMessage: string }) {
  const [toggleStates, setToggleStates] = useState<boolean[]>(config.toggles.map(() => false))
  const [showFeedback, setShowFeedback] = useState(false)

  const handleToggleChange = (index: number) => {
    const newStates = [...toggleStates]
    newStates[index] = !newStates[index]
    setToggleStates(newStates)
    setShowFeedback(true)
  }

  const getMatchingScenario = () => {
    const scenario = config.scenarios?.find(s =>
      s.combination.every((state: boolean, i: number) => state === toggleStates[i])
    )
    return scenario?.result || "다양한 조합을 시도해보세요!"
  }

  return (
    <div className="space-y-6">
      {config.toggles.map((toggle, index) => (
        <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {toggle.label}
          </label>
          <button
            onClick={() => handleToggleChange(index)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              toggleStates[index] ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                toggleStates[index] ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
          <span className="text-sm text-gray-600 dark:text-gray-400 ml-3 min-w-[60px]">
            {toggleStates[index] ? toggle.onLabel : toggle.offLabel}
          </span>
        </div>
      ))}

      <div className="mt-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">결과</p>
        <p className="text-lg font-semibold text-purple-700 dark:text-purple-300">
          {getMatchingScenario()}
        </p>
      </div>

      {showFeedback && feedbackMessage && (
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-800 dark:text-blue-200">{feedbackMessage}</p>
        </div>
      )}
    </div>
  )
}

function DragSortWidget({ config, feedbackMessage }: { config: DragSortConfig; feedbackMessage: string }) {
  const [items, setItems] = useState(config.items.map(item => item.id))
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [checked, setChecked] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)

  const handleItemClick = (index: number) => {
    if (selectedIndex === null) {
      setSelectedIndex(index)
    } else {
      // Swap items
      const newItems = [...items]
      const temp = newItems[selectedIndex]
      newItems[selectedIndex] = newItems[index]
      newItems[index] = temp
      setItems(newItems)
      setSelectedIndex(null)
      setChecked(false)
    }
  }

  const handleCheck = () => {
    setChecked(true)
    setShowFeedback(true)
  }

  const isCorrect = checked && items.every((item, i) => item === config.correctOrder[i])

  return (
    <div className="space-y-6">
      {config.question && (
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{config.question}</p>
      )}

      <div className="space-y-2">
        {items.map((itemId, index) => {
          const itemData = config.items.find(i => i.id === itemId)
          return (
            <button
              key={index}
              onClick={() => handleItemClick(index)}
              className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                selectedIndex === index
                  ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-purple-300'
              }`}
            >
              <span className="font-medium text-gray-800 dark:text-gray-200">
                {index + 1}. {itemData?.emoji} {itemData?.label}
              </span>
            </button>
          )
        })}
      </div>

      <button
        onClick={handleCheck}
        className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
      >
        정답 확인
      </button>

      {checked && (
        <div className={`p-4 rounded-lg ${
          isCorrect
            ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
            : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
        }`}>
          <p className="font-semibold mb-2">
            {isCorrect ? '✅ 정답입니다!' : '❌ 다시 시도해보세요!'}
          </p>
          {!isCorrect && (
            <div className="text-sm text-gray-700 dark:text-gray-300">
              <p className="font-medium mb-1">정답 순서:</p>
              <ol className="list-decimal list-inside space-y-1">
                {config.correctOrder.map((itemId, i) => {
                  const itemData = config.items.find(item => item.id === itemId)
                  return (
                    <li key={i}>{itemData?.emoji} {itemData?.label}</li>
                  )
                })}
              </ol>
            </div>
          )}
        </div>
      )}

      {showFeedback && feedbackMessage && (
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-800 dark:text-blue-200">{feedbackMessage}</p>
        </div>
      )}
    </div>
  )
}

function ComparisonWidget({ config, feedbackMessage }: { config: ComparisonConfig; feedbackMessage: string }) {
  return (
    <div>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg">
          <h4 className="text-lg font-bold text-blue-700 dark:text-blue-300 mb-4 flex items-center gap-2">
            <span>{config.leftEmoji}</span>
            <span>{config.leftTitle}</span>
          </h4>
          <ul className="space-y-2">
            {config.leftItems.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                <span className="text-blue-500 dark:text-blue-400 mt-0.5">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg">
          <h4 className="text-lg font-bold text-purple-700 dark:text-purple-300 mb-4 flex items-center gap-2">
            <span>{config.rightEmoji}</span>
            <span>{config.rightTitle}</span>
          </h4>
          <ul className="space-y-2">
            {config.rightItems.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                <span className="text-purple-500 dark:text-purple-400 mt-0.5">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {feedbackMessage && (
        <div className="mt-6 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-800 dark:text-blue-200">{feedbackMessage}</p>
        </div>
      )}
    </div>
  )
}

function PollWidget({ config, feedbackMessage, labId }: { config: PollConfig; feedbackMessage: string; labId: string }) {
  const storageKey = `minilab-poll-${labId}`
  const [voted, setVoted] = useState<number | null>(() => {
    const saved = localStorage.getItem(storageKey)
    return saved ? Number(saved) : null
  })

  const handleVote = (index: number) => {
    setVoted(index)
    localStorage.setItem(storageKey, String(index))
  }

  return (
    <div className="space-y-6">
      {config.question && (
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{config.question}</p>
      )}

      <div className="space-y-2">
        {config.options.map((option, index) => (
          <button
            key={index}
            onClick={() => !voted && handleVote(index)}
            disabled={voted !== null}
            className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
              voted === index
                ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                : voted !== null
                ? 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 opacity-60 cursor-not-allowed'
                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-purple-300'
            }`}
          >
            <span className="flex items-center gap-3">
              <span className="text-2xl">{option.emoji}</span>
              <span className="font-medium text-gray-800 dark:text-gray-200">{option.label}</span>
            </span>
          </button>
        ))}
      </div>

      {voted !== null && (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
          <p className="font-semibold text-green-700 dark:text-green-300">
            ✅ 투표 완료! <span className="text-gray-700 dark:text-gray-300">선택: {config.options[voted].label}</span>
          </p>
        </div>
      )}

      {voted !== null && feedbackMessage && (
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-800 dark:text-blue-200">{feedbackMessage}</p>
        </div>
      )}
    </div>
  )
}
