import { useEffect, useId, useState } from 'react'
import type { Task, TaskDraft, TaskPriority, TaskStatus } from '../types'

type TaskModalProps = {
  open: boolean
  task: Task | null
  initialStatus: TaskStatus
  onClose: () => void
  onSave: (draft: TaskDraft) => void
}

type TaskFormProps = Omit<TaskModalProps, 'open'>

const inputClass =
  'mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100'

function TaskForm({
  task,
  initialStatus,
  onClose,
  onSave,
}: TaskFormProps) {
  const titleId = useId()
  const [title, setTitle] = useState(task?.title ?? '')
  const [description, setDescription] = useState(task?.description ?? '')
  const [priority, setPriority] = useState<TaskPriority>(task?.priority ?? 'medium')
  const [status, setStatus] = useState<TaskStatus>(task?.status ?? initialStatus)
  const [error, setError] = useState('')

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', handleKeyDown)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [onClose])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const cleanTitle = title.trim()
    const cleanDescription = description.trim()

    if (!cleanTitle) {
      setError('Введите название задачи.')
      return
    }

    onSave({
      title: cleanTitle,
      description: cleanDescription,
      priority,
      status,
    })
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <section
        className="w-full max-w-lg rounded-2xl border border-white bg-white p-5 shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wide text-slate-500">
              {task ? 'Редактирование' : 'Новая задача'}
            </span>
            <h2
              className="mt-1 text-xl font-bold tracking-tight text-slate-900"
              id={titleId}
            >
              {task ? 'Изменить задачу' : 'Добавить новую задачу'}
            </h2>
          </div>

          <button
            className="grid h-9 w-9 place-items-center rounded-lg text-xl text-slate-400 transition duration-150 hover:rotate-6 hover:bg-slate-100 hover:text-slate-700 active:scale-90"
            type="button"
            onClick={onClose}
            aria-label="Закрыть окно"
          >
            ×
          </button>
        </div>

        <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="text-xs font-semibold text-slate-600">
              Название
            </span>
            <input
              className={inputClass}
              autoFocus
              value={title}
              onChange={(event) => {
                setTitle(event.target.value)
                if (error) setError('')
              }}
              placeholder="Например: проверить мобильную версию"
              maxLength={80}
            />
          </label>

          <label className="block">
            <span className="text-xs font-semibold text-slate-600">
              Описание
            </span>
            <textarea
              className={inputClass}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Коротко, что нужно сделать."
              rows={4}
              maxLength={280}
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-xs font-semibold text-slate-600">
                Приоритет
              </span>
              <select
                className={inputClass}
                value={priority}
                onChange={(event) =>
                  setPriority(event.target.value as TaskPriority)
                }
              >
                <option value="low">Низкий</option>
                <option value="medium">Средний</option>
                <option value="high">Высокий</option>
              </select>
            </label>

            <label className="block">
              <span className="text-xs font-semibold text-slate-600">
                Статус
              </span>
              <select
                className={inputClass}
                value={status}
                onChange={(event) =>
                  setStatus(event.target.value as TaskStatus)
                }
              >
                <option value="backlog">Надо сделать</option>
                <option value="progress">В работе</option>
                <option value="done">Готово</option>
              </select>
            </label>
          </div>

          {error ? (
            <p className="text-sm font-medium text-rose-600">{error}</p>
          ) : null}

          <div className="flex flex-col-reverse gap-2 pt-1 sm:flex-row sm:justify-end">
            <button
              className="min-h-10 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 transition duration-150 hover:-translate-y-0.5 hover:bg-slate-50 hover:shadow-sm active:translate-y-0 active:scale-95"
              type="button"
              onClick={onClose}
            >
              Отмена
            </button>
            <button
              className="min-h-10 rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white transition duration-150 hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-md active:translate-y-0 active:scale-95 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              type="submit"
            >
              {task ? 'Сохранить' : 'Создать'}
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}

export function TaskModal({
  open,
  task,
  initialStatus,
  onClose,
  onSave,
}: TaskModalProps) {
  if (!open) return null

  const formKey = task ? `edit:${task.id}` : `new:${initialStatus}`

  return (
    <TaskForm
      key={formKey}
      task={task}
      initialStatus={initialStatus}
      onClose={onClose}
      onSave={onSave}
    />
  )
}
