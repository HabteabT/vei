import { useEffect } from 'react'

/**
 * Fades sections in as they scroll into view.
 * The `js` class is only added once this runs, so without JavaScript everything stays visible.
 */
export function useReveal() {
  useEffect(() => {
    document.documentElement.classList.add('js')
    const items = document.querySelectorAll<HTMLElement>('.reveal')

    if (!('IntersectionObserver' in window)) {
      items.forEach((el) => el.classList.add('is-in'))
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in')
            io.unobserve(entry.target)
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    )
    items.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
}
