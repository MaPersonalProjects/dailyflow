import { parseISO, addDays, addWeeks, addMonths, format, isAfter, isBefore, startOfDay } from 'date-fns'
import { getToday, getDayKey } from './dateHelpers.js'

export function getNextOccurrence(reminder) {
  if (!reminder.recurring || reminder.recurring === 'none') return null

  const base = parseISO(reminder.datetime)
  const now = new Date()

  let next = new Date(base)
  let iterations = 0
  const maxIterations = 365

  while (!isAfter(next, now) && iterations < maxIterations) {
    if (reminder.recurring === 'daily') next = addDays(next, 1)
    else if (reminder.recurring === 'weekly') next = addWeeks(next, 1)
    else if (reminder.recurring === 'monthly') next = addMonths(next, 1)
    iterations++
  }

  return next.toISOString()
}

export function shouldTriggerToday(reminder) {
  if (!reminder || reminder.done) return false

  const today = getToday()

  if (!reminder.recurring || reminder.recurring === 'none') {
    return reminder.datetime && reminder.datetime.startsWith(today)
  }

  const base = parseISO(reminder.datetime)
  const todayDate = startOfDay(new Date())

  if (isBefore(todayDate, startOfDay(base))) return false

  if (reminder.recurring === 'daily') return true

  if (reminder.recurring === 'weekly') {
    const baseDayKey = getDayKey(base)
    const todayDayKey = getDayKey(new Date())
    return baseDayKey === todayDayKey
  }

  if (reminder.recurring === 'monthly') {
    return base.getDate() === new Date().getDate()
  }

  return false
}

export function expandRecurringEvents(event, startDate, endDate) {
  if (!event.recurring || event.recurring === 'none') {
    return [event]
  }

  const results = []
  const base = parseISO(event.date)
  let current = new Date(base)
  const end = new Date(endDate)

  let iterations = 0
  const maxIterations = 60

  while (!isAfter(current, end) && iterations < maxIterations) {
    if (!isBefore(current, new Date(startDate))) {
      results.push({
        ...event,
        date: format(current, 'yyyy-MM-dd'),
        id: `${event.id}_${format(current, 'yyyy-MM-dd')}`,
      })
    }

    if (event.recurring === 'daily') current = addDays(current, 1)
    else if (event.recurring === 'weekly') current = addWeeks(current, 1)
    else if (event.recurring === 'monthly') current = addMonths(current, 1)
    else break

    iterations++
  }

  return results
}
