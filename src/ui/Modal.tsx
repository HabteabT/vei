import { useEffect, useRef, type ReactNode } from 'react'

/** Uses the browser's native <dialog>, which traps focus and closes on Escape for free. */
export function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
}) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={ref}
      className="modal"
      aria-labelledby="modal-title"
      onClose={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose() // click on the backdrop
      }}
    >
      {open && (
        <div className="modal__body">
          <h2 id="modal-title">{title}</h2>
          {children}
        </div>
      )}
    </dialog>
  )
}
