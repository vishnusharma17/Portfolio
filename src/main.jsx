import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { ContentProvider } from './context/ContentContext.jsx'
import './index.css'

// GitHub Pages SPA redirect support (pairs with public/404.html)
;(function fixGithubPagesSpaPath() {
  const query = window.location.search
  if (!query.startsWith('?/')) return

  const decoded = query
    .slice(2)
    .replace(/~and~/g, '&')

  const base = import.meta.env.BASE_URL || '/'
  const newPath = `${base}${decoded}`.replace(/\/{2,}/g, '/')
  window.history.replaceState(
    null,
    '',
    newPath + window.location.hash
  )
})()

const rawBase = import.meta.env.BASE_URL || '/'
// React Router: omit basename for root "/", otherwise strip trailing slash
const basename = rawBase === '/' ? undefined : rawBase.replace(/\/$/, '')

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename={basename}>
      <ContentProvider>
        <App />
      </ContentProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
