import { useState, useCallback, useEffect } from 'react'
import { getItem, setItem } from '../utils/storage.js'
import { getToday, getDayKey } from '../utils/dateHelpers.js'
import { parseISO, differenceInCalendarDays } from 'date-fns'

const STORAGE_KEY = 'df_tasks'

const WEEKDAYS = new Set(['mon', 'tue', 'wed', 'thu', 'fri'])

/** Returns true if a task should appear on the given ISO date. */
export function isTaskDueOn(task, isoDate) {
  const { recurring = 'none', recurringDays = [], dueDate, createdAt } = task

  // Non-recurring tasks have no due date — always show until completed
  if (recurring === 'none') return true

  // Use dueDate as anchor if set, otherwise fall back to creation date
  const anchor = dueDate || createdAt?.split('T')[0]

  // Don't show before the anchor date
  if (anchor && isoDate < anchor) return false

  const date = parseISO(isoDate)
  const dayKey = getDayKey(date)

  switch (recurring) {
    case 'daily':
      return true
    case 'weekdays':
      return WEEKDAYS.has(dayKey)
    case 'custom':
      return recurringDays.includes(dayKey)
    case 'weekly': {
      const startDay = anchor ? getDayKey(parseISO(anchor)) : dayKey
      return dayKey === startDay
    }
    case 'every-other-day': {
      if (!anchor) return true
      const diff = differenceInCalendarDays(date, parseISO(anchor))
      return diff >= 0 && diff % 2 === 0
    }
    case 'monthly': {
      const anchorDay = anchor ? parseISO(anchor).getDate() : date.getDate()
      return date.getDate() === anchorDay
    }
    default:
      return false
  }
}

/** Returns true if the task is completed on the given date. */
export function isTaskCompletedOn(task, isoDate) {
  if (!task.recurring || task.recurring === 'none') return !!task.completed
  return (task.completions ?? []).includes(isoDate)
}

const TASK_DEFAULTS = {
  title: '',
  notes: '',
  priority: 'medium',
  category: 'Personal',
  dueDate: '',
  dueTime: '',
  recurring: 'none',
  recurringDays: [],
  completions: [],
  completed: false,
  skipped: false,
  completedAt: null,
}

export function useTasks() {
  const [tasks, setTasks] = useState(() => getItem(STORAGE_KEY, []))

  useEffect(() => {
    setItem(STORAGE_KEY, tasks)
  }, [tasks])

  const addTask = useCallback((data) => {
    const newTask = {
      ...TASK_DEFAULTS,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      ...data,
    }
    setTasks((prev) => [...prev, newTask])
    return newTask
  }, [])

  const updateTask = useCallback((id, changes) => {
    setTasks((prev) => prev.map((t) => t.id === id ? { ...t, ...changes } : t))
  }, [])

  const deleteTask = useCallback((id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }, [])

  /**
   * Toggle completion.
   * - Non-recurring: flips `completed` boolean (date ignored).
   * - Recurring: adds/removes `date` from `completions[]`.
   */
  const toggleComplete = useCallback((id, date = getToday()) => {
    setTasks((prev) => prev.map((t) => {
      if (t.id !== id) return t

      if (!t.recurring || t.recurring === 'none') {
        const completed = !t.completed
        return { ...t, completed, completedAt: completed ? new Date().toISOString() : null }
      }

      const completions = t.completions ?? []
      const newCompletions = completions.includes(date)
        ? completions.filter((d) => d !== date)
        : [...completions, date]
      return { ...t, completions: newCompletions }
    }))
  }, [])

  const skipTask = useCallback((id) => {
    setTasks((prev) => prev.map((t) => {
      if (t.id !== id) return t
      return { ...t, completed: true, skipped: true, completedAt: new Date().toISOString() }
    }))
  }, [])

  const reorderTasks = useCallback((startIndex, endIndex) => {
    setTasks((prev) => {
      const result = Array.from(prev)
      const [removed] = result.splice(startIndex, 1)
      result.splice(endIndex, 0, removed)
      return result
    })
  }, [])

  const bulkDeleteTasks = useCallback((ids) => {
    const idSet = new Set(ids.map(Number))
    setTasks((prev) => prev.filter((t) => !idSet.has(t.id)))
  }, [])

  const bulkAddTasks = useCallback((tasksData) => {
    const now = Date.now()
    const newTasks = tasksData.map((data, i) => ({
      ...TASK_DEFAULTS,
      id: now + i,
      createdAt: new Date().toISOString(),
      ...data,
    }))
    setTasks((prev) => [...prev, ...newTasks])
    return newTasks
  }, [])

  return { tasks, addTask, updateTask, deleteTask, toggleComplete, skipTask, reorderTasks, bulkAddTasks, bulkDeleteTasks, isTaskDueOn, isTaskCompletedOn }
}
