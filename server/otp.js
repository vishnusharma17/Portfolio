import crypto from 'crypto'

const OTP_TTL_MS = 5 * 60 * 1000
const SESSION_TTL_MS = 2 * 60 * 60 * 1000
const MAX_ATTEMPTS = 5

/** @type {{ code: string, expiresAt: number, attempts: number } | null} */
let pendingOtp = null

/** @type {Map<string, number>} */
const sessions = new Map()

export function normalizePhone(phone) {
  const digits = String(phone || '').replace(/\D/g, '')
  if (digits.length === 10) return `91${digits}`
  if (digits.length === 12 && digits.startsWith('91')) return digits
  return digits
}

export function maskPhone(phone) {
  const n = normalizePhone(phone)
  if (n.length < 4) return '****'
  return `+${n.slice(0, 2)} ******${n.slice(-4)}`
}

export function createOtp() {
  const code = String(crypto.randomInt(100000, 999999))
  pendingOtp = {
    code,
    expiresAt: Date.now() + OTP_TTL_MS,
    attempts: 0,
  }
  return {
    code,
    expiresIn: Math.floor(OTP_TTL_MS / 1000),
  }
}

export function verifyOtp(input) {
  if (!pendingOtp) {
    return { ok: false, error: 'No OTP requested. Please send OTP first.' }
  }

  if (Date.now() > pendingOtp.expiresAt) {
    pendingOtp = null
    return { ok: false, error: 'OTP expired. Please request a new one.' }
  }

  pendingOtp.attempts += 1
  if (pendingOtp.attempts > MAX_ATTEMPTS) {
    pendingOtp = null
    return { ok: false, error: 'Too many attempts. Request a new OTP.' }
  }

  if (String(input).trim() !== pendingOtp.code) {
    return { ok: false, error: 'Invalid OTP. Try again.' }
  }

  pendingOtp = null
  const token = crypto.randomBytes(32).toString('hex')
  sessions.set(token, Date.now() + SESSION_TTL_MS)
  return { ok: true, token, expiresIn: Math.floor(SESSION_TTL_MS / 1000) }
}

export function isValidSession(token) {
  if (!token) return false
  const expiresAt = sessions.get(token)
  if (!expiresAt) return false
  if (Date.now() > expiresAt) {
    sessions.delete(token)
    return false
  }
  return true
}

export function revokeSession(token) {
  if (token) sessions.delete(token)
}

export function clearExpiredSessions() {
  const now = Date.now()
  for (const [token, expiresAt] of sessions.entries()) {
    if (now > expiresAt) sessions.delete(token)
  }
}
