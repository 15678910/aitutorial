import type { VercelRequest, VercelResponse } from '@vercel/node'

// CORS allowlist
const ALLOWED_ORIGINS = [
  'https://aitutorial.kr',
  'https://www.aitutorial.kr',
  'https://determined-payne.vercel.app',
  'http://localhost:5173',
]

// Rate limiting: max 5 attempts per IP per 5 minutes
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT = 5
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

function generateToken(secret: string): string {
  const timestamp = Date.now()
  // Simple token: base64(timestamp:hash)
  const payload = `admin:${timestamp}:${Buffer.from(String(timestamp) + secret).toString('base64').slice(0, 16)}`
  return Buffer.from(payload).toString('base64')
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

// Export validateToken for potential use by other handlers
export { validateToken }

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

  const { password } = req.body || {}

  if (typeof password !== 'string' || !password) {
    return res.status(400).json({ success: false, error: 'Password required' })
  }

  const adminSecret = process.env.ADMIN_SECRET
  if (!adminSecret) {
    return res.status(500).json({ success: false, error: 'Server configuration error' })
  }

  if (password !== adminSecret) {
    return res.status(401).json({ success: false, error: 'Invalid password' })
  }

  const token = generateToken(adminSecret)
  return res.status(200).json({ success: true, token })
}
