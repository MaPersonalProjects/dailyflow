import { useState, useEffect, useMemo } from 'react'
import { format } from 'date-fns'
import { expandRecurringEvents } from '../utils/recurrence.js'
import { getToday, getMinutesFromMidnight } from '../utils/dateHelpers.js'
import { EVENT_COLORS, CATEGORY_COLORS } from '../constants.js'
import { isTaskDueOn, isTaskCompletedOn } from './useTasks.js'

function getColorHex(colorKey) {
  const found = EVENT_COLORS.find((c) => c.key === colorKey)
  return found ? found.hex : '#6b7280'
}

function getCategoryHex(category) {
  return CATEGORY_COLORS[category]?.hex ?? '#6b7280'
}

function computeGlowStates(timedItems, nowMins) {
  let currentIndex = -1

  for (let i = 0; i < timedItems.length; i++) {
    const item = timedItems[i]
    if (item.completed || item.skipped) continue

    if (item.itemType === 'event') {
      const startMins = getMinutesFromMidnight(item.startTime)
      const endMins = getMinutesFromMidnight(item.endTime)
      if (nowMins >= startMins && nowMins <= endMins) {
        currentIndex = i
        break
      }
    } else {
      // task: current if within 15 min of dueTime
      const dueMins = getMinutesFromMidnight(item.dueTime)
      if (Math.abs(nowMins - dueMins) <= 15) {
        currentIndex = i
        break
      }
    }
  }

  return timedItems.map((item, i) => {
    if (item.completed || item.skipped) return { ...item, glowState: 'done' }

    const itemMins = item.itemType === 'event'
      ? getMinutesFromMidnight(item.startTime)
      : getMinutesFromMidnight(item.dueTime)

    if (currentIndex === -1) {
      // No current item — items in past are 'past', future are 'future'
      return { ...item, glowState: itemMins <= nowMins ? 'past' : 'future' }
    }

    if (i < currentIndex) return { ...item, glowState: 'past' }
    if (i === currentIndex) return { ...item, glowState: 'current' }
    if (i === currentIndex + 1) return { ...item, glowState: 'next' }
    if (i === currentIndex + 2) return { ...item, glowState: 'upcoming2' }
    if (i === currentIndex + 3) return { ...item, glowState: 'upcoming3' }
    return { ...item, glowState: 'future' }
  })
}

function buildFreeGaps(timedItems) {
  const gaps = []
  for (let i = 0; i < timedItems.length - 1; i++) {
    const curr = timedItems[i]
    const next = timedItems[i + 1]

    const currEndTime = curr.itemType === 'event' ? curr.endTime : curr.dueTime
    const nextStartTime = next.itemType === 'event' ? next.startTime : next.dueTime

    if (!currEndTime || !nextStartTime) continue

    const gapMins = getMinutesFromMidnight(nextStartTime) - getMinutesFromMidnight(currEndTime)
    if (gapMins > 5) {
      gaps.push({ afterIndex: i, fromTime: currEndTime, untilTime: nextStartTime })
    }
  }
  return gaps
}

export function useTodayPanel(tasks, events) {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30_000)
    return () => clearInterval(id)
  }, [])

  const today = getToday()

  const todayEvents = useMemo(() => {
    return events
      .flatMap((e) => expandRecurringEvents(e, today, today))
      .filter((e) => e.date === today)
      .sort((a, b) => a.startTime.localeCompare(b.startTime))
  }, [events, today])

  // Tasks visible today: recurring ones due today, non-recurring ones not yet completed
  const todayTasks = useMemo(() => {
    return tasks.filter((t) => isTaskDueOn(t, today))
  }, [tasks, today])

  const timedTasks = useMemo(() => {
    return todayTasks.filter((t) => t.dueTime)
  }, [todayTasks])

  const unscheduledTasks = useMemo(() => {
    return todayTasks.filter((t) => !t.dueTime && !isTaskCompletedOn(t, today) && !t.skipped)
  }, [todayTasks, today])

  const nowMins = getMinutesFromMidnight(format(now, 'HH:mm'))

  const rawTimedItems = useMemo(() => {
    const eventItems = todayEvents.map((e) => ({
      id: e.id,
      itemType: 'event',
      title: e.title,
      startTime: e.startTime,
      endTime: e.endTime,
      dueTime: null,
      colorHex: getColorHex(e.color),
      colorKey: e.color,
      category: null,
      completed: false,
      skipped: false,
      notes: e.notes,
      originalItem: e,
    }))

    const taskItems = timedTasks.map((t) => ({
      id: t.id,
      itemType: 'task',
      title: t.title,
      startTime: t.dueTime,
      endTime: null,
      dueTime: t.dueTime,
      colorHex: getCategoryHex(t.category),
      colorKey: null,
      category: t.category,
      completed: isTaskCompletedOn(t, today),
      skipped: t.skipped ?? false,
      notes: t.notes,
      originalItem: t,
    }))

    return [...eventItems, ...taskItems].sort((a, b) => {
      const aTime = a.startTime || a.dueTime || ''
      const bTime = b.startTime || b.dueTime || ''
      return aTime.localeCompare(bTime)
    })
  }, [todayEvents, timedTasks])

  const timedItems = useMemo(
    () => computeGlowStates(rawTimedItems, nowMins),
    [rawTimedItems, nowMins]
  )

  const freeGaps = useMemo(() => buildFreeGaps(timedItems), [timedItems])

  const currentIndex = timedItems.findIndex((item) => item.glowState === 'current')

  return { timedItems, unscheduledTasks, freeGaps, currentIndex, now }
}
