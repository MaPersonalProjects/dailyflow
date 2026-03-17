import { useState, useCallback, useEffect, useRef } from 'react'
import { getItem, setItem } from '../utils/storage.js'
import { shouldTriggerToday, getNextOccurrence } from '../utils/recurrence.js'

const STORAGE_KEY = 'df_reminders'

export function useReminders() {
  const [reminders, setReminders] = useState(() => getItem(STORAGE_KEY, []))
  const intervalRef = useRef(null)

  const persist = useCallback((updater) => {
    setReminders((prev) => {
      const updated = typeof updater === 'function' ? updater(prev) : updater
      setItem(STORAGE_KEY, updated)
      return updated
    })
  }, [])

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }, [])

  const checkDue = useCallback(() => {
    const now = new Date()
    persist((prev) => prev.map((r) => {
      if (r.done || r.notified) return r
      const dt = new Date(r.datetime)
      if (dt <= now && shouldTriggerToday(r)) {
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('DailyFlow Reminder', {
            body: r.title,
            icon: '/vite.svg',
          })
        }
        return { ...r, notified: true }
      }
      return r
    }))
  }, [persist])

  useEffect(() => {
    intervalRef.current = setInterval(checkDue, 30000)
    return () => clearInterval(intervalRef.current)
  }, [checkDue])

  const addReminder = useCallback((data) => {
    const newReminder = {
      id: Date.now(),
      title: '',
      datetime: new Date().toISOString(),
      recurring: 'none',
      notified: false,
      done: false,
      ...data,
    }
    persist((prev) => [...prev, newReminder])
    return newReminder
  }, [persist])

  const updateReminder = useCallback((id, changes) => {
    persist((prev) => prev.map((r) => r.id === id ? { ...r, ...changes } : r))
  }, [persist])

  const deleteReminder = useCallback((id) => {
    persist((prev) => prev.filter((r) => r.id !== id))
  }, [persist])

  const bulkDeleteReminders = useCallback((ids) => {
    const idSet = new Set(ids.map(Number))
    persist((prev) => prev.filter((r) => !idSet.has(r.id)))
  }, [persist])

  const dismissReminder = useCallback((id) => {
    persist((prev) => prev.map((r) => {
      if (r.id !== id) return r
      if (r.recurring && r.recurring !== 'none') {
        const next = getNextOccurrence(r)
        return { ...r, datetime: next, notified: false }
      }
      return { ...r, done: true }
    }))
  }, [persist])

  return { reminders, addReminder, updateReminder, deleteReminder, dismissReminder, checkDue, bulkDeleteReminders }
}
