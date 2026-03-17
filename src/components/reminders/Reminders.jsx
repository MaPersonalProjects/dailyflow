import { useState, useEffect } from 'react'
import { useReminders } from '../../hooks/useReminders.js'
import { ReminderList } from './ReminderList.jsx'
import { ReminderForm } from './ReminderForm.jsx'
import { BulkBar } from '../common/BulkBar.jsx'

export function Reminders() {
  const { reminders, addReminder, updateReminder, deleteReminder, dismissReminder, checkDue, bulkDeleteReminders } = useReminders()
  const [showForm, setShowForm] = useState(false)
  const [editingReminder, setEditingReminder] = useState(null)
  const [selectMode, setSelectMode] = useState(false)
  const [selectedIds, setSelectedIds] = useState(new Set())

  useEffect(() => {
    const interval = setInterval(checkDue, 30000)
    return () => clearInterval(interval)
  }, [checkDue])

  const handleSubmit = (data) => {
    if (editingReminder) {
      updateReminder(editingReminder.id, { ...data, notified: false })
    } else {
      addReminder(data)
    }
    setShowForm(false)
    setEditingReminder(null)
  }

  const handleEdit = (reminder) => {
    setEditingReminder(reminder)
    setShowForm(true)
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

  const handleBulkDelete = () => {
    bulkDeleteReminders([...selectedIds])
    exitSelectMode()
  }

  return (
    <div className={`p-4 md:p-6 max-w-2xl${selectMode ? ' pb-20' : ''}`}>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500">{reminders.filter((r) => !r.done).length} active reminder{reminders.filter((r) => !r.done).length !== 1 ? 's' : ''}</p>
        <div className="flex items-center gap-1">
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
            onClick={() => { setEditingReminder(null); setShowForm(true) }}
            className="bg-indigo-600 text-white px-3 py-1.5 rounded-md text-sm font-medium hover:bg-indigo-700"
          >+ Add Reminder</button>
        </div>
      </div>

      <ReminderList
        reminders={reminders}
        onDismiss={dismissReminder}
        onDelete={deleteReminder}
        onEdit={handleEdit}
        selectMode={selectMode}
        selectedIds={selectedIds}
        onToggleSelect={toggleSelect}
      />

      {selectMode && (
        <BulkBar
          count={selectedIds.size}
          total={reminders.length}
          onSelectAll={() => setSelectedIds(new Set(reminders.map((r) => r.id)))}
          onDeselectAll={() => setSelectedIds(new Set())}
          onDelete={handleBulkDelete}
          onCancel={exitSelectMode}
        />
      )}

      {showForm && (
        <ReminderForm
          initial={editingReminder}
          onSubmit={handleSubmit}
          onClose={() => { setShowForm(false); setEditingReminder(null) }}
        />
      )}
    </div>
  )
}
