import { useState } from 'react'
import PropTypes from 'prop-types'
import { REPEAT_OPTIONS } from '../../constants.js'
import { getToday } from '../../utils/dateHelpers.js'

function splitDatetime(iso) {
  if (!iso) return { date: getToday(), time: '09:00' }
  const [datePart, timePart] = iso.split('T')
  return { date: datePart, time: timePart?.slice(0, 5) || '09:00' }
}

export function ReminderForm({ onSubmit, onClose, initial }) {
  const { date: initDate, time: initTime } = splitDatetime(initial?.datetime)

  const [form, setForm] = useState({
    title: initial?.title || '',
    date: initDate,
    time: initTime,
    recurring: initial?.recurring || 'none',
  })

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.title.trim()) return
    const datetime = `${form.date}T${form.time}:00`
    onSubmit({ title: form.title, datetime, recurring: form.recurring })
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-800">{initial ? 'Edit Reminder' : 'New Reminder'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Title *</label>
            <input type="text" value={form.title} onChange={set('title')} autoFocus placeholder="Reminder title"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Date</label>
              <input type="date" value={form.date} onChange={set('date')} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Time</label>
              <input type="time" value={form.time} onChange={set('time')} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Repeat</label>
            <select value={form.recurring} onChange={set('recurring')} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
              {REPEAT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>

          <div className="flex gap-2 pt-1">
            <button type="button" onClick={onClose} className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-md text-sm font-medium hover:bg-gray-50">Cancel</button>
            <button type="submit" className="flex-1 bg-indigo-600 text-white py-2 rounded-md text-sm font-medium hover:bg-indigo-700">{initial ? 'Save Changes' : 'Add Reminder'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}

ReminderForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  initial: PropTypes.object,
}
