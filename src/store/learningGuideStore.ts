import { create } from 'zustand'
import type { GuideMode, GuideMessage, DiagnosticResult, SectionContext } from '../types/learningGuide'
import { detectGuideMode, sendChatMessage } from '../lib/learningGuideApi'
import { generateLocalGuideAnswer } from '../lib/learningGuideLocalAnswers'

interface LearningGuideState {
  mode: GuideMode
  isOpen: boolean
  conversations: Map<string, GuideMessage[]>
  diagnosticResults: Map<string, DiagnosticResult>
  isLoading: boolean
  detectMode: () => Promise<void>
  toggleOpen: () => void
  setOpen: (open: boolean) => void
  saveDiagnosticResult: (sectionId: string, result: DiagnosticResult) => void
  getDiagnosticResult: (sectionId: string) => DiagnosticResult | undefined
  sendMessage: (sectionId: string, message: string, sectionContext: SectionContext) => Promise<void>
  addMessage: (sectionId: string, message: GuideMessage) => void
  getMessages: (sectionId: string) => GuideMessage[]
  clearConversation: (sectionId: string) => void
}

const CONVERSATIONS_KEY = 'ai-platform-learning-guide-conversations'
const DIAGNOSTICS_KEY = 'ai-platform-learning-guide-diagnostics'

// localStorage helpers
function loadFromStorage<T>(key: string, defaultVal: T): T {
  try {
    const data = localStorage.getItem(key)
    if (data) return JSON.parse(data)
  } catch { /* ignore */ }
  return defaultVal
}

function saveToStorage(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch { /* quota exceeded, ignore */ }
}

function loadConversations(): Map<string, GuideMessage[]> {
  const stored = loadFromStorage<Record<string, GuideMessage[]>>(CONVERSATIONS_KEY, {})
  return new Map(Object.entries(stored))
}

function loadDiagnostics(): Map<string, DiagnosticResult> {
  const stored = loadFromStorage<Record<string, DiagnosticResult>>(DIAGNOSTICS_KEY, {})
  return new Map(Object.entries(stored))
}

function saveConversations(conversations: Map<string, GuideMessage[]>): void {
  const obj = Object.fromEntries(conversations.entries())
  saveToStorage(CONVERSATIONS_KEY, obj)
}

function saveDiagnostics(diagnostics: Map<string, DiagnosticResult>): void {
  const obj = Object.fromEntries(diagnostics.entries())
  saveToStorage(DIAGNOSTICS_KEY, obj)
}

function generateMessageId(): string {
  return `guide-msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

export const useLearningGuideStore = create<LearningGuideState>((set, get) => ({
  mode: 'detecting',
  isOpen: false,
  conversations: loadConversations(),
  diagnosticResults: loadDiagnostics(),
  isLoading: false,

  detectMode: async () => {
    const mode = await detectGuideMode()
    set({ mode })
  },

  toggleOpen: () => {
    set((state) => ({ isOpen: !state.isOpen }))
  },

  setOpen: (open: boolean) => {
    set({ isOpen: open })
  },

  saveDiagnosticResult: (sectionId: string, result: DiagnosticResult) => {
    set((state) => {
      const newDiagnostics = new Map(state.diagnosticResults)
      newDiagnostics.set(sectionId, result)
      saveDiagnostics(newDiagnostics)
      return { diagnosticResults: newDiagnostics }
    })
  },

  getDiagnosticResult: (sectionId: string) => {
    return get().diagnosticResults.get(sectionId)
  },

  sendMessage: async (sectionId: string, message: string, sectionContext: SectionContext) => {
    const state = get()
    const diagnosticResult = state.diagnosticResults.get(sectionId)

    // 1. Add user message immediately
    const userMessage: GuideMessage = {
      id: generateMessageId(),
      role: 'user',
      content: message,
      createdAt: new Date().toISOString(),
    }

    set((s) => {
      const newConversations = new Map(s.conversations)
      const messages = [...(newConversations.get(sectionId) || []), userMessage]
      newConversations.set(sectionId, messages)
      saveConversations(newConversations)
      return { conversations: newConversations, isLoading: true }
    })

    // 2. Add typing indicator
    const typingMessage: GuideMessage = {
      id: generateMessageId(),
      role: 'assistant',
      content: '',
      createdAt: new Date().toISOString(),
      isTyping: true,
    }

    set((s) => {
      const newConversations = new Map(s.conversations)
      const messages = [...(newConversations.get(sectionId) || []), typingMessage]
      newConversations.set(sectionId, messages)
      return { conversations: newConversations }
    })

    // 3. Get response based on mode
    let responseContent: string

    if (get().mode === 'ai') {
      // Build conversation history for API (exclude typing messages)
      const history = (get().conversations.get(sectionId) || [])
        .filter((m) => !m.isTyping && m.role !== 'system')
        .slice(0, -1) // Exclude the user message we just added (it's sent separately)
        .map((m) => ({ role: m.role, content: m.content }))

      const aiResponse = await sendChatMessage(message, sectionContext, history, diagnosticResult)

      if (aiResponse) {
        responseContent = aiResponse.message
      } else {
        // Fall back to local on API failure
        responseContent = generateLocalGuideAnswer(message, sectionContext, diagnosticResult)
      }
    } else {
      // Local mode
      responseContent = generateLocalGuideAnswer(message, sectionContext, diagnosticResult)
    }

    // 4. Replace typing message with real response
    const assistantMessage: GuideMessage = {
      id: typingMessage.id,
      role: 'assistant',
      content: responseContent,
      createdAt: new Date().toISOString(),
    }

    set((s) => {
      const newConversations = new Map(s.conversations)
      const messages = (newConversations.get(sectionId) || []).map((m) =>
        m.id === typingMessage.id ? assistantMessage : m
      )
      newConversations.set(sectionId, messages)
      saveConversations(newConversations)
      return { conversations: newConversations, isLoading: false }
    })
  },

  addMessage: (sectionId: string, message: GuideMessage) => {
    set((state) => {
      const newConversations = new Map(state.conversations)
      const messages = [...(newConversations.get(sectionId) || []), message]
      newConversations.set(sectionId, messages)
      saveConversations(newConversations)
      return { conversations: newConversations }
    })
  },

  getMessages: (sectionId: string) => {
    return get().conversations.get(sectionId) || []
  },

  clearConversation: (sectionId: string) => {
    set((state) => {
      const newConversations = new Map(state.conversations)
      newConversations.delete(sectionId)
      saveConversations(newConversations)
      return { conversations: newConversations }
    })
  },
}))
