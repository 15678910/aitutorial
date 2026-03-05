import type { VercelRequest, VercelResponse } from '@vercel/node'

interface SectionContext {
  sectionTitle: string
  chapterTitle: string
  courseSlug: string
  sectionContent: string
}

interface DiagnosticResult {
  level: 'beginner' | 'intermediate' | 'advanced'
  style: 'visual' | 'textual' | 'example-based'
}

function buildSystemPrompt(sectionContext: SectionContext, diagnosticResult?: DiagnosticResult): string {
  const levelDescriptions: Record<string, string> = {
    beginner: '초급 - 이 주제를 처음 접하는 학생이에요. 아주 쉽게 설명해주세요.',
    intermediate: '중급 - 기본 개념은 알고 있는 학생이에요. 조금 더 깊이 있게 설명해주세요.',
    advanced: '고급 - 개념을 이해하고 응용하고 싶은 학생이에요. 심화 내용을 알려주세요.',
  }

  const styleInstructions: Record<string, string> = {
    visual: '비유와 그림으로 설명하는 것을 좋아합니다. 이모지와 비유를 많이 사용하세요.',
    textual: '글로 된 자세한 설명을 좋아합니다. 단계별로 논리적으로 설명하세요.',
    'example-based': '구체적인 예시로 배우는 것을 좋아합니다. 실생활 예시를 많이 들어주세요.',
  }

  const level = diagnosticResult?.level || 'beginner'
  const style = diagnosticResult?.style || 'example-based'

  // Truncate section content to ~2000 chars at paragraph boundary
  let content = sectionContext.sectionContent || ''
  if (content.length > 2000) {
    const truncated = content.slice(0, 2000)
    const lastNewline = truncated.lastIndexOf('\n')
    content = lastNewline > 1500 ? truncated.slice(0, lastNewline) : truncated
    content += '\n...(이하 생략)'
  }

  return `당신은 한국 초등학교 5학년 학생을 위한 친절한 AI 학습 친구입니다.
이름은 "AI 학습 친구"입니다.

현재 학습 중인 내용:
- 코스: ${sectionContext.courseSlug}
- 챕터: ${sectionContext.chapterTitle}
- 섹션: ${sectionContext.sectionTitle}

학생 정보:
- 학습 수준: ${levelDescriptions[level]}
- 학습 스타일: ${styleInstructions[style]}

섹션 학습 내용:
${content}

규칙:
1. 초등학교 5학년이 이해할 수 있는 쉬운 한국어로 설명하세요.
2. 어려운 용어는 반드시 쉬운 비유와 함께 설명하세요.
3. 답변은 300자 이내로 간결하게 하세요.
4. 격려하는 톤을 유지하세요 ("잘 생각했어요!", "좋은 질문이에요!").
5. 현재 섹션 내용과 관련된 질문에 집중하세요.
6. 학생이 이해했는지 확인하는 질문을 마지막에 추가하세요.
7. 이모지를 적절히 사용하세요.
8. 학습과 무관한 질문에는 정중히 학습 주제로 돌아오도록 안내하세요.`
}

// CORS allowlist
const ALLOWED_ORIGINS = [
  'https://determined-payne.vercel.app',
  'http://localhost:5173',
]

// Rate limiting
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT = 10  // requests per window
const RATE_WINDOW = 60 * 1000  // 1 minute

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)
  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_WINDOW })
    return false
  }
  entry.count++
  return entry.count > RATE_LIMIT
}

// Input validation helpers
function isValidSectionContext(ctx: unknown): ctx is { sectionTitle: string; chapterTitle: string; courseSlug: string } {
  if (!ctx || typeof ctx !== 'object') return false
  const c = ctx as Record<string, unknown>
  return typeof c.sectionTitle === 'string' && typeof c.chapterTitle === 'string' && typeof c.courseSlug === 'string'
}

function isValidConversationHistory(history: unknown): boolean {
  if (!Array.isArray(history)) return false
  if (history.length > 20) return false
  return history.every(
    (item) =>
      item &&
      typeof item === 'object' &&
      typeof (item as Record<string, unknown>).role === 'string' &&
      typeof (item as Record<string, unknown>).content === 'string' &&
      ((item as Record<string, unknown>).content as string).length <= 2000
  )
}

function isValidDiagnosticResult(dr: unknown): boolean {
  if (!dr || typeof dr !== 'object') return false
  const d = dr as Record<string, unknown>
  const validLevels = ['beginner', 'intermediate', 'advanced']
  const validStyles = ['visual', 'textual', 'example-based']
  return validLevels.includes(d.level as string) && validStyles.includes(d.style as string)
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS - origin-based allowlist
  const origin = req.headers.origin
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin)
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    if (origin && ALLOWED_ORIGINS.includes(origin)) {
      return res.status(200).end()
    }
    return res.status(403).end()
  }

  // Health check for mode detection
  if (req.method === 'GET') {
    const apiKey = process.env.ANTHROPIC_API_KEY
    if (apiKey) {
      return res.status(200).json({ mode: 'ai', available: true })
    }
    return res.status(503).json({ mode: 'local', available: false })
  }

  // Chat request
  if (req.method === 'POST') {
    // Rate limiting
    const forwarded = req.headers['x-forwarded-for']
    const clientIp =
      (typeof forwarded === 'string' ? forwarded.split(',')[0].trim() : undefined) ||
      req.socket?.remoteAddress ||
      'unknown'

    if (isRateLimited(clientIp)) {
      return res.status(429).json({ error: 'Too many requests' })
    }

    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      return res.status(503).json({ error: 'Service unavailable', mode: 'local' })
    }

    const { message, sectionContext, conversationHistory, diagnosticResult } = req.body

    if (!message || typeof message !== 'string' || message.length > 1000) {
      return res.status(400).json({ error: 'Invalid message' })
    }

    if (!isValidSectionContext(sectionContext)) {
      return res.status(400).json({ error: 'Invalid sectionContext' })
    }

    if (conversationHistory !== undefined && !isValidConversationHistory(conversationHistory)) {
      return res.status(400).json({ error: 'Invalid conversationHistory' })
    }

    if (diagnosticResult !== undefined && !isValidDiagnosticResult(diagnosticResult)) {
      return res.status(400).json({ error: 'Invalid diagnosticResult' })
    }

    const systemPrompt = buildSystemPrompt(sectionContext, diagnosticResult)

    const messages = [
      ...(conversationHistory || []).slice(-10).map((msg: { role: string; content: string }) => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      })),
      { role: 'user' as const, content: message },
    ]

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-3-5-haiku-20241022',
          max_tokens: 500,
          system: systemPrompt,
          messages,
        }),
      })

      if (!response.ok) {
        console.error('Anthropic API error:', response.status)
        return res.status(502).json({ error: 'Service error' })
      }

      const data = await response.json()
      const aiMessage = data.content?.[0]?.text || '죄송해요, 답변을 생성할 수 없었어요.'

      return res.status(200).json({ message: aiMessage, mode: 'ai' })
    } catch (error) {
      console.error('Chat API error:', error)
      return res.status(500).json({ error: 'Internal server error' })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
