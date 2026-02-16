import type { GroupMission as GroupMissionType, MissionStep, GroupMissionProgress } from '../../types/studyGroup'
import Button from '../ui/Button'

interface GroupMissionProps {
  mission: GroupMissionType
  groupId: string
  progress?: GroupMissionProgress
  onStart: (groupId: string, missionId: string) => void
  onCompleteStep: (groupId: string, missionId: string, stepId: string) => void
  onCompleteMission: (groupId: string, missionId: string) => void
}

const DIFFICULTY_CONFIG = {
  easy: { label: '쉬움', bg: 'bg-green-100', text: 'text-green-800' },
  medium: { label: '중간', bg: 'bg-yellow-100', text: 'text-yellow-800' },
  hard: { label: '어려움', bg: 'bg-red-100', text: 'text-red-800' },
}

const TYPE_ICONS = {
  discussion: '💬',
  experiment: '🔬',
  research: '📚',
  presentation: '🎤',
}

const TYPE_LABELS = {
  discussion: '토론',
  experiment: '실험',
  research: '연구',
  presentation: '발표',
}

const STEP_ICONS = {
  discuss: '💬',
  try: '🔧',
  write: '✏️',
  present: '🎤',
}

function getCompletedStepsCount(progress?: GroupMissionProgress): number {
  return progress?.completedSteps.length ?? 0
}

export default function GroupMissionCard({
  mission,
  groupId,
  progress,
  onStart,
  onCompleteStep,
  onCompleteMission,
}: GroupMissionProps) {
  const difficulty = DIFFICULTY_CONFIG[mission.difficulty]
  const completedCount = getCompletedStepsCount(progress)
  const totalSteps = mission.steps.length
  const progressPercentage = totalSteps > 0 ? (completedCount / totalSteps) * 100 : 0
  const isStarted = !!progress
  const isAllCompleted = isStarted && completedCount === totalSteps

  const isStepCompleted = (stepId: string): boolean => {
    return progress?.completedSteps.includes(stepId) ?? false
  }

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-200 p-5">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex items-center gap-3 flex-1">
            <span className="text-3xl">{TYPE_ICONS[mission.type]}</span>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900">{mission.title}</h3>
              <p className="text-xs text-gray-600">{TYPE_LABELS[mission.type]}</p>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${difficulty.bg} ${difficulty.text}`}>
            {difficulty.label}
          </span>
        </div>

        {/* Meta Info */}
        <div className="flex items-center gap-4 text-sm text-gray-700 font-medium">
          <span>⏱️ {mission.estimatedMinutes}분</span>
          <span>⭐ {mission.rewardPoints}점</span>
        </div>
      </div>

      {/* Description */}
      <div className="px-5 pt-4 pb-2">
        <p className="text-sm text-gray-700 leading-relaxed">{mission.description}</p>
      </div>

      {/* Progress Bar */}
      {isStarted && (
        <div className="px-5 py-3 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-600">진행도</span>
            <span className="text-xs font-bold text-amber-600">
              {completedCount} / {totalSteps}
            </span>
          </div>
          <div className="w-full bg-gray-300 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-amber-400 to-orange-500 h-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      )}

      {/* Steps List */}
      <div className="px-5 py-4">
        <h4 className="text-sm font-bold text-gray-900 mb-3">단계</h4>
        <div className="space-y-3">
          {mission.steps.map((step: MissionStep, index: number) => {
            const isCompleted = isStepCompleted(step.id)
            return (
              <div
                key={step.id}
                className={`p-3 rounded-lg border transition-all ${
                  isCompleted
                    ? 'bg-green-50 border-green-200'
                    : 'bg-gray-50 border-gray-200 hover:border-amber-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Checkbox */}
                  <div className="flex-shrink-0 pt-1">
                    {isCompleted ? (
                      <div className="w-5 h-5 rounded-md bg-green-500 flex items-center justify-center">
                        <span className="text-white text-sm font-bold">✓</span>
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-md border-2 border-gray-300" />
                    )}
                  </div>

                  {/* Step Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{STEP_ICONS[step.type]}</span>
                      <h5
                        className={`text-sm font-semibold ${
                          isCompleted
                            ? 'text-gray-500 line-through'
                            : 'text-gray-900'
                        }`}
                      >
                        {index + 1}. {step.title}
                      </h5>
                    </div>
                    <p className={`text-xs leading-relaxed ${isCompleted ? 'text-gray-400' : 'text-gray-600'}`}>
                      {step.description}
                    </p>
                  </div>

                  {/* Complete Button */}
                  {isStarted && !isCompleted && !isAllCompleted && (
                    <button
                      onClick={() => onCompleteStep(groupId, mission.id, step.id)}
                      className="flex-shrink-0 px-2.5 py-1 text-xs font-semibold text-amber-600 hover:bg-amber-100 rounded-md transition-colors"
                    >
                      완료
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-5 py-4 bg-gray-50 border-t border-gray-200 flex gap-3">
        {!isStarted && (
          <Button
            onClick={() => onStart(groupId, mission.id)}
            className="flex-1"
          >
            미션 시작하기
          </Button>
        )}

        {isStarted && isAllCompleted && (
          <Button
            onClick={() => onCompleteMission(groupId, mission.id)}
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            미션 완료!
          </Button>
        )}

        {isStarted && !isAllCompleted && (
          <div className="text-center flex-1 py-2">
            <p className="text-xs font-semibold text-gray-600">
              {totalSteps - completedCount}개 단계 남음
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
