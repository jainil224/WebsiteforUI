import { ModalDialog } from './ModalDialog'
import { Icon } from './icons'

type ConfirmDeleteModalProps = {
  open: boolean
  title: string
  dialogTitle?: string
  message?: string
  confirmLabel?: string
  onClose: () => void
  onConfirm: () => void
  isDeleting?: boolean
}

export function ConfirmDeleteModal({
  open,
  title,
  dialogTitle = 'Delete Inspiration?',
  message,
  confirmLabel,
  onClose,
  onConfirm,
  isDeleting = false,
}: ConfirmDeleteModalProps) {
  if (!open) return null

  return (
    <ModalDialog
      open={open}
      onClose={isDeleting ? () => {} : onClose}
      labelledBy="confirm-delete-dialog-title"
      className="confirm-delete-dialog"
    >
      <div className="dialog__header">
        <div className="dialog__title-group">
          <p className="dialog__kicker">Permanent Action</p>
          <h2 id="confirm-delete-dialog-title" className="dialog__title">
            {dialogTitle}
          </h2>
        </div>
        <button
          type="button"
          className="btn btn--ghost btn--icon dialog__close"
          onClick={onClose}
          disabled={isDeleting}
          aria-label="Close dialog"
        >
          <Icon name="close" size={18} />
        </button>
      </div>

      <div className="dialog__body">
        {message ? (
          <p className="confirm-delete-message">{message}</p>
        ) : (
          <p className="confirm-delete-message">
            Are you sure you want to delete &ldquo;<strong>{title}</strong>&rdquo;?
            This reference and its local preview image will be permanently removed from your computer.
          </p>
        )}
      </div>

      <div className="dialog__footer">
        <button
          type="button"
          className="btn btn--secondary"
          onClick={onClose}
          disabled={isDeleting}
        >
          Cancel
        </button>
        <button
          type="button"
          className="btn btn--destructive"
          onClick={onConfirm}
          disabled={isDeleting}
        >
          {isDeleting ? 'Deleting...' : confirmLabel || 'Delete Inspiration'}
        </button>
      </div>
    </ModalDialog>
  )
}
