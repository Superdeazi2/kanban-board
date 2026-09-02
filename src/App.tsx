import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCorners,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { useMemo, useState } from 'react'
import { BoardColumn } from './components/BoardColumn'
import { ConfirmDialog } from './components/ConfirmDialog'
import { TaskGhost } from './components/TaskCard'
import { TaskModal } from './components/TaskModal'
import { seedBoard } from './data/seed'
import { usePersistentBoard } from './hooks/usePersistentBoard'
import {
  cloneBoard,
  createTaskId,
  findTaskLocation,
  getTask,
} from './lib/board'
import {
  TASK_STATUSES,
  type BoardState,
  type Task,
  type TaskDraft,
  type TaskPriority,
  type TaskStatus,
} from './types'

type ModalState =
  | { open: false }
  | { open: true; task: Task | null; initialStatus: TaskStatus }

function resolveTargetStatus(
  board: BoardState,
  overId: string,
): TaskStatus | null {
  if (overId.startsWith('column:')) {
    const status = overId.replace('column:', '') as TaskStatus
    return TASK_STATUSES.includes(status) ? status : null
  }

  return findTaskLocation(board, overId)?.status ?? null
}

function App() {
  const { board, setBoard } = usePersistentBoard()
  const [query, setQuery] = useState('')
  const [priority, setPriority] = useState<'all' | TaskPriority>('all')
  const [modal, setModal] = useState<ModalState>({ open: false })
  const [pendingDelete, setPendingDelete] = useState<Task | null>(null)
  const [resetOpen, setResetOpen] = useState(false)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [dragSnapshot, setDragSnapshot] = useState<BoardState | null>(null)

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 6,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 220,
        tolerance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const normalizedQuery = query.trim().toLowerCase()

  const filteredBoard = useMemo(() => {
    const next: BoardState = {
      backlog: [],
      progress: [],
      done: [],
    }

    for (const status of TASK_STATUSES) {
      next[status] = board[status].filter((task) => {
        const matchesPriority = priority === 'all' || task.priority === priority
        const searchable = `${task.title} ${task.description}`.toLowerCase()
        const matchesQuery = !normalizedQuery || searchable.includes(normalizedQuery)

        return matchesPriority && matchesQuery
      })
    }

    return next
  }, [board, normalizedQuery, priority])

  const totalTasks = TASK_STATUSES.reduce(
    (sum, status) => sum + board[status].length,
    0,
  )
  const doneTasks = board.done.length
  const visibleTasks = TASK_STATUSES.reduce(
    (sum, status) => sum + filteredBoard[status].length,
    0,
  )
  const activeTask = getTask(board, activeId)
  const filtersActive = Boolean(normalizedQuery) || priority !== 'all'

  const openCreate = (status: TaskStatus = 'backlog') => {
    setModal({ open: true, task: null, initialStatus: status })
  }

  const openEdit = (task: Task) => {
    setModal({ open: true, task, initialStatus: task.status })
  }

  const saveTask = (draft: TaskDraft) => {
    if (!modal.open) return

    const now = new Date().toISOString()

    if (!modal.task) {
      const task: Task = {
        id: createTaskId(),
        ...draft,
        createdAt: now,
        updatedAt: now,
      }

      setBoard((current) => ({
        ...current,
        [task.status]: [...current[task.status], task],
      }))
    } else {
      const original = modal.task

      setBoard((current) => {
        const location = findTaskLocation(current, original.id)
        if (!location) return current

        const updated: Task = {
          ...location.task,
          ...draft,
          updatedAt: now,
        }

        if (location.status === draft.status) {
          const tasks = [...current[location.status]]
          tasks[location.index] = updated

          return {
            ...current,
            [location.status]: tasks,
          }
        }

        const sourceTasks = current[location.status].filter(
          (task) => task.id !== original.id,
        )

        return {
          ...current,
          [location.status]: sourceTasks,
          [draft.status]: [...current[draft.status], updated],
        }
      })
    }

    setModal({ open: false })
  }

  const deleteTask = (task: Task) => {
    setBoard((current) => ({
      ...current,
      [task.status]: current[task.status].filter((item) => item.id !== task.id),
    }))
    setPendingDelete(null)
  }

  const moveAcrossColumns = (
    activeTaskId: string,
    targetStatus: TaskStatus,
    overId: string,
  ) => {
    setBoard((current) => {
      const source = findTaskLocation(current, activeTaskId)
      if (!source || source.status === targetStatus) return current

      const sourceTasks = [...current[source.status]]
      const [movingTask] = sourceTasks.splice(source.index, 1)
      const targetTasks = [...current[targetStatus]]

      const overIndex = targetTasks.findIndex((task) => task.id === overId)
      const insertAt = overIndex === -1 ? targetTasks.length : overIndex

      targetTasks.splice(insertAt, 0, {
        ...movingTask,
        status: targetStatus,
        updatedAt: new Date().toISOString(),
      })

      return {
        ...current,
        [source.status]: sourceTasks,
        [targetStatus]: targetTasks,
      }
    })
  }

  const handleDragStart = ({ active }: DragStartEvent) => {
    const id = String(active.id)
    setActiveId(id)
    setDragSnapshot(cloneBoard(board))
  }

  const handleDragOver = ({ active, over }: DragOverEvent) => {
    if (!over) return

    const activeTaskId = String(active.id)
    const source = findTaskLocation(board, activeTaskId)
    const targetStatus = resolveTargetStatus(board, String(over.id))

    if (!source || !targetStatus || source.status === targetStatus) return

    moveAcrossColumns(activeTaskId, targetStatus, String(over.id))
  }

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    setActiveId(null)
    setDragSnapshot(null)

    if (!over) return

    const activeTaskId = String(active.id)
    const overId = String(over.id)

    setBoard((current) => {
      const location = findTaskLocation(current, activeTaskId)
      if (!location) return current

      const targetStatus = resolveTargetStatus(current, overId)
      if (!targetStatus || targetStatus !== location.status) return current

      const tasks = [...current[targetStatus]]
      const oldIndex = tasks.findIndex((task) => task.id === activeTaskId)
      const overTaskIndex = tasks.findIndex((task) => task.id === overId)
      const newIndex = overTaskIndex === -1 ? tasks.length - 1 : overTaskIndex

      if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) {
        return current
      }

      return {
        ...current,
        [targetStatus]: arrayMove(tasks, oldIndex, newIndex),
      }
    })
  }

  const handleDragCancel = () => {
    if (dragSnapshot) setBoard(dragSnapshot)
    setActiveId(null)
    setDragSnapshot(null)
  }

  const resetDemo = () => {
    setBoard(cloneBoard(seedBoard))
    setQuery('')
    setPriority('all')
    setResetOpen(false)
  }

  return (
    <div className="app-shell">
      <header className="page-header">
        <div className="page-header__copy">
          <p className="page-header__eyebrow">Канбан-доска</p>
          <h1>Задачи под рукой</h1>
          <p className="page-header__lede">
            Простая доска для задач: быстро раскидать, что нужно сделать,
            что уже в работе и что готово.
          </p>
        </div>

        <div className="page-header__summary">
          <div className="summary-stat">
            <span>Всего</span>
            <strong>{totalTasks}</strong>
          </div>
          <div className="summary-stat">
            <span>Готово</span>
            <strong>{doneTasks}</strong>
          </div>
          <button
            className="button button--primary"
            type="button"
            onClick={() => openCreate('backlog')}
          >
            Новая задача
          </button>
        </div>
      </header>

      <main>
        <section className="toolbar" aria-label="Управление доской">
          <label className="search-control">
            <span className="search-control__label">Поиск</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Найти задачу"
              aria-label="Найти задачу"
            />
          </label>

          <div className="toolbar__right">
            <label className="select-control">
              <span>Приоритет</span>
              <select
                value={priority}
                onChange={(event) =>
                  setPriority(event.target.value as 'all' | TaskPriority)
                }
                aria-label="Фильтр по приоритету"
              >
                <option value="all">Все</option>
                <option value="high">Высокий</option>
                <option value="medium">Средний</option>
                <option value="low">Низкий</option>
              </select>
            </label>

            {filtersActive ? (
              <button
                className="button button--quiet"
                type="button"
                onClick={() => {
                  setQuery('')
                  setPriority('all')
                }}
              >
                Сбросить фильтры
              </button>
            ) : null}

            <button
              className="button button--ghost"
              type="button"
              onClick={() => setResetOpen(true)}
            >
              Вернуть демо
            </button>
          </div>
        </section>

        <div className="board-meta">
          <span>
            {filtersActive
              ? `Показано ${visibleTasks} из ${totalTasks}`
              : `Готово ${doneTasks} из ${totalTasks}`}
          </span>
          <span>Изменения сохраняются в браузере.</span>
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
        >
          <div className="board-grid">
            {TASK_STATUSES.map((status) => (
              <BoardColumn
                key={status}
                status={status}
                tasks={filteredBoard[status]}
                totalCount={board[status].length}
                onAdd={openCreate}
                onEdit={openEdit}
                onDelete={setPendingDelete}
              />
            ))}
          </div>

          <DragOverlay dropAnimation={{ duration: 180, easing: 'ease' }}>
            {activeTask ? <TaskGhost task={activeTask} /> : null}
          </DragOverlay>
        </DndContext>
      </main>

      <footer className="page-footer">
        <span className="page-footer__stack">React · TypeScript · dnd-kit</span>
        <a
          className="page-footer__portfolio"
          href="https://deazi-c87e25.gitlab.io/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Портфолио ↗
        </a>
      </footer>

      <TaskModal
        open={modal.open}
        task={modal.open ? modal.task : null}
        initialStatus={modal.open ? modal.initialStatus : 'backlog'}
        onClose={() => setModal({ open: false })}
        onSave={saveTask}
      />

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Удалить задачу?"
        description={
          pendingDelete
            ? `Задача «${pendingDelete.title}» будет удалена с доски.`
            : ''
        }
        confirmLabel="Удалить"
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          if (pendingDelete) deleteTask(pendingDelete)
        }}
      />

      <ConfirmDialog
        open={resetOpen}
        title="Сбросить демо?"
        description="Текущие изменения будут заменены исходными демонстрационными задачами."
        confirmLabel="Сбросить"
        onCancel={() => setResetOpen(false)}
        onConfirm={resetDemo}
      />
    </div>
  )
}

export default App
