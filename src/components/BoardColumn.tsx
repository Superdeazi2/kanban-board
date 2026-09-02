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
      className={`board-column${isOver ? ' board-column--over' : ''}`}
      aria-label={`${meta.title}`}
    >
      <header className="board-column__header">
        <div className="board-column__title-row">
          <h2>{meta.title}</h2>
          <span className="count-badge" aria-label={`${totalCount} задач`}>
            {totalCount}
          </span>
        </div>

        <button
          className="column-add"
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
        <div className="board-column__list">
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
            <div className="empty-state">
              <span>{totalCount === 0 ? meta.empty : 'Ничего не найдено.'}</span>
            </div>
          )}
        </div>
      </SortableContext>

      <button
        className="add-task-row"
        type="button"
        onClick={() => onAdd(status)}
      >
        Добавить задачу
      </button>
    </section>
  )
}
