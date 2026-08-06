import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/** Scrolls to top on pathname change (not hash-only changes). */
const ScrollToTopOnNavigate = () => {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

export default ScrollToTopOnNavigate
