import { useState } from 'react'
import { useTasksContext as useTasks } from '../../contexts/TasksContext.jsx'
import { isTaskCompletedOn } from '../../hooks/useTasks.js'
import { getToday } from '../../utils/dateHelpers.js'
import { TaskFilter } from './TaskFilter.jsx'
import { TaskForm } from './TaskForm.jsx'
import { TaskList } from './TaskList.jsx'
import { ImportModal } from '../import/ImportModal.jsx'
import { BulkBar } from '../common/BulkBar.jsx'

export function Tasks() {
  const { tasks, addTask, updateTask, deleteTask, toggleComplete, reorderTasks, bulkAddTasks, bulkDeleteTasks } = useTasks()
  const [filters, setFilters] = useState({ priority: '', category: '', showCompleted: false })
  const [showForm, setShowForm] = useState(false)
  const [showImport, setShowImport] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [selectMode, setSelectMode] = useState(false)
  const [selectedIds, setSelectedIds] = useState(new Set())

  const today = getToday()

  const filtered = tasks.filter((t) => {
    const isCompleted = isTaskCompletedOn(t, today)
    if (!filters.showCompleted && isCompleted) return false
    if (filters.priority && t.priority !== filters.priority) return false
    if (filters.category && t.category !== filters.category) return false
    return true
  })

  const handleSubmit = (data) => {
    if (editingTask) {
      updateTask(editingTask.id, data)
    } else {
      addTask(data)
    }
    setShowForm(false)
    setEditingTask(null)
  }

  const handleEdit = (task) => {
    setEditingTask(task)
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
    bulkDeleteTasks([...selectedIds])
    exitSelectMode()
  }

  return (
    <div className="p-4 md:p-6 max-w-2xl">
      <div className="flex items-center justify-between mb-4">
        <TaskFilter filters={filters} onChange={setFilters} />
        <div className="flex items-center gap-1 ml-2 flex-shrink-0">
          <button
            onClick={() => setShowImport(true)}
            className="border border-gray-300 text-gray-600 px-3 py-1.5 rounded-md text-sm font-medium hover:bg-gray-50"
          >
            ↑ Import
          </button>
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
            onClick={() => { setEditingTask(null); setShowForm(true) }}
            className="bg-indigo-600 text-white px-3 py-1.5 rounded-md text-sm font-medium hover:bg-indigo-700"
          >
            + Add Task
          </button>
        </div>
      </div>

      {/* Add bottom padding when BulkBar is visible */}
      <div className={selectMode ? 'pb-20' : ''}>
        <TaskList
          tasks={filtered}
          onToggle={toggleComplete}
          onDelete={deleteTask}
          onEdit={handleEdit}
          onReorder={reorderTasks}
          today={today}
          selectMode={selectMode}
          selectedIds={selectedIds}
          onToggleSelect={toggleSelect}
        />
      </div>

      {selectMode && (
        <BulkBar
          count={selectedIds.size}
          total={filtered.length}
          onSelectAll={() => setSelectedIds(new Set(filtered.map((t) => t.id)))}
          onDeselectAll={() => setSelectedIds(new Set())}
          onDelete={handleBulkDelete}
          onCancel={exitSelectMode}
        />
      )}

      {showForm && (
        <TaskForm
          initial={editingTask}
          onSubmit={handleSubmit}
          onClose={() => { setShowForm(false); setEditingTask(null) }}
        />
      )}

      {showImport && (
        <ImportModal
          mode="tasks"
          onImportTasks={(taskList) => { bulkAddTasks(taskList); setShowImport(false) }}
          onClose={() => setShowImport(false)}
        />
      )}
    </div>
  )
}
