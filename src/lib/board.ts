import type { BoardState, Task, TaskPriority, TaskStatus } from '../types'

export const columnMeta: Record<TaskStatus, { title: string; empty: string }> = {
  backlog: {
    title: 'Надо сделать',
    empty: 'Пока пусто.',
  },
  progress: {
    title: 'В работе',
    empty: 'Здесь пока нет задач.',
  },
  done: {
    title: 'Готово',
    empty: 'Пока ничего не завершено.',
  },
}

export const priorityLabel: Record<TaskPriority, string> = {
  low: 'Низкий',
  medium: 'Средний',
  high: 'Высокий',
}

export function findTaskLocation(board: BoardState, taskId: string) {
  const statuses = Object.keys(board) as TaskStatus[]

  for (const status of statuses) {
    const index = board[status].findIndex((task) => task.id === taskId)
    if (index !== -1) {
      return { status, index, task: board[status][index] }
    }
  }

  return null
}

export function getTask(board: BoardState, taskId: string | null): Task | null {
  if (!taskId) return null
  return findTaskLocation(board, taskId)?.task ?? null
}

export function createTaskId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }

  return `task-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

export function cloneBoard(board: BoardState): BoardState {
  return {
    backlog: [...board.backlog],
    progress: [...board.progress],
    done: [...board.done],
  }
}
