import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import Cursor from './components/Cursor'
import Layout from './components/Layout'
import ScrollToTop from './components/ScrollToTop'

const Home = lazy(() => import('./pages/Home'))
const Projects = lazy(() => import('./pages/Projects'))

const Loading = () => (
  <div className="loading-container">
    <div className="loading-spinner">
      <div className="spinner"></div>
      <p>Loading...</p>
    </div>
  </div>
)

function App() {
  return (
    <>
      <Cursor />
      <Layout>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<Projects />} />
          </Routes>
        </Suspense>
      </Layout>
      <ScrollToTop />
    </>
  )
}

export default App

