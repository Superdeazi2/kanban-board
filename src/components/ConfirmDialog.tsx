type ConfirmDialogProps = {
  open: boolean
  title: string
  description: string
  confirmLabel?: string
  onCancel: () => void
  onConfirm: () => void
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Удалить',
  onCancel,
  onConfirm,
}: ConfirmDialogProps) {
  if (!open) return null

  return (
    <div
      className="modal-backdrop modal-backdrop--confirm"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onCancel()
      }}
    >
      <section className="confirm-dialog" role="alertdialog" aria-modal="true">
        <div className="confirm-dialog__content">
          <div className="confirm-dialog__heading">
            <div>
              <h2>{title}</h2>
              <p>{description}</p>
            </div>
            <button
              className="close-button close-button--small"
              type="button"
              onClick={onCancel}
              aria-label="Закрыть подтверждение"
            >
              ×
            </button>
          </div>

          <div className="confirm-dialog__actions">
            <button className="button button--ghost" type="button" onClick={onCancel}>
              Отмена
            </button>
            <button className="button button--danger" type="button" onClick={onConfirm}>
              {confirmLabel}
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
