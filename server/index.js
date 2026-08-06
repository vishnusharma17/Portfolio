import cors from 'cors'
import express from 'express'
import fs from 'fs/promises'
import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const ROOT = path.resolve(__dirname, '..')
const DATA_FILE = path.join(__dirname, 'data', 'content.json')
const MESSAGES_FILE = path.join(__dirname, 'data', 'messages.json')
const UPLOAD_DIR = path.join(__dirname, 'uploads')
const PUBLIC_IMAGES = path.join(ROOT, 'public', 'images')
const DOCS_DIR = path.join(ROOT, 'docs')

const PORT = process.env.PORT || 4000
const ADMIN_SECRET = process.env.ADMIN_SECRET || 'vishnu-admin-2026'
const SERVE_FRONTEND =
  process.env.SERVE_FRONTEND === 'true' || process.env.NODE_ENV === 'production'

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

  // Keep fallbacks in sync for Vite public + GitHub Pages docs
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
  const key = req.headers['x-admin-key'] || req.query.key
  if (key !== ADMIN_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  next()
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, serveFrontend: SERVE_FRONTEND })
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

    // Also copy into docs for production/live static hosting
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

// Live server: serve built frontend from docs/ under /Portfolio/
async function setupFrontend() {
  if (!SERVE_FRONTEND) return

  try {
    await fs.access(path.join(DOCS_DIR, 'index.html'))
  } catch {
    console.warn('docs/ not built yet. Run `npm run build` before SERVE_FRONTEND=true')
    return
  }

  app.use('/Portfolio', express.static(DOCS_DIR, { index: 'index.html' }))
  app.get(['/Portfolio', '/Portfolio/*'], (req, res) => {
    res.sendFile(path.join(DOCS_DIR, 'index.html'))
  })
  app.get('/', (_req, res) => {
    res.redirect('/Portfolio/')
  })
}

await setupFrontend()

app.listen(PORT, () => {
  console.log(`Portfolio API running on http://localhost:${PORT}`)
  if (SERVE_FRONTEND) {
    console.log(`Frontend: http://localhost:${PORT}/Portfolio/`)
  }
  console.log(`Admin key default: ${ADMIN_SECRET}`)
})
