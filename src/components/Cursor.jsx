import { useEffect, useRef, useCallback } from 'react'

const Cursor = () => {
  const cursorRef = useRef(null)

  const handleMouseMove = useCallback((e) => {
    if (cursorRef.current) {
      cursorRef.current.style.left = e.clientX + 'px'
      cursorRef.current.style.top = e.clientY + 'px'
    }
  }, [])

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
    }
  }, [handleMouseMove])

  return <div ref={cursorRef} className="cursor" />
}

export default Cursor

