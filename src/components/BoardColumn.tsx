import { useDroppable } from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { columnMeta } from '../lib/board'
import type { Task, TaskStatus } from '../types'
import { TaskCard } from './TaskCard'

type BoardColumnProps = {
  status: TaskStatus
  tasks: Task[]
  totalCount: number
  onAdd: (status: TaskStatus) => void
  onEdit: (task: Task) => void
  onDelete: (task: Task) => void
}

export function BoardColumn({
  status,
  tasks,
  totalCount,
  onAdd,
  onEdit,
  onDelete,
}: BoardColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: `column:${status}`,
    data: {
      type: 'column',
      status,
    },
  })

  const meta = columnMeta[status]
  const hasFilteredResults = tasks.length > 0

  return (
    <section
      ref={setNodeRef}
      className={`min-h-96 rounded-2xl border p-3 transition ${
        isOver
          ? 'border-indigo-300 bg-indigo-50'
          : 'border-slate-200 bg-slate-50'
      }`}
      aria-label={meta.title}
    >
      <header className="flex items-center justify-between gap-3 px-1 pb-3">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-semibold text-slate-900">
            {meta.title}
          </h2>
          <span
            className="grid min-h-6 min-w-6 place-items-center rounded-md bg-slate-200 px-1.5 text-xs font-bold text-slate-600"
            aria-label={`${totalCount} задач`}
          >
            {totalCount}
          </span>
        </div>

        <button
          className="min-h-8 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-600 transition duration-150 hover:-translate-y-0.5 hover:bg-slate-100 hover:shadow-sm active:translate-y-0 active:scale-95"
          type="button"
          onClick={() => onAdd(status)}
          aria-label={`Добавить задачу в колонку ${meta.title}`}
        >
          Добавить
        </button>
      </header>

      <SortableContext
        items={tasks.map((task) => task.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex min-h-80 flex-col gap-2.5">
          {hasFilteredResults ? (
            tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))
          ) : (
            <div className="grid min-h-24 place-items-center rounded-xl border border-dashed border-slate-300 bg-white p-4 text-center text-xs text-slate-400">
              <span>{totalCount === 0 ? meta.empty : 'Ничего не найдено.'}</span>
            </div>
          )}
        </div>
      </SortableContext>

      <button
        className="mt-2.5 min-h-9 w-full rounded-lg border border-dashed border-transparent text-xs font-semibold text-slate-500 transition duration-150 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 active:scale-[0.98]"
        type="button"
        onClick={() => onAdd(status)}
      >
        Добавить задачу
      </button>
    </section>
  )
}
