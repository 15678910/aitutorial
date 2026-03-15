import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient } from '@supabase/supabase-js'
// CORS allowlist
const ALLOWED_ORIGINS = [
  'https://aitutorial.kr',
  'https://www.aitutorial.kr',
  'https://determined-payne.vercel.app',
  'http://localhost:5173',
]

// Rate limiting: max 10 attempts per IP per 5 minutes (higher limit for bulk invites)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT = 10
const RATE_WINDOW = 5 * 60 * 1000  // 5 minutes

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

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function validateToken(token: string, secret: string): boolean {
  try {
    const decoded = Buffer.from(token, 'base64').toString()
    const parts = decoded.split(':')
    if (parts.length !== 3 || parts[0] !== 'admin') return false
    const timestamp = parseInt(parts[1])
    // Token valid for 24 hours
    if (Date.now() - timestamp > 24 * 60 * 60 * 1000) return false
    const expectedHash = Buffer.from(String(timestamp) + secret).toString('base64').slice(0, 16)
    return parts[2] === expectedHash
  } catch { return false }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS - origin-based allowlist
  const origin = req.headers.origin
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin)
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    if (origin && ALLOWED_ORIGINS.includes(origin)) {
      return res.status(200).end()
    }
    return res.status(403).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  // Rate limiting
  const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown'
  if (isRateLimited(ip)) {
    return res.status(429).json({ success: false, error: 'Too many attempts. Please try again later.' })
  }

  const { emails, token } = req.body || {}

  // Validate token
  const adminSecret = process.env.ADMIN_SECRET
  if (!adminSecret) {
    return res.status(500).json({ success: false, error: 'Server configuration error' })
  }

  if (!token || !validateToken(token, adminSecret)) {
    return res.status(401).json({ success: false, error: 'Invalid or expired token' })
  }

  // Validate emails array
  if (!Array.isArray(emails) || emails.length === 0) {
    return res.status(400).json({ success: false, error: 'emails must be a non-empty array' })
  }

  if (emails.length > 50) {
    return res.status(400).json({ success: false, error: 'Cannot invite more than 50 users at once' })
  }

  for (const email of emails) {
    if (typeof email !== 'string' || !isValidEmail(email)) {
      return res.status(400).json({ success: false, error: `Invalid email address: ${email}` })
    }
  }

  // Validate Supabase env vars
  const supabaseUrl = process.env.SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    return res.status(500).json({ success: false, error: 'Server configuration error' })
  }

  // Create Supabase admin client
  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })

  // Determine redirectTo from request origin
  const redirectTo =
    origin && ALLOWED_ORIGINS.includes(origin)
      ? `${origin}/accept-invite`
      : 'https://aitutorial.kr/accept-invite'

  // Process each email
  const results: { email: string; success: boolean; error?: string; link?: string }[] = []

  for (const email of emails) {
    try {
      // generateLink: 사용자 생성 + 초대 링크 반환 (이메일 발송 없음)
      // 관리자가 카카오톡/문자 등으로 직접 링크 공유 가능
      const { data, error } = await supabase.auth.admin.generateLink({
        type: 'invite',
        email,
        options: {
          redirectTo,
          data: { name: email },
        },
      })

      if (error) {
        results.push({ email, success: false, error: error.message })
        continue
      }

      // Update profiles.approved = true if user ID is available
      if (data?.user?.id) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ approved: true })
          .eq('id', data.user.id)

        if (profileError) {
          results.push({ email, success: true, link: data?.properties?.action_link, error: `Profile update failed: ${profileError.message}` })
          continue
        }
      }

      results.push({ email, success: true, link: data?.properties?.action_link })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      results.push({ email, success: false, error: message })
    }
  }

  return res.status(200).json({ success: true, results })
}
