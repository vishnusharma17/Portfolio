import cors from 'cors'
import 'dotenv/config'
import express from 'express'
import fs from 'fs/promises'
import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'
import {
  clearExpiredSessions,
  createOtp,
  isValidSession,
  maskPhone,
  normalizePhone,
  revokeSession,
  verifyOtp,
} from './otp.js'
import { sendSmsOtp } from './sms.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const ROOT = path.resolve(__dirname, '..')
const DATA_FILE = path.join(__dirname, 'data', 'content.json')
const MESSAGES_FILE = path.join(__dirname, 'data', 'messages.json')
const UPLOAD_DIR = path.join(__dirname, 'uploads')
const PUBLIC_IMAGES = path.join(ROOT, 'public', 'images')
const DOCS_DIR = path.join(ROOT, 'docs')

const PORT = process.env.PORT || 4000
const ADMIN_PHONE = normalizePhone(
  process.env.ADMIN_PHONE || '919664332928'
)
const SERVE_FRONTEND =
  process.env.SERVE_FRONTEND === 'true' || process.env.NODE_ENV === 'production'
const ALLOW_DEV_OTP =
  process.env.ALLOW_DEV_OTP === 'true' || process.env.NODE_ENV !== 'production'

const app = express()
app.use(cors())
app.use(express.json({ limit: '2mb' }))
app.use('/uploads', express.static(UPLOAD_DIR))

const storage = multer.diskStorage({
  destination: async (_req, _file, cb) => {
    await fs.mkdir(UPLOAD_DIR, { recursive: true })
    await fs.mkdir(PUBLIC_IMAGES, { recursive: true })
    cb(null, UPLOAD_DIR)
  },
  filename: (_req, file, cb) => {
    const safe = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '-')
    cb(null, `${Date.now()}-${safe}`)
  },
})

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith('image/') && file.mimetype !== 'application/pdf') {
      return cb(new Error('Only images and PDF files are allowed'))
    }
    cb(null, true)
  },
})

async function readContent() {
  const raw = await fs.readFile(DATA_FILE, 'utf8')
  return JSON.parse(raw)
}

async function writeContent(data) {
  const json = JSON.stringify(data, null, 2)
  await fs.writeFile(DATA_FILE, json)

  const targets = [
    path.join(ROOT, 'public', 'content.json'),
    path.join(DOCS_DIR, 'content.json'),
  ]

  for (const target of targets) {
    try {
      await fs.mkdir(path.dirname(target), { recursive: true })
      await fs.writeFile(target, json)
    } catch (err) {
      console.warn(`Could not write ${target}:`, err.message)
    }
  }
}

function requireAdmin(req, res, next) {
  clearExpiredSessions()
  const token = req.headers['x-admin-token'] || req.headers['x-admin-key']
  if (!isValidSession(token)) {
    return res.status(401).json({ error: 'Unauthorized. Verify OTP first.' })
  }
  next()
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, serveFrontend: SERVE_FRONTEND })
})

app.get('/api/admin/otp-info', (_req, res) => {
  res.json({
    phoneMasked: maskPhone(ADMIN_PHONE),
    message: 'OTP will be sent to your registered mobile number.',
  })
})

