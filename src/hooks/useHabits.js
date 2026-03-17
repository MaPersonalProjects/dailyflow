import { useState, useCallback, useEffect } from 'react'
import { getItem, setItem } from '../utils/storage.js'
import { getToday, getDayKey } from '../utils/dateHelpers.js'
import { subDays, format } from 'date-fns'
import { HABIT_PHASES } from '../constants.js'

const STORAGE_KEY = 'df_habits'

// ─── Module-level helpers ────────────────────────────────────────────────────

export function computePhase(totalWins) {
  for (let i = HABIT_PHASES.length - 1; i >= 0; i--) {
    if (totalWins >= HABIT_PHASES[i].minWins) return HABIT_PHASES[i]
  }
  return HABIT_PHASES[0]
}

export function isCompletedOnDate(habit, isoDate) {
  return habit.completions.some((c) => c.date === isoDate)
}

function computeMapMissedDays(habit, today) {
  const { targetDays = [], completions = [] } = habit
  const completionDates = new Set(completions.map((c) => c.date))
  let missed = 0
  let cursor = new Date(today + 'T12:00:00')

  for (let i = 0; i < 60; i++) {
    if (i === 0) {
      cursor = subDays(cursor, 1)
      continue
    }
    const dateStr = format(cursor, 'yyyy-MM-dd')
    const dayKey = getDayKey(cursor)

    if (!targetDays.includes(dayKey)) {
      cursor = subDays(cursor, 1)
      continue
    }

    if (completionDates.has(dateStr)) break

    missed++
    cursor = subDays(cursor, 1)
  }

  return missed
}

function migrateHabit(h) {
  const rawCompletions = h.completions ?? []
  const isOldFormat =
    rawCompletions.length > 0 && typeof rawCompletions[0] === 'string'

  const completions = isOldFormat
    ? rawCompletions.map((date) => ({ date, emotion: null }))
    : rawCompletions

  return {
    id: h.id,
    anchor: h.anchor ?? h.title ?? '',
    anchorCategory: h.anchorCategory ?? 'custom',
    behavior: h.behavior ?? h.title ?? '',
    behaviorSize: h.behaviorSize ?? 'tiny',
    celebration: h.celebration ?? 'fist-pump',
    celebrationCustom: h.celebrationCustom ?? '',
    stackId: h.stackId ?? null,
    stackOrder: h.stackOrder ?? null,
    completions,
    totalWins: h.totalWins ?? completions.length,
    targetDays: h.targetDays ?? ['mon', 'tue', 'wed', 'thu', 'fri'],
    color: h.color ?? 'blue',
    category: h.category ?? 'Personal',
    createdAt: h.createdAt ?? new Date().toISOString(),
    mapMissedDays: h.mapMissedDays ?? 0,
    mapCheckinDismissed: h.mapCheckinDismissed ?? null,
    mapLastChoice: h.mapLastChoice ?? null,
  }
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useHabits() {
  const [habits, setHabits] = useState(() =>
    getItem(STORAGE_KEY, []).map(migrateHabit)
  )

  const persist = useCallback((updater) => {
    setHabits((prev) => {
      const updated = typeof updater === 'function' ? updater(prev) : updater
      setItem(STORAGE_KEY, updated)
      return updated
    })
  }, [])

  const refreshMapMissedDays = useCallback(() => {
    const today = getToday()
    persist((prev) =>
      prev.map((h) => ({
        ...h,
        mapMissedDays: computeMapMissedDays(h, today),
      }))
    )
  }, [persist])

  useEffect(() => {
    refreshMapMissedDays()
  }, [refreshMapMissedDays])

  const addHabit = useCallback((data) => {
    const newHabit = migrateHabit({
      id: Date.now(),
      createdAt: new Date().toISOString(),
      completions: [],
      totalWins: 0,
      ...data,
    })
    persist((prev) => [...prev, newHabit])
    return newHabit
  }, [persist])

  const updateHabit = useCallback((id, changes) => {
    persist((prev) =>
      prev.map((h) => (h.id === id ? migrateHabit({ ...h, ...changes }) : h))
    )
  }, [persist])

  const deleteHabit = useCallback((id) => {
    persist((prev) => prev.filter((h) => h.id !== id))
  }, [persist])

  const bulkDeleteHabits = useCallback((ids) => {
    const idSet = new Set(ids.map(Number))
    persist((prev) => prev.filter((h) => !idSet.has(h.id)))
  }, [persist])

  const logCompletion = useCallback((habitId, date = getToday(), emotion = null) => {
    persist((prev) =>
      prev.map((h) => {
        if (h.id !== habitId) return h
        if (h.completions.some((c) => c.date === date)) return h
        const completions = [...h.completions, { date, emotion }]
        return { ...h, completions, totalWins: completions.length }
      })
    )
  }, [persist])

  const uncompleteToday = useCallback((habitId, date = getToday()) => {
    persist((prev) =>
      prev.map((h) => {
        if (h.id !== habitId) return h
        const completions = h.completions.filter((c) => c.date !== date)
        return { ...h, completions, totalWins: completions.length }
      })
    )
  }, [persist])

  const updateEmotion = useCallback((habitId, date, emotion) => {
    persist((prev) =>
      prev.map((h) => {
        if (h.id !== habitId) return h
        const completions = h.completions.map((c) =>
          c.date === date ? { ...c, emotion } : c
        )
        return { ...h, completions }
      })
    )
  }, [persist])

  const dismissMapCheckin = useCallback((habitId) => {
    const today = getToday()
    persist((prev) =>
      prev.map((h) =>
        h.id === habitId ? { ...h, mapCheckinDismissed: today } : h
      )
    )
  }, [persist])

  const recordMapResponse = useCallback((habitId, choice) => {
    persist((prev) =>
      prev.map((h) =>
        h.id === habitId ? { ...h, mapLastChoice: choice } : h
      )
    )
  }, [persist])

  const getPhase = useCallback((habit) => computePhase(habit.totalWins ?? 0), [])

  const getRecentEmotions = useCallback((habit, count = 10) => {
    return [...habit.completions]
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, count)
      .reverse()
  }, [])

  const habitNeedsMapCheckin = useCallback((habit, today = getToday()) => {
    if ((habit.mapMissedDays ?? 0) < 3) return false
    if (habit.mapCheckinDismissed === today) return false
    return true
  }, [])

  return {
    habits,
    addHabit,
    updateHabit,
    deleteHabit,
    logCompletion,
    uncompleteToday,
    updateEmotion,
    refreshMapMissedDays,
    dismissMapCheckin,
    recordMapResponse,
    getPhase,
    getRecentEmotions,
    habitNeedsMapCheckin,
    bulkDeleteHabits,
  }
}
