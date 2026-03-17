import { useState, useCallback } from 'react'
import { getItem, setItem } from '../utils/storage.js'

const STORAGE_KEY = 'df_habit_stacks'

export function useHabitStacks() {
  const [stacks, setStacks] = useState(() => getItem(STORAGE_KEY, []))

  const persist = useCallback((updater) => {
    setStacks((prev) => {
      const updated = typeof updater === 'function' ? updater(prev) : updater
      setItem(STORAGE_KEY, updated)
      return updated
    })
  }, [])

  const addStack = useCallback((name) => {
    const newStack = {
      id: String(Date.now()),
      name,
      habitIds: [],
      createdAt: new Date().toISOString(),
    }
    persist((prev) => [...prev, newStack])
    return newStack
  }, [persist])

  const updateStack = useCallback((id, changes) => {
    persist((prev) => prev.map((s) => s.id === id ? { ...s, ...changes } : s))
  }, [persist])

  const deleteStack = useCallback((id) => {
    persist((prev) => prev.filter((s) => s.id !== id))
  }, [persist])

  const addHabitToStack = useCallback((stackId, habitId) => {
    persist((prev) => prev.map((s) => {
      if (s.id !== stackId) return s
      if (s.habitIds.includes(String(habitId))) return s
      return { ...s, habitIds: [...s.habitIds, String(habitId)] }
    }))
  }, [persist])

  const removeHabitFromStack = useCallback((stackId, habitId) => {
    persist((prev) => prev.map((s) => {
      if (s.id !== stackId) return s
      return { ...s, habitIds: s.habitIds.filter((id) => id !== String(habitId)) }
    }))
  }, [persist])

  const reorderStack = useCallback((stackId, fromIndex, toIndex) => {
    persist((prev) => prev.map((s) => {
      if (s.id !== stackId) return s
      const ids = [...s.habitIds]
      const [moved] = ids.splice(fromIndex, 1)
      ids.splice(toIndex, 0, moved)
      return { ...s, habitIds: ids }
    }))
  }, [persist])

  return { stacks, addStack, updateStack, deleteStack, addHabitToStack, removeHabitFromStack, reorderStack }
}
