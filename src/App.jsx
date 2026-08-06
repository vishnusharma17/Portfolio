import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Cursor from './components/Cursor'
import Layout from './components/Layout'
import ScrollToTop from './components/ScrollToTop'
import ScrollToTopOnNavigate from './components/ScrollToTopOnNavigate'
import { useContent } from './context/ContentContext'

const Home = lazy(() => import('./pages/Home'))
const Projects = lazy(() => import('./pages/Projects'))
const Admin = lazy(() => import('./pages/Admin'))
const NotFound = lazy(() => import('./pages/NotFound'))

const Loading = () => (
  <div className="loading-container">
    <div className="loading-spinner">
      <div className="spinner"></div>
      <p>Loading...</p>
    </div>
  </div>
)

function AppShell() {
  const location = useLocation()
  const { loading, error, content } = useContent()
  const isAdmin = location.pathname.startsWith('/admin')

  if (loading) return <Loading />

  if (error && !content) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <p>Failed to load content.</p>
          <p style={{ color: '#a3a3a3', marginTop: 8 }}>{error}</p>
        </div>
      </div>
    )
  }

  return (
    <>
      {!isAdmin && <Cursor />}
      <ScrollToTopOnNavigate />
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/admin" element={<Admin />} />

          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/home" element={<Navigate to="/" replace />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
      {!isAdmin && <ScrollToTop />}
    </>
  )
}

function App() {
  return <AppShell />
}

export default App
