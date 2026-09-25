import { CircleCheck } from 'lucide-react'
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'

interface ToastItem {
  id: number
  message: string
}

const ToastContext = createContext<(message: string) => void>(() => undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
  const { pathname } = useLocation()
  const inApp = pathname.startsWith('/app')
  const [items, setItems] = useState<ToastItem[]>([])

  const notify = useCallback((message: string) => {
    const id = Date.now() + Math.random()
    setItems((current) => [...current, { id, message }])
    window.setTimeout(() => setItems((current) => current.filter((t) => t.id !== id)), 3200)
  }, [])

  const value = useMemo(() => notify, [notify])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className={`toast-region ${inApp ? 'toast-region--app' : ''}`} role="status" aria-live="polite">
        {items.map((t) => (
          <div className="toast" key={t.id}>
            <CircleCheck aria-hidden="true" />
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  return useContext(ToastContext)
}
