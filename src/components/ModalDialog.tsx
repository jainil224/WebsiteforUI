import { useEffect, useRef, type ReactNode } from 'react'

type ModalDialogProps = {
  open: boolean
  onClose: () => void
  labelledBy: string
  className?: string
  children: ReactNode
}

export function ModalDialog({
  open,
  onClose,
  labelledBy,
  className = '',
  children,
}: ModalDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) {
      return
    }

    if (open && !dialog.open) {
      dialog.showModal()
    } else if (!open && dialog.open) {
      dialog.close()
    }
  }, [open])

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) {
      return
    }

    const handleClose = () => onClose()
    const handleCancel = (event: Event) => {
      event.preventDefault()
      onClose()
    }

    dialog.addEventListener('close', handleClose)
    dialog.addEventListener('cancel', handleCancel)

    return () => {
      dialog.removeEventListener('close', handleClose)
      dialog.removeEventListener('cancel', handleCancel)
    }
  }, [onClose])

  useEffect(() => {
    if (!open) {
      return
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [open])

  return (
    <dialog
      ref={dialogRef}
      className={`dialog ${className}`.trim()}
      aria-labelledby={labelledBy}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose()
        }
      }}
    >
      {children}
    </dialog>
  )
}
