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
      className="modal-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <section
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className="modal__header">
          <div>
            <span className="modal__eyebrow">
              {task ? 'Редактирование' : 'Новая задача'}
            </span>
            <h2 id={titleId}>
              {task ? 'Изменить задачу' : 'Добавить новую задачу'}
            </h2>
          </div>

          <button
            className="close-button"
            type="button"
            onClick={onClose}
            aria-label="Закрыть окно"
          >
            ×
          </button>
        </div>

        <form className="task-form" onSubmit={handleSubmit}>
          <label className="field">
            <span>Название</span>
            <input
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

          <label className="field">
            <span>Описание</span>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Коротко, что нужно сделать."
              rows={4}
              maxLength={280}
            />
          </label>

          <div className="field-grid">
            <label className="field">
              <span>Приоритет</span>
              <select
                value={priority}
                onChange={(event) => setPriority(event.target.value as TaskPriority)}
              >
                <option value="low">Низкий</option>
                <option value="medium">Средний</option>
                <option value="high">Высокий</option>
              </select>
            </label>

            <label className="field">
              <span>Статус</span>
              <select
                value={status}
                onChange={(event) => setStatus(event.target.value as TaskStatus)}
              >
                <option value="backlog">Надо сделать</option>
                <option value="progress">В работе</option>
                <option value="done">Готово</option>
              </select>
            </label>
          </div>

          {error ? <p className="form-error">{error}</p> : null}

          <div className="modal__footer">
            <button className="button button--ghost" type="button" onClick={onClose}>
              Отмена
            </button>
            <button className="button button--primary" type="submit">
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
