import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useContent } from '../context/ContentContext'
import { asset } from '../utils/assets'
import {
  fetchMessages,
  fetchOtpInfo,
  logoutAdmin,
  requestAdminOtp,
  saveContent,
  uploadFile,
  verifyAdminOtp,
} from '../services/api'
import './Admin.css'

const TOKEN_KEY = 'portfolio_admin_token'

function FileChooser({
  label,
  value,
  onPathChange,
  onFile,
  accept = 'image/*',
  kind = 'image',
}) {
  const inputId = useId()
  const inputRef = useRef(null)
  const [uploading, setUploading] = useState(false)
  const previewUrl = useMemo(() => {
    if (!value) return ''
    if (kind !== 'image') return ''
    return asset(value)
  }, [value, kind])

  const handleChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      await onFile(file)
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  return (
    <div className="file-chooser">
      <span className="file-chooser-label">{label}</span>

      {kind === 'image' && previewUrl ? (
        <div className="file-preview">
          <img src={previewUrl} alt="" />
        </div>
      ) : null}

      {kind === 'file' && value ? (
        <p className="file-current">Current: {value}</p>
      ) : null}

      <input
        type="text"
        value={value || ''}
        onChange={(e) => onPathChange(e.target.value)}
        placeholder={kind === 'image' ? 'images/photo.jpg' : 'images/resume.pdf'}
      />

      <div className="file-chooser-actions">
        <input
          id={inputId}
          ref={inputRef}
          type="file"
          accept={accept}
          className="file-input-hidden"
          onChange={handleChange}
        />
        <button
          type="button"
          className="file-choose-btn"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
        >
          {uploading ? 'Uploading…' : kind === 'image' ? 'Choose Image' : 'Choose File'}
        </button>
        {value ? (
          <button
            type="button"
            className="file-clear-btn"
            onClick={() => onPathChange('')}
          >
            Clear
          </button>
        ) : null}
      </div>
    </div>
  )
}

