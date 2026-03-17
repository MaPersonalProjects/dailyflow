import { format, isAfter, parseISO, startOfDay, isValid } from 'date-fns'

export function getToday() {
  return format(new Date(), 'yyyy-MM-dd')
}

export function isOverdue(dueDate) {
  if (!dueDate) return false
  try {
    const due = startOfDay(parseISO(dueDate))
    const today = startOfDay(new Date())
    return isAfter(today, due)
  } catch {
    return false
  }
}

export function formatTime(timeStr) {
  if (!timeStr) return ''
  try {
    const [hours, minutes] = timeStr.split(':').map(Number)
    const date = new Date()
    date.setHours(hours, minutes, 0, 0)
    return format(date, 'h:mm a')
  } catch {
    return timeStr
  }
}

export function formatDate(isoDate) {
  if (!isoDate) return ''
  try {
    const date = parseISO(isoDate)
    if (!isValid(date)) return isoDate
    return format(date, 'MMM d, yyyy')
  } catch {
    return isoDate
  }
}

export function formatDateShort(isoDate) {
  if (!isoDate) return ''
  try {
    const date = parseISO(isoDate)
    if (!isValid(date)) return isoDate
    return format(date, 'MMM d')
  } catch {
    return isoDate
  }
}

export function groupByDay(items, dateKey) {
  return items.reduce((groups, item) => {
    const day = item[dateKey] ? item[dateKey].split('T')[0] : 'unknown'
    if (!groups[day]) groups[day] = []
    groups[day].push(item)
    return groups
  }, {})
}

export function getDayKey(date) {
  const keys = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']
  return keys[date.getDay()]
}

export function getTodayDayKey() {
  return getDayKey(new Date())
}

export function getWeekStart(date = new Date()) {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  d.setDate(diff)
  d.setHours(0, 0, 0, 0)
  return d
}

export function addDays(date, days) {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

export function toISODate(date) {
  return format(date, 'yyyy-MM-dd')
}

// 'HH:mm' → total minutes from midnight (e.g. '09:30' → 570)
export function getMinutesFromMidnight(timeStr) {
  const [h, m] = timeStr.split(':').map(Number)
  return h * 60 + m
}

// '09:00', '10:30' → '1 hr 30 min' | '45 min'
export function formatDuration(startTime, endTime) {
  const mins = getMinutesFromMidnight(endTime) - getMinutesFromMidnight(startTime)
  if (mins < 60) return `${mins} min`
  const h = Math.floor(mins / 60), m = mins % 60
  return m === 0 ? `${h} hr` : `${h} hr ${m} min`
}
