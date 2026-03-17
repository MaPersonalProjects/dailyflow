import { useState } from 'react'
import PropTypes from 'prop-types'
import { PRIORITIES, CATEGORIES, DAYS_OF_WEEK, TASK_RECURRENCE } from '../../constants.js'

function RecurrenceSelector({ value, recurringDays, onChange, onDaysChange }) {
  return (
    <div className="space-y-2">
      <label className="block text-xs font-medium text-gray-600">Repeat</label>
      <div className="flex flex-wrap gap-1.5">
        {TASK_RECURRENCE.map((opt) => (
          <button
            key={opt.key}
            type="button"
            onClick={() => onChange(opt.key)}
            className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
              value === opt.key
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {value === 'custom' && (
        <div className="flex gap-1 flex-wrap pt-1">
          {DAYS_OF_WEEK.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() =>
                onDaysChange(
                  recurringDays.includes(key)
                    ? recurringDays.filter((d) => d !== key)
                    : [...recurringDays, key]
                )
              }
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                recurringDays.includes(key)
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      {value !== 'none' && (
        <p className="text-xs text-indigo-600 bg-indigo-50 px-2.5 py-1.5 rounded-md">
          🔁 {TASK_RECURRENCE.find((r) => r.key === value)?.description}
          {value === 'custom' && recurringDays.length > 0
            ? ` — ${recurringDays.map((d) => DAYS_OF_WEEK.find((x) => x.key === d)?.label ?? d).join(', ')}`
            : ''}
        </p>
      )}
    </div>
  )
}

RecurrenceSelector.propTypes = {
  value: PropTypes.string.isRequired,
  recurringDays: PropTypes.arrayOf(PropTypes.string).isRequired,
  onChange: PropTypes.func.isRequired,
  onDaysChange: PropTypes.func.isRequired,
}

export function TaskForm({ onSubmit, onClose, initial }) {
  const [form, setForm] = useState({
    title: initial?.title ?? '',
    notes: initial?.notes ?? '',
    priority: initial?.priority ?? 'medium',
    category: initial?.category ?? 'Personal',
    dueTime: initial?.dueTime ?? '',
    recurring: initial?.recurring ?? 'none',
    recurringDays: initial?.recurringDays ?? [],
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.title.trim()) return
    onSubmit(form)
  }

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))
  const setVal = (field, value) => setForm((f) => ({ ...f, [field]: value }))

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-800">{initial ? 'Edit Task' : 'New Task'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Title *</label>
            <input
              type="text"
              value={form.title}
              onChange={set('title')}
              placeholder="Task title"
              autoFocus
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Priority</label>
              <select value={form.priority} onChange={set('priority')} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                {Object.entries(PRIORITIES).map(([key, val]) => (
                  <option key={key} value={key}>{val.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Category</label>
              <select value={form.category} onChange={set('category')} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Due time */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Due Time</label>
            <input
              type="time"
              value={form.dueTime}
              onChange={set('dueTime')}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Recurrence */}
          <RecurrenceSelector
            value={form.recurring}
            recurringDays={form.recurringDays}
            onChange={(key) => setVal('recurring', key)}
            onDaysChange={(days) => setVal('recurringDays', days)}
          />

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Notes</label>
            <textarea
              value={form.notes}
              onChange={set('notes')}
              rows={2}
              placeholder="Optional notes..."
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>
        </form>

        <div className="px-5 py-4 border-t border-gray-100 flex gap-2">
          <button type="button" onClick={onClose} className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-md text-sm font-medium hover:bg-gray-50">
            Cancel
          </button>
          <button onClick={handleSubmit} className="flex-1 bg-indigo-600 text-white py-2 rounded-md text-sm font-medium hover:bg-indigo-700">
            {initial ? 'Save Changes' : 'Add Task'}
          </button>
        </div>
      </div>
    </div>
  )
}

TaskForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  initial: PropTypes.object,
}
