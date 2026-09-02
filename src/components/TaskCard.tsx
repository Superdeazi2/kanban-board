import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { CSSProperties } from 'react'
import { priorityLabel } from '../lib/board'
import type { Task, TaskPriority } from '../types'

type TaskCardProps = {
  task: Task
  onEdit: (task: Task) => void
  onDelete: (task: Task) => void
}

const priorityStyles: Record<
  TaskPriority,
  { badge: string; dot: string }
> = {
  high: {
    badge: 'bg-rose-50 text-rose-700',
    dot: 'bg-rose-500',
  },
  medium: {
    badge: 'bg-amber-50 text-amber-700',
    dot: 'bg-amber-500',
  },
  low: {
    badge: 'bg-emerald-50 text-emerald-700',
    dot: 'bg-emerald-500',
  },
}

function PriorityBadge({ task }: { task: Task }) {
  const styles = priorityStyles[task.priority]

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-semibold ${styles.badge}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${styles.dot}`}
        aria-hidden="true"
      />
      {priorityLabel[task.priority]}
    </span>
  )
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
      className={`rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition duration-150 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md ${
        isDragging ? 'opacity-40' : ''
      }`}
    >
      <div className="flex min-h-7 items-center justify-between gap-2">
        <PriorityBadge task={task} />

        <div className="flex items-center gap-1">
          <button
            className="min-h-7 rounded-md px-2 text-xs font-medium text-slate-500 transition duration-150 hover:bg-slate-100 hover:text-slate-800 active:scale-90"
            type="button"
            onClick={() => onEdit(task)}
            aria-label={`Редактировать: ${task.title}`}
          >
            Изм.
          </button>

          <button
            className="min-h-7 rounded-md px-2 text-xs font-medium text-slate-500 transition duration-150 hover:bg-rose-50 hover:text-rose-600 active:scale-90"
            type="button"
            onClick={() => onDelete(task)}
            aria-label={`Удалить: ${task.title}`}
          >
            Удалить
          </button>

          <button
            className="min-h-7 min-w-7 touch-none cursor-grab rounded-md px-2 text-sm font-bold text-slate-400 transition duration-150 hover:bg-slate-100 hover:text-slate-700 active:scale-90 active:cursor-grabbing"
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

      <div className="pt-2">
        <h3 className="text-sm font-semibold leading-5 text-slate-800">
          {task.title}
        </h3>
        {task.description ? (
          <p className="mt-1.5 text-xs leading-5 text-slate-500">
            {task.description}
          </p>
        ) : null}
      </div>
    </article>
  )
}

export function TaskGhost({ task }: { task: Task }) {
  return (
    <article className="w-80 rounded-xl border border-slate-200 bg-white p-3 shadow-xl">
      <div className="flex min-h-7 items-center justify-between gap-2">
        <PriorityBadge task={task} />
        <span
          className="min-h-7 min-w-7 rounded-md px-2 text-sm font-bold text-slate-400"
          aria-hidden="true"
        >
          ≡
        </span>
      </div>

      <div className="pt-2">
        <h3 className="text-sm font-semibold leading-5 text-slate-800">
          {task.title}
        </h3>
        {task.description ? (
          <p className="mt-1.5 text-xs leading-5 text-slate-500">
            {task.description}
          </p>
        ) : null}
      </div>
    </article>
  )
}
