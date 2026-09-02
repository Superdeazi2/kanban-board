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
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onCancel()
      }}
    >
      <section
        className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl"
        role="alertdialog"
        aria-modal="true"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              {description}
            </p>
          </div>

          <button
            className="grid h-8 w-8 place-items-center rounded-lg text-lg text-slate-400 transition duration-150 hover:rotate-6 hover:bg-slate-100 hover:text-slate-700 active:scale-90"
            type="button"
            onClick={onCancel}
            aria-label="Закрыть подтверждение"
          >
            ×
          </button>
        </div>

        <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            className="min-h-10 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 transition duration-150 hover:-translate-y-0.5 hover:bg-slate-50 hover:shadow-sm active:translate-y-0 active:scale-95"
            type="button"
            onClick={onCancel}
          >
            Отмена
          </button>
          <button
            className="min-h-10 rounded-lg bg-rose-600 px-4 text-sm font-semibold text-white transition duration-150 hover:-translate-y-0.5 hover:bg-rose-700 hover:shadow-md active:translate-y-0 active:scale-95"
            type="button"
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </section>
    </div>
  )
}
