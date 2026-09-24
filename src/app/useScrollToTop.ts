import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/** Start each new screen at the top, the way a normal page load does. */
export function useScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])
}
