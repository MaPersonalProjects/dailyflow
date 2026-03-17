import { useState } from 'react'
import { format } from 'date-fns'
import { useSchedule } from '../../hooks/useSchedule.js'
import { useRemindersContext } from '../../contexts/RemindersContext.jsx'
import { DayView } from './DayView.jsx'
import { WeekView } from './WeekView.jsx'
import { EventForm } from './EventForm.jsx'
import { ImportModal } from '../import/ImportModal.jsx'
import { BulkBar } from '../common/BulkBar.jsx'
import { getWeekStart, addDays, toISODate } from '../../utils/dateHelpers.js'

const buildEventDatetime = (ev) => {
  if (!ev.date || !ev.startTime) return null
  return new Date(`${ev.date}T${ev.startTime}`).toISOString()
}

const toRealId = (id) =>
  typeof id === 'string' && id.includes('_') ? parseInt(id.split('_')[0], 10) : Number(id)

export function Schedule() {
  const { addEvent, updateEvent, deleteEvent, getEventsForDate, getEventsForWeek, bulkAddEvents, bulkDeleteEvents } = useSchedule()
  const { reminders, addReminder, updateReminder, deleteReminder } = useRemindersContext()
  const [view, setView] = useState('day')
  const [currentDate, setCurrentDate] = useState(new Date())
  const [showForm, setShowForm] = useState(false)
  const [showImport, setShowImport] = useState(false)
  const [editingEvent, setEditingEvent] = useState(null)
  const [defaultTime, setDefaultTime] = useState('')
  const [defaultDate, setDefaultDate] = useState('')
  const [selectMode, setSelectMode] = useState(false)
  const [selectedIds, setSelectedIds] = useState(new Set())

  const isoToday = toISODate(currentDate)
  const weekStart = getWeekStart(currentDate)

  const dayEvents = getEventsForDate(isoToday)
  const weekEvents = getEventsForWeek(weekStart)

  const handleAdd = (timeOrDate, time) => {
    if (view === 'day') {
      setDefaultTime(timeOrDate)
      setDefaultDate(isoToday)
    } else {
      setDefaultDate(timeOrDate)
      setDefaultTime(time || '')
    }
    setEditingEvent(null)
    setShowForm(true)
  }

  const handleEdit = (event) => {
    const realId = toRealId(event.id)
    const hasLinkedReminder = reminders.some((r) => toRealId(r.sourceId) === realId && r.sourceType === 'event')
    setEditingEvent({ ...event, addToReminder: hasLinkedReminder })
    setShowForm(true)
  }

  const handleSubmit = (data) => {
    const formData = defaultTime && !data.startTime ? { ...data, startTime: defaultTime } : data
    if (editingEvent) {
      const realId = toRealId(editingEvent.id)
      updateEvent(realId, formData)
      const updatedEvent = { ...editingEvent, ...formData }
      const datetime = buildEventDatetime(updatedEvent)
      const linked = reminders.find((r) => toRealId(r.sourceId) === realId && r.sourceType === 'event')
      if (data.addToReminder) {
        if (linked) {
          updateReminder(linked.id, { title: updatedEvent.title, datetime, notified: false })
        } else if (datetime) {
          addReminder({ title: updatedEvent.title, datetime, recurring: 'none', sourceId: realId, sourceType: 'event', notified: false, done: false })
        }
      } else if (linked) {
        deleteReminder(linked.id)
      }
    } else {
      const newEvent = addEvent(formData)
      if (data.addToReminder) {
        const datetime = buildEventDatetime(newEvent)
        if (datetime) {
          addReminder({ title: newEvent.title, datetime, recurring: 'none', sourceId: newEvent.id, sourceType: 'event', notified: false, done: false })
        }
      }
    }
    setShowForm(false)
    setEditingEvent(null)
    setDefaultTime('')
    setDefaultDate('')
  }

  const toggleSelect = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const exitSelectMode = () => {
    setSelectMode(false)
    setSelectedIds(new Set())
  }

  const handleDelete = (id) => {
    const realId = toRealId(id)
    const linked = reminders.find((r) => toRealId(r.sourceId) === realId && r.sourceType === 'event')
    if (linked) deleteReminder(linked.id)
    deleteEvent(id)
  }

  const handleBulkDelete = () => {
    const ids = [...selectedIds]
    ids.forEach((id) => {
      const realId = toRealId(id)
      const linked = reminders.find((r) => toRealId(r.sourceId) === realId && r.sourceType === 'event')
      if (linked) deleteReminder(linked.id)
    })
    bulkDeleteEvents(ids)
    exitSelectMode()
  }

  const navigate = (dir) => {
    if (view === 'day') {
      setCurrentDate((d) => addDays(d, dir))
    } else {
      setCurrentDate((d) => addDays(d, dir * 7))
    }
  }

  const navLabel = view === 'day'
    ? format(currentDate, 'EEEE, MMMM d, yyyy')
    : `${format(weekStart, 'MMM d')} – ${format(addDays(weekStart, 6), 'MMM d, yyyy')}`

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <button onClick={() => navigate(-1)} className="p-1.5 rounded hover:bg-gray-100 text-gray-600">◀</button>
          <span className="text-sm font-medium text-gray-700 min-w-[200px] text-center">{navLabel}</span>
          <button onClick={() => navigate(1)} className="p-1.5 rounded hover:bg-gray-100 text-gray-600">▶</button>
          <button
            onClick={() => setCurrentDate(new Date())}
            className="text-xs text-indigo-600 hover:underline ml-1"
          >Today</button>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-md border border-gray-300 overflow-hidden">
            <button
              onClick={() => setView('day')}
              className={`px-3 py-1.5 text-sm ${view === 'day' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
            >Day</button>
            <button
              onClick={() => setView('week')}
              className={`px-3 py-1.5 text-sm border-l border-gray-300 ${view === 'week' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
            >Week</button>
          </div>
          <button
            onClick={() => setShowImport(true)}
            className="border border-gray-300 text-gray-600 px-3 py-1.5 rounded-md text-sm font-medium hover:bg-gray-50"
          >↑ Import</button>
          <button
            onClick={() => setSelectMode((v) => !v)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium border transition-colors ${
              selectMode
                ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                : 'border-gray-300 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {selectMode ? 'Selecting…' : 'Select'}
          </button>
          <button
            onClick={() => { setEditingEvent(null); setDefaultDate(isoToday); setDefaultTime(''); setShowForm(true) }}
            className="bg-indigo-600 text-white px-3 py-1.5 rounded-md text-sm font-medium hover:bg-indigo-700"
          >+ Add Event</button>
        </div>
      </div>

      <div className={selectMode ? 'pb-20' : ''}>
        {view === 'day' ? (
          <DayView
            date={isoToday}
            events={dayEvents}
            onAdd={handleAdd}
            onEdit={handleEdit}
            onDelete={handleDelete}
            selectMode={selectMode}
            selectedIds={selectedIds}
            onToggleSelect={toggleSelect}
          />
        ) : (
          <WeekView
            weekStart={weekStart}
            events={weekEvents}
            onAdd={handleAdd}
            onEdit={handleEdit}
            onDelete={handleDelete}
            selectMode={selectMode}
            selectedIds={selectedIds}
            onToggleSelect={toggleSelect}
          />
        )}
      </div>

      {selectMode && (
        <BulkBar
          count={selectedIds.size}
          total={view === 'day' ? dayEvents.length : weekEvents.length}
          onSelectAll={() => {
            const visibleEvents = view === 'day' ? dayEvents : weekEvents
            setSelectedIds(new Set(visibleEvents.map((e) => e.id)))
          }}
          onDeselectAll={() => setSelectedIds(new Set())}
          onDelete={handleBulkDelete}
          onCancel={exitSelectMode}
        />
      )}

      {showForm && (
        <EventForm
          initial={editingEvent}
          defaultDate={defaultDate}
          onSubmit={handleSubmit}
          onClose={() => { setShowForm(false); setEditingEvent(null) }}
        />
      )}

      {showImport && (
        <ImportModal
          mode="schedule"
          onImportSchedule={(events) => {
            bulkAddEvents(events)
            setShowImport(false)
          }}
          onClose={() => setShowImport(false)}
        />
      )}
    </div>
  )
}
