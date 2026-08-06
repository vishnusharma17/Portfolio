const API_ROOT = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '')

function staticContentUrl() {
  const base = import.meta.env.BASE_URL || '/'
  return `${base}content.json`.replace(/([^:]\/)\/+/g, '$1')
}

async function loadStaticContent() {
  const response = await fetch(staticContentUrl(), { cache: 'no-store' })
  if (!response.ok) {
    throw new Error('Failed to load content.json')
  }
  return response.json()
}

async function request(path, options = {}) {
  const { headers: customHeaders, signal, ...rest } = options
  const response = await fetch(`${API_ROOT}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(customHeaders || {}),
    },
    signal,
    ...rest,
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error || errorData.message || 'Request failed')
  }

  return response.json()
}

/**
 * Local (API up): prefer live API
 * Local (API down) / GitHub Pages: fall back to content.json
 * Production without VITE_API_URL: static first (avoids noisy 404s on GH Pages)
 */
export async function fetchContent() {
  const preferStatic =
    import.meta.env.PROD && !import.meta.env.VITE_API_URL

  if (preferStatic) {
    try {
      return await loadStaticContent()
    } catch {
      // If a live API is somehow available, try it
      return request('/content')
    }
  }

  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 1200)
    try {
      return await request('/content', { signal: controller.signal })
    } finally {
      clearTimeout(timer)
    }
  } catch {
    return loadStaticContent()
  }
}

export async function saveContent(content, adminKey) {
  return request('/content', {
    method: 'PUT',
    headers: { 'x-admin-key': adminKey },
    body: JSON.stringify(content),
  })
}

export async function submitContactForm(formData) {
  try {
    return await request('/contact', {
      method: 'POST',
      body: JSON.stringify(formData),
    })
  } catch {
    const body = [
      `Name: ${formData.firstName} ${formData.lastName}`,
      `Email: ${formData.email}`,
      '',
      formData.message,
    ].join('\n')

    const mailto = `mailto:vishnusharma983j@gmail.com?subject=${encodeURIComponent(
      formData.subject
    )}&body=${encodeURIComponent(body)}`

    window.location.href = mailto
    return { success: true, message: 'Opened email client', fallback: true }
  }
}

export async function uploadFile(file, adminKey) {
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch(`${API_ROOT}/upload`, {
    method: 'POST',
    headers: { 'x-admin-key': adminKey },
    body: formData,
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error || 'Upload failed')
  }

  return response.json()
}

export async function fetchMessages(adminKey) {
  return request('/messages', {
    headers: { 'x-admin-key': adminKey },
  })
}

export const trackLinkClick = async (linkType, url) => {
  if (import.meta.env.DEV) {
    console.log(`Link clicked: ${linkType} - ${url}`)
  }
}
