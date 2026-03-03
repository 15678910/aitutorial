import type { DiagnosticOption, DiagnosticResult, LearningLevel, LearningStyle } from '../types/learningGuide'

export function calculateDiagnosticResult(selectedOptions: DiagnosticOption[]): DiagnosticResult {
  const scores: Record<LearningLevel, number> = { beginner: 0, intermediate: 0, advanced: 0 }
  const styleScores: Record<LearningStyle, number> = { visual: 0, textual: 0, 'example-based': 0 }

  for (const option of selectedOptions) {
    if (option.levelScore) {
      for (const [level, score] of Object.entries(option.levelScore)) {
        scores[level as LearningLevel] += score || 0
      }
    }
    if (option.styleScore) {
      for (const [style, score] of Object.entries(option.styleScore)) {
        styleScores[style as LearningStyle] += score || 0
      }
    }
  }

  // Determine highest scoring level
  const level = (Object.entries(scores) as [LearningLevel, number][])
    .sort((a, b) => b[1] - a[1])[0][0]

  // Determine highest scoring style (default to example-based)
  const style = (Object.entries(styleScores) as [LearningStyle, number][])
    .sort((a, b) => b[1] - a[1])[0][0] || 'example-based'

  return {
    level,
    style,
    scores,
    styleScores,
    completedAt: new Date().toISOString(),
  }
}
