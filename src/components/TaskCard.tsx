import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { CSSProperties } from 'react'
import { priorityLabel } from '../lib/board'
import type { Task } from '../types'

type TaskCardProps = {
  task: Task
  onEdit: (task: Task) => void
  onDelete: (task: Task) => void
}

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: 'task',
      status: task.status,
    },
  })

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <article
      ref={setNodeRef}
      style={style}
      className={`task-card${isDragging ? ' task-card--dragging' : ''}`}
    >
      <div className="task-card__topline">
        <span className={`priority priority--${task.priority}`}>
          <span className="priority__dot" aria-hidden="true" />
          {priorityLabel[task.priority]}
        </span>

        <div className="task-card__actions">
          <button
            className="text-action"
            type="button"
            onClick={() => onEdit(task)}
            aria-label={`Редактировать: ${task.title}`}
          >
            Изм.
          </button>
          <button
            className="text-action text-action--danger"
            type="button"
            onClick={() => onDelete(task)}
            aria-label={`Удалить: ${task.title}`}
          >
            Удалить
          </button>
          <button
            className="drag-handle"
            type="button"
            {...attributes}
            {...listeners}
            aria-label={`Перетащить: ${task.title}`}
            title="Перетащить"
          >
            ≡
          </button>
        </div>
      </div>

      <div className="task-card__copy">
        <h3>{task.title}</h3>
        {task.description ? <p>{task.description}</p> : null}
      </div>
    </article>
  )
}

export function TaskGhost({ task }: { task: Task }) {
  return (
    <article className="task-card task-card--overlay">
      <div className="task-card__topline">
        <span className={`priority priority--${task.priority}`}>
          <span className="priority__dot" aria-hidden="true" />
          {priorityLabel[task.priority]}
        </span>
        <span className="drag-handle drag-handle--ghost" aria-hidden="true">
          ≡
        </span>
      </div>
      <div className="task-card__copy">
        <h3>{task.title}</h3>
        {task.description ? <p>{task.description}</p> : null}
      </div>
    </article>
  )
}
