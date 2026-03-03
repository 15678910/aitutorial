import type { SectionContext, DiagnosticResult, GuideMode } from '../types/learningGuide'

let cachedMode: GuideMode | null = null

export async function detectGuideMode(): Promise<GuideMode> {
  if (cachedMode && cachedMode !== 'detecting') return cachedMode

  try {
    const response = await fetch('/api/chat', { method: 'GET' })
    if (response.ok) {
      cachedMode = 'ai'
    } else {
      cachedMode = 'local'
    }
  } catch {
    cachedMode = 'local'
  }

  return cachedMode
}

export async function sendChatMessage(
  message: string,
  sectionContext: SectionContext,
  conversationHistory: { role: string; content: string }[],
  diagnosticResult?: DiagnosticResult
): Promise<{ message: string; mode: 'ai' } | null> {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        sectionContext,
        conversationHistory,
        diagnosticResult,
      }),
    })

    if (!response.ok) return null

    return await response.json()
  } catch {
    return null
  }
}

export function resetModeCache(): void {
  cachedMode = null
}
