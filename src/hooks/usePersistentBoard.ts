import { useEffect, useState } from 'react'
import { seedBoard } from '../data/seed'
import type { BoardState, TaskStatus } from '../types'

const STORAGE_KEY = 'kanban-board:v1'
const statuses: TaskStatus[] = ['backlog', 'progress', 'done']

function isBoardState(value: unknown): value is BoardState {
  if (!value || typeof value !== 'object') return false

  const record = value as Record<string, unknown>

  return statuses.every((status) => {
    const tasks = record[status]
    return Array.isArray(tasks)
  })
}

function readBoard(): BoardState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) return seedBoard

    const parsed: unknown = JSON.parse(saved)
    return isBoardState(parsed) ? parsed : seedBoard
  } catch {
    return seedBoard
  }
}

export function usePersistentBoard() {
  const [board, setBoard] = useState<BoardState>(readBoard)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(board))
  }, [board])

  return { board, setBoard }
}
