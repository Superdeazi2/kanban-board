export const TASK_STATUSES = ['backlog', 'progress', 'done'] as const
export const TASK_PRIORITIES = ['low', 'medium', 'high'] as const

export type TaskStatus = (typeof TASK_STATUSES)[number]
export type TaskPriority = (typeof TASK_PRIORITIES)[number]

export type Task = {
  id: string
  title: string
  description: string
  priority: TaskPriority
  status: TaskStatus
  createdAt: string
  updatedAt: string
}

export type BoardState = Record<TaskStatus, Task[]>

export type TaskDraft = Pick<Task, 'title' | 'description' | 'priority' | 'status'>