const Admin = () => {
  const { rawContent, setRawContent, reload } = useContent()
  const [adminToken, setAdminToken] = useState(
    () => sessionStorage.getItem(TOKEN_KEY) || ''
  )
  const [draft, setDraft] = useState(null)
  const [status, setStatus] = useState('')
  const [saving, setSaving] = useState(false)
  const [messages, setMessages] = useState([])
  const [unlocked, setUnlocked] = useState(false)

  const [phoneMasked, setPhoneMasked] = useState('+91 ******2928')
  const [otpSent, setOtpSent] = useState(false)
  const [otp, setOtp] = useState('')
  const [sendingOtp, setSendingOtp] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [cooldown, setCooldown] = useState(0)

  const active = draft || rawContent

  const jsonPreview = useMemo(
    () => (active ? JSON.stringify(active, null, 2) : ''),
    [active]
  )

  useEffect(() => {
    sessionStorage.removeItem('portfolio_admin_key')

    fetchOtpInfo()
      .then((info) => {
        if (info?.phoneMasked) setPhoneMasked(info.phoneMasked)
      })
      .catch(() => {})

    if (adminToken && rawContent) {
      setDraft(structuredClone(rawContent))
      setUnlocked(true)
      setStatus('Session restored. Edit and save.')
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (unlocked && rawContent && !draft) {
      setDraft(structuredClone(rawContent))
    }
  }, [rawContent, unlocked, draft])

  useEffect(() => {
    if (cooldown <= 0) return undefined
    const id = setInterval(() => {
      setCooldown((c) => (c > 0 ? c - 1 : 0))
    }, 1000)
    return () => clearInterval(id)
  }, [cooldown])

  const handleSendOtp = async () => {
    setSendingOtp(true)
    setStatus('')
    try {
      const result = await requestAdminOtp()
      setOtpSent(true)
      setCooldown(60)
      let msg = result.message || `OTP sent to ${result.phoneMasked || phoneMasked}`
      if (result.devOtp) msg += ` (Dev OTP: ${result.devOtp})`
      setStatus(msg)
      if (result.phoneMasked) setPhoneMasked(result.phoneMasked)
    } catch (err) {
      setStatus(err.message || 'Failed to send OTP. Is the API running?')
    } finally {
      setSendingOtp(false)
    }
  }

  const handleVerifyOtp = async () => {
    if (!/^\d{6}$/.test(otp.trim())) {
      setStatus('Enter the 6-digit OTP.')
      return
    }

    setVerifying(true)
    setStatus('')
    try {
      const result = await verifyAdminOtp(otp.trim())
      sessionStorage.setItem(TOKEN_KEY, result.token)
      setAdminToken(result.token)
      setDraft(structuredClone(rawContent))
      setUnlocked(true)
      setOtp('')
      setStatus('OTP verified. Admin panel unlocked.')
    } catch (err) {
      setStatus(err.message || 'OTP verification failed.')
    } finally {
      setVerifying(false)
    }
  }

  const handleLogout = async () => {
    try {
      await logoutAdmin(adminToken)
    } catch {
      // ignore
    }
    sessionStorage.removeItem(TOKEN_KEY)
    setAdminToken('')
    setUnlocked(false)
    setDraft(null)
    setOtpSent(false)
    setOtp('')
    setStatus('Logged out.')
  }

  const updateProfile = (field, value) => {
    setDraft((prev) => ({
      ...prev,
      profile: { ...prev.profile, [field]: value },
    }))
  }

  const updateContact = (field, value) => {
    setDraft((prev) => ({
      ...prev,
      contact: { ...prev.contact, [field]: value },
    }))
  }

  const updateSocial = (field, value) => {
    setDraft((prev) => ({
      ...prev,
      social: { ...prev.social, [field]: value },
    }))
  }

  const updateAbout = (field, value) => {
    setDraft((prev) => ({
      ...prev,
      about: { ...prev.about, [field]: value },
    }))
  }

  const updateProject = (index, field, value) => {
    setDraft((prev) => {
      const projects = [...prev.projects]
      projects[index] = { ...projects[index], [field]: value }
      return { ...prev, projects }
    })
  }

  const uploadAndSet = async (file, applyPath) => {
    setStatus('Uploading…')
    try {
      const result = await uploadFile(file, adminToken)
      applyPath(result.path)
      setStatus(`Uploaded: ${result.path}`)
    } catch (err) {
      setStatus(err.message || 'Upload failed')
      throw err
    }
  }

  const handleSave = async () => {
    if (!draft) return
    setSaving(true)
    setStatus('')
    try {
      await saveContent(draft, adminToken)
      setRawContent(draft)
      setStatus('Saved. Site content updated.')
      await reload()
    } catch (err) {
      setStatus(err.message || 'Save failed. Session may have expired — login again.')
      if (String(err.message || '').toLowerCase().includes('unauthorized')) {
        handleLogout()
      }
    } finally {
      setSaving(false)
    }
  }

  const loadMessages = async () => {
    try {
      const data = await fetchMessages(adminToken)
      setMessages(data)
      setStatus(`Loaded ${data.length} messages.`)
    } catch (err) {
      setStatus(err.message || 'Could not load messages')
    }
  }

  if (!rawContent) {
    return (
      <div className="admin-page">
        <p>Loading content…</p>
      </div>
    )
  }

  if (!unlocked) {
    return (
      <div className="admin-page">
        <div className="admin-card">
          <h1>Admin Login</h1>
          <p>
            OTP aapke registered number par jayega. Verify hone ke baad hi panel
            open hoga.
          </p>

          <div className="otp-phone">
            <span className="otp-label">Registered number</span>
            <strong>{phoneMasked}</strong>
          </div>

          {!otpSent ? (
            <button type="button" onClick={handleSendOtp} disabled={sendingOtp}>
              {sendingOtp ? 'Sending OTP…' : 'Send OTP'}
            </button>
          ) : (
            <>
              <label className="otp-field">
                Enter 6-digit OTP
                <input
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  value={otp}
                  onChange={(e) =>
                    setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))
                  }
                  placeholder="••••••"
                />
              </label>
              <button
                type="button"
                onClick={handleVerifyOtp}
                disabled={verifying || otp.length !== 6}
              >
                {verifying ? 'Verifying…' : 'Verify & Open Admin'}
              </button>
              <button
                type="button"
                className="ghost"
                onClick={handleSendOtp}
                disabled={sendingOtp || cooldown > 0}
              >
                {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend OTP'}
              </button>
            </>
          )}

          {status && <p className="admin-status">{status}</p>}
          <Link to="/" className="admin-back">
            Back to site
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-page admin-editor">
      <header className="admin-header">
        <div>
          <h1>Edit Portfolio Content</h1>
          <p>OTP verified session — choose any image/file and save.</p>
        </div>
        <div className="admin-actions">
          <button type="button" onClick={loadMessages}>
            Load Messages
          </button>
          <button
            type="button"
            className="primary"
            disabled={saving}
            onClick={handleSave}
          >
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
          <button type="button" onClick={handleLogout}>
            Logout
          </button>
          <Link to="/">View Site</Link>
        </div>
      </header>

      {status && <p className="admin-status banner">{status}</p>}

      <section className="admin-section">
        <h2>Profile</h2>
        <div className="admin-grid">
          <label>
            Name
            <input
              value={active.profile.name || ''}
              onChange={(e) => updateProfile('name', e.target.value)}
            />
          </label>
          <label>
            Title
            <input
              value={active.profile.title || ''}
              onChange={(e) => updateProfile('title', e.target.value)}
            />
          </label>
          <label className="full">
            Tagline
            <textarea
              rows={3}
              value={active.profile.tagline || ''}
              onChange={(e) => updateProfile('tagline', e.target.value)}
            />
          </label>

          <div className="full">
            <FileChooser
              label="Hero Image"
              value={active.profile.heroImage || ''}
              kind="image"
              accept="image/*"
              onPathChange={(path) => updateProfile('heroImage', path)}
              onFile={(file) =>
                uploadAndSet(file, (path) => updateProfile('heroImage', path))
              }
            />
          </div>

          <div className="full">
            <FileChooser
              label="Resume (PDF)"
              value={active.profile.resume || ''}
              kind="file"
              accept=".pdf,application/pdf"
              onPathChange={(path) => updateProfile('resume', path)}
              onFile={(file) =>
                uploadAndSet(file, (path) => updateProfile('resume', path))
              }
            />
          </div>
        </div>
      </section>

      <section className="admin-section">
        <h2>About</h2>
        <div className="admin-grid">
          <div className="full">
            <FileChooser
              label="About Image"
              value={active.about?.image || ''}
              kind="image"
              accept="image/*"
              onPathChange={(path) => updateAbout('image', path)}
              onFile={(file) =>
                uploadAndSet(file, (path) => updateAbout('image', path))
              }
            />
          </div>
          <label className="full">
            Intro
            <textarea
              rows={3}
              value={active.about?.intro || ''}
              onChange={(e) => updateAbout('intro', e.target.value)}
            />
          </label>
        </div>
      </section>

      <section className="admin-section">
        <h2>Contact & Social</h2>
        <div className="admin-grid">
          {['phone', 'email', 'location', 'availability'].map((field) => (
            <label key={field}>
              {field}
              <input
                value={active.contact?.[field] || ''}
                onChange={(e) => updateContact(field, e.target.value)}
              />
            </label>
          ))}
          {['github', 'linkedin', 'email', 'phone'].map((field) => (
            <label key={`social-${field}`}>
              social.{field}
              <input
                value={active.social?.[field] || ''}
                onChange={(e) => updateSocial(field, e.target.value)}
              />
            </label>
          ))}
        </div>
      </section>

      <section className="admin-section">
        <h2>Projects</h2>
        {(active.projects || []).map((project, index) => (
          <div className="admin-project" key={project.id || index}>
            <h3>
              {project.name}
              <label className="featured-toggle">
                <input
                  type="checkbox"
                  checked={!!project.featured}
                  onChange={(e) =>
                    updateProject(index, 'featured', e.target.checked)
                  }
                />
                Featured
              </label>
            </h3>
            <div className="admin-grid">
              <label>
                Name
                <input
                  value={project.name || ''}
                  onChange={(e) => updateProject(index, 'name', e.target.value)}
                />
              </label>
              <label>
                GitHub
                <input
                  value={project.github || ''}
                  onChange={(e) => updateProject(index, 'github', e.target.value)}
                />
              </label>
              <label>
                Live demo
                <input
                  value={project.liveDemo || ''}
                  onChange={(e) =>
                    updateProject(index, 'liveDemo', e.target.value)
                  }
                />
              </label>
              <div className="full">
                <FileChooser
                  label={`${project.name || 'Project'} Image`}
                  value={project.image || ''}
                  kind="image"
                  accept="image/*"
                  onPathChange={(path) => updateProject(index, 'image', path)}
                  onFile={(file) =>
                    uploadAndSet(file, (path) =>
                      updateProject(index, 'image', path)
                    )
                  }
                />
              </div>
              <label className="full">
                Description
                <textarea
                  rows={3}
                  value={project.description || ''}
                  onChange={(e) =>
                    updateProject(index, 'description', e.target.value)
                  }
                />
              </label>
            </div>
          </div>
        ))}
      </section>

      {messages.length > 0 && (
        <section className="admin-section">
          <h2>Contact Messages</h2>
          <ul className="admin-messages">
            {messages.map((msg) => (
              <li key={msg.id}>
                <strong>
                  {msg.firstName} {msg.lastName}
                </strong>{' '}
                — {msg.email}
                <br />
                <em>{msg.subject}</em>
                <p>{msg.message}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="admin-section">
        <h2>Raw JSON</h2>
        <pre className="admin-json">{jsonPreview}</pre>
      </section>
    </div>
  )
}

export default Admin
