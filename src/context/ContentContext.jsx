import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { fetchContent } from '../services/api'
import { asset } from '../utils/assets'

const ContentContext = createContext(null)

function withResolvedAssets(content) {
  if (!content) return null

  return {
    ...content,
    profile: {
      ...content.profile,
      heroImage: asset(content.profile?.heroImage),
      resume: asset(content.profile?.resume),
    },
    about: {
      ...content.about,
      image: asset(content.about?.image),
    },
    projects: (content.projects || []).map((project) => ({
      ...project,
      image: asset(project.image),
    })),
  }
}

export function ContentProvider({ children }) {
  const [rawContent, setRawContent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchContent()
      setRawContent(data)
    } catch (err) {
      setError(err.message || 'Failed to load content')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const value = useMemo(
    () => ({
      content: withResolvedAssets(rawContent),
      rawContent,
      setRawContent,
      loading,
      error,
      reload: load,
    }),
    [rawContent, loading, error]
  )

  return (
    <ContentContext.Provider value={value}>{children}</ContentContext.Provider>
  )
}

export function useContent() {
  const ctx = useContext(ContentContext)
  if (!ctx) {
    throw new Error('useContent must be used within ContentProvider')
  }
  return ctx
}
