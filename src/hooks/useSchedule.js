import { useState, useCallback, useEffect } from 'react'
import { getItem, setItem } from '../utils/storage.js'
import { expandRecurringEvents } from '../utils/recurrence.js'
import { addDays, toISODate } from '../utils/dateHelpers.js'

const STORAGE_KEY = 'df_schedule'

export function useSchedule() {
  const [events, setEvents] = useState(() => getItem(STORAGE_KEY, []))

  useEffect(() => {
    setItem(STORAGE_KEY, events)
  }, [events])

  const addEvent = useCallback((data) => {
    const newEvent = {
      id: Date.now(),
      title: '',
      date: '',
      startTime: '',
      endTime: '',
      type: 'event',
      color: 'blue',
      notes: '',
      recurring: 'none',
      ...data,
    }
    setEvents((prev) => [...prev, newEvent])
    return newEvent
  }, [])

  const updateEvent = useCallback((id, changes) => {
    setEvents((prev) => prev.map((e) => e.id === id ? { ...e, ...changes } : e))
  }, [])

  const deleteEvent = useCallback((id) => {
    // Handle both real ids and virtual recurring ids like "123_2024-01-01"
    const realId = typeof id === 'string' && id.includes('_')
      ? parseInt(id.split('_')[0], 10)
      : id
    setEvents((prev) => prev.filter((e) => e.id !== realId))
  }, [])

  const getEventsForDate = useCallback((isoDate) => {
    const dayStart = isoDate
    const dayEnd = isoDate
    return events.flatMap((e) => expandRecurringEvents(e, dayStart, dayEnd))
      .filter((e) => e.date === isoDate)
      .sort((a, b) => a.startTime.localeCompare(b.startTime))
  }, [events])

  const getEventsForWeek = useCallback((weekStartDate) => {
    const start = toISODate(weekStartDate)
    const end = toISODate(addDays(weekStartDate, 6))
    return events.flatMap((e) => expandRecurringEvents(e, start, end))
      .filter((e) => e.date >= start && e.date <= end)
      .sort((a, b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime))
  }, [events])

  const bulkDeleteEvents = useCallback((ids) => {
    const realIds = new Set(ids.map((id) => {
      if (typeof id === 'string' && id.includes('_')) return parseInt(id.split('_')[0], 10)
      return Number(id)
    }))
    setEvents((prev) => prev.filter((e) => !realIds.has(e.id)))
  }, [])

  const bulkAddEvents = useCallback((eventsData) => {
    const now = Date.now()
    const newEvents = eventsData.map((data, i) => ({
      id: now + i,
      title: '',
      date: '',
      startTime: '',
      endTime: '',
      type: 'block',
      color: 'blue',
      notes: '',
      recurring: 'none',
      ...data,
    }))
    setEvents((prev) => [...prev, ...newEvents])
    return newEvents
  }, [])

  return { events, addEvent, updateEvent, deleteEvent, getEventsForDate, getEventsForWeek, bulkAddEvents, bulkDeleteEvents }
}