app.post('/api/admin/request-otp', async (req, res) => {
  try {
    const requested = normalizePhone(req.body?.phone || ADMIN_PHONE)
    if (requested !== ADMIN_PHONE) {
      return res.status(403).json({
        error: 'This number is not authorized for admin access.',
      })
    }

    const { code, expiresIn } = createOtp()
    const sms = await sendSmsOtp(ADMIN_PHONE, code)

    if (!sms.ok) {
      console.warn(`[OTP SMS failed via ${sms.provider}]`, sms.detail)
      console.log(`[OTP for +${ADMIN_PHONE}] ${code}`)

      // Dev fallback: still allow flow when SMS provider fails
      if (ALLOW_DEV_OTP) {
        return res.json({
          success: true,
          message: `SMS provider unavailable (${sms.provider}). Dev OTP logged on server.`,
          phoneMasked: maskPhone(ADMIN_PHONE),
          expiresIn,
          channel: 'dev-console',
          // Only in non-production so local testing works without SMS credits
          ...(process.env.NODE_ENV !== 'production' ? { devOtp: code } : {}),
        })
      }

      return res.status(502).json({
        error:
          'Could not send SMS OTP. Configure FAST2SMS_API_KEY or TWILIO credentials.',
        detail: sms.detail,
      })
    }

    console.log(`[OTP] sent via ${sms.provider} to ${maskPhone(ADMIN_PHONE)}`)
    res.json({
      success: true,
      message: `OTP sent to ${maskPhone(ADMIN_PHONE)}`,
      phoneMasked: maskPhone(ADMIN_PHONE),
      expiresIn,
      channel: sms.provider,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to send OTP' })
  }
})

app.post('/api/admin/verify-otp', (req, res) => {
  const result = verifyOtp(req.body?.otp)
  if (!result.ok) {
    return res.status(401).json({ error: result.error })
  }

  res.json({
    success: true,
    token: result.token,
    expiresIn: result.expiresIn,
    message: 'OTP verified. Admin unlocked.',
  })
})

app.post('/api/admin/logout', (req, res) => {
  const token = req.headers['x-admin-token'] || req.headers['x-admin-key']
  revokeSession(token)
  res.json({ success: true })
})

app.get('/api/content', async (_req, res) => {
  try {
    const content = await readContent()
    res.json(content)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to load content' })
  }
})

app.put('/api/content', requireAdmin, async (req, res) => {
  try {
    if (!req.body || typeof req.body !== 'object') {
      return res.status(400).json({ error: 'Invalid content payload' })
    }
    await writeContent(req.body)
    res.json({ success: true, content: req.body })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to save content' })
  }
})

app.post('/api/contact', async (req, res) => {
  try {
    const { firstName, lastName, email, subject, message } = req.body || {}
    if (!firstName || !lastName || !email || !subject || !message) {
      return res.status(400).json({ error: 'All fields are required' })
    }

    let messages = []
    try {
      messages = JSON.parse(await fs.readFile(MESSAGES_FILE, 'utf8'))
    } catch {
      messages = []
    }

    messages.unshift({
      id: Date.now().toString(),
      firstName,
      lastName,
      email,
      subject,
      message,
      createdAt: new Date().toISOString(),
    })

    await fs.mkdir(path.dirname(MESSAGES_FILE), { recursive: true })
    await fs.writeFile(MESSAGES_FILE, JSON.stringify(messages, null, 2))

    res.json({ success: true, message: 'Message received' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to save message' })
  }
})

app.get('/api/messages', requireAdmin, async (_req, res) => {
  try {
    const raw = await fs.readFile(MESSAGES_FILE, 'utf8').catch(() => '[]')
    res.json(JSON.parse(raw))
  } catch {
    res.status(500).json({ error: 'Failed to load messages' })
  }
})

app.post('/api/upload', requireAdmin, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }

    const publicPath = path.join(PUBLIC_IMAGES, req.file.filename)
    await fs.copyFile(req.file.path, publicPath)

    try {
      const docsImages = path.join(DOCS_DIR, 'images')
      await fs.mkdir(docsImages, { recursive: true })
      await fs.copyFile(req.file.path, path.join(docsImages, req.file.filename))
    } catch {
      // docs may not exist before first build
    }

    res.json({
      success: true,
      path: `images/${req.file.filename}`,
      url: `/uploads/${req.file.filename}`,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message || 'Upload failed' })
  }
})

async function setupFrontend() {
  if (!SERVE_FRONTEND) return

  try {
    await fs.access(path.join(DOCS_DIR, 'index.html'))
  } catch {
    console.warn('docs/ not built yet. Run `npm run build` before SERVE_FRONTEND=true')
    return
  }

  app.use('/Portfolio', express.static(DOCS_DIR, { index: 'index.html' }))
  app.get(['/Portfolio', '/Portfolio/*'], (_req, res) => {
    res.sendFile(path.join(DOCS_DIR, 'index.html'))
  })
  app.get('/', (_req, res) => {
    res.redirect('/Portfolio/')
  })
}

await setupFrontend()

app.listen(PORT, () => {
  console.log(`Portfolio API running on http://localhost:${PORT}`)
  console.log(`Admin OTP phone: ${maskPhone(ADMIN_PHONE)}`)
  if (SERVE_FRONTEND) {
    console.log(`Frontend: http://localhost:${PORT}/Portfolio/`)
  }
})
