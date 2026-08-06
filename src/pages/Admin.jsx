import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useContent } from '../context/ContentContext'
import { fetchMessages, saveContent, uploadFile } from '../services/api'
import './Admin.css'

const Admin = () => {
  const { rawContent, setRawContent, reload } = useContent()
  const [adminKey, setAdminKey] = useState(
    () => sessionStorage.getItem('portfolio_admin_key') || ''
  )
  const [draft, setDraft] = useState(null)
  const [status, setStatus] = useState('')
  const [saving, setSaving] = useState(false)
  const [messages, setMessages] = useState([])
  const [unlocked, setUnlocked] = useState(false)

  const active = draft || rawContent

  const jsonPreview = useMemo(
    () => (active ? JSON.stringify(active, null, 2) : ''),
    [active]
  )

  const unlock = () => {
    if (!adminKey.trim()) {
      setStatus('Enter your admin key.')
      return
    }
    sessionStorage.setItem('portfolio_admin_key', adminKey.trim())
    setDraft(structuredClone(rawContent))
    setUnlocked(true)
    setStatus('Unlocked. Edit fields below, then save.')
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

  const handleUpload = async (e, target) => {
    const file = e.target.files?.[0]
    if (!file || !draft) return

    try {
      setStatus('Uploading…')
      const result = await uploadFile(file, adminKey.trim())
      if (target.type === 'profile') {
        updateProfile(target.field, result.path)
      } else if (target.type === 'about') {
        updateAbout(target.field, result.path)
      } else if (target.type === 'project') {
        updateProject(target.index, 'image', result.path)
      }
      setStatus(`Uploaded: ${result.path}`)
    } catch (err) {
      setStatus(err.message || 'Upload failed')
    }
  }

  const handleSave = async () => {
    if (!draft) return
    setSaving(true)
    setStatus('')
    try {
      await saveContent(draft, adminKey.trim())
      setRawContent(draft)
      setStatus('Saved. Site content updated.')
      await reload()
    } catch (err) {
      setStatus(err.message || 'Save failed. Is the API running?')
    } finally {
      setSaving(false)
    }
  }

  const loadMessages = async () => {
    try {
      const data = await fetchMessages(adminKey.trim())
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
          <h1>Content Admin</h1>
          <p>Enter your admin key to edit portfolio details.</p>
          <input
            type="password"
            value={adminKey}
            onChange={(e) => setAdminKey(e.target.value)}
            placeholder="Admin key"
          />
          <button type="button" onClick={unlock}>
            Unlock
          </button>
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
          <p>Changes save to the API and public/content.json fallback.</p>
        </div>
        <div className="admin-actions">
          <button type="button" onClick={loadMessages}>
            Load Messages
          </button>
          <button type="button" className="primary" disabled={saving} onClick={handleSave}>
            {saving ? 'Saving…' : 'Save Changes'}
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
          <label>
            Hero image path
            <input
              value={active.profile.heroImage || ''}
              onChange={(e) => updateProfile('heroImage', e.target.value)}
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleUpload(e, { type: 'profile', field: 'heroImage' })}
            />
          </label>
          <label>
            Resume path
            <input
              value={active.profile.resume || ''}
              onChange={(e) => updateProfile('resume', e.target.value)}
            />
          </label>
        </div>
      </section>

      <section className="admin-section">
        <h2>About</h2>
        <div className="admin-grid">
          <label>
            About image path
            <input
              value={active.about?.image || ''}
              onChange={(e) => updateAbout('image', e.target.value)}
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                handleUpload(e, { type: 'about', field: 'image' })
              }
            />
          </label>
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
                Image path
                <input
                  value={project.image || ''}
                  onChange={(e) => updateProject(index, 'image', e.target.value)}
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    handleUpload(e, { type: 'project', index })
                  }
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
