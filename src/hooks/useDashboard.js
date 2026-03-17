import { useMemo } from 'react'
import { getToday, getTodayDayKey, isOverdue } from '../utils/dateHelpers.js'
import { isTaskDueOn, isTaskCompletedOn } from './useTasks.js'

export function useDashboard({ tasks, events, habits, reminders }) {
  const today = getToday()
  const todayDayKey = getTodayDayKey()

  const todaysTasks = useMemo(
    () => tasks.filter((t) => isTaskDueOn(t, today) || (!t.dueDate && !t.recurring && !t.completed)),
    [tasks, today]
  )

  const upcomingEvents = useMemo(() => {
    const now = new Date()
    return events
      .filter((e) => {
        if (e.date < today) return false
        if (e.date === today) {
          return !e.endTime || e.endTime >= `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
        }
        return true
      })
      .sort((a, b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime))
      .slice(0, 5)
  }, [events, today])

  const todaysHabits = useMemo(
    () => habits.filter((h) => h.targetDays.includes(todayDayKey)),
    [habits, todayDayKey]
  )

  const overdueReminders = useMemo(
    () => reminders.filter((r) => !r.done && isOverdue(r.datetime?.split('T')[0])),
    [reminders]
  )

  const habitCompletionRate = useMemo(() => {
    if (todaysHabits.length === 0) return 0
    const completed = todaysHabits.filter((h) =>
      h.completions.some((c) => c.date === today)
    ).length
    return completed / todaysHabits.length
  }, [todaysHabits, today])

  const totalWinsToday = useMemo(
    () => habits.filter((h) => h.completions.some((c) => c.date === today)).length,
    [habits, today]
  )

  return { todaysTasks, upcomingEvents, todaysHabits, overdueReminders, habitCompletionRate, totalWinsToday }
}
