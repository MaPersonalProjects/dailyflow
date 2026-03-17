import { useState, useCallback, useRef } from 'react'
import PropTypes from 'prop-types'
import { format, addDays, parseISO } from 'date-fns'
import { parseMdSchedule } from '../../utils/parseMdSchedule.js'
import { parseCsvTasks } from '../../utils/parseCsvTasks.js'

// ─── Constants ───────────────────────────────────────────────────────────────

const DAY_OFFSETS = { mon: 0, tue: 1, wed: 2, thu: 3, fri: 4, sat: 5, sun: 6 }
const DAY_LABELS = { mon: 'Mon', tue: 'Tue', wed: 'Wed', thu: 'Thu', fri: 'Fri', sat: 'Sat', sun: 'Sun' }

const DAY_COLORS = {
  mon: 'blue', tue: 'green', wed: 'indigo', thu: 'teal', fri: 'purple', sat: 'yellow', sun: 'pink',
}

const WEEKDAY_SET = new Set(['mon', 'tue', 'wed', 'thu', 'fri'])
const ALL_DAYS = new Set(['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'])

/** Map a set of day keys to the best TASK_RECURRENCE key. */
function inferRecurring(dayKeys) {
  const set = new Set(dayKeys)
  if (set.size === 7 && [...ALL_DAYS].every((d) => set.has(d))) return 'daily'
  if (set.size === 5 && [...WEEKDAY_SET].every((d) => set.has(d))) return 'weekdays'
  return 'custom'
}

/** Flatten parsed schedule groups into task objects. */
function scheduleGroupsToTasks(groups) {
  const tasks = []
  let idx = 0
  for (const group of groups) {
    const recurring = inferRecurring(group.dayKeys)
    for (const item of group.items) {
      tasks.push({
        _importId: `sched_${idx++}`,
        title: item.title,
        notes: item.notes,
        dueTime: item.startTime,   // ← time from schedule entry
        dueDate: '',               // user can set via date picker
        priority: 'medium',
        category: 'Personal',
        recurring,
        recurringDays: recurring === 'custom' ? group.dayKeys : [],
        _dayKeys: group.dayKeys,   // for preview display only
      })
    }
  }
  return tasks
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getThisWeekMonday() {
  const d = new Date()
  const day = d.getDay() // 0=Sun
  const diff = day === 0 ? -6 : 1 - day
  d.setDate(d.getDate() + diff)
  d.setHours(0, 0, 0, 0)
  return format(d, 'yyyy-MM-dd')
}

function detectFileType(filename) {
  const ext = filename.split('.').pop().toLowerCase()
  if (ext === 'md') return 'md'
  if (ext === 'csv') return 'csv'
  if (ext === 'txt') return 'txt'
  if (ext === 'xlsx' || ext === 'xls') return 'xlsx'
  return 'unknown'
}

// ─── Schedule Preview ─────────────────────────────────────────────────────────

function SchedulePreview({ groups, weekMonday, selectedItems, onToggleItem, onToggleGroup }) {
  const mondayDate = parseISO(weekMonday)

  return (
    <div className="space-y-4">
      {groups.map((group, gi) => {
        const groupKeys = group.items.map((_, ii) => `${gi}_${ii}`)
        const allSelected = groupKeys.every((k) => selectedItems.has(k))
        const someSelected = groupKeys.some((k) => selectedItems.has(k))

        // Compute the actual dates for this day group
        const dates = group.dayKeys.map((dk) => {
          const d = addDays(mondayDate, DAY_OFFSETS[dk] ?? 0)
          return `${DAY_LABELS[dk] || dk} ${format(d, 'MMM d')}`
        })

        return (
          <div key={gi} className="border border-gray-200 rounded-lg overflow-hidden">
            {/* Group header */}
            <div className="flex items-center gap-3 px-3 py-2 bg-gray-50 border-b border-gray-200">
              <input
                type="checkbox"
                checked={allSelected}
                ref={(el) => { if (el) el.indeterminate = !allSelected && someSelected }}
                onChange={() => onToggleGroup(gi, !allSelected)}
                className="accent-indigo-600"
              />
              <div className="flex-1 min-w-0">
                <span className="text-xs font-semibold text-gray-700">{group.label}</span>
                <div className="flex gap-1 mt-0.5 flex-wrap">
                  {dates.map((d) => (
                    <span key={d} className="text-xs bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded">
                      {d}
                    </span>
                  ))}
                </div>
              </div>
              <span className="text-xs text-gray-400">{group.items.length} blocks</span>
            </div>

            {/* Items */}
            <div className="divide-y divide-gray-100">
              {group.items.map((item, ii) => {
                const key = `${gi}_${ii}`
                return (
                  <label key={ii} className="flex items-start gap-3 px-3 py-2 hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedItems.has(key)}
                      onChange={() => onToggleItem(key)}
                      className="mt-0.5 accent-indigo-600"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-sm text-gray-800">{item.title}</span>
                      {item.notes && (
                        <p className="text-xs text-gray-400 mt-0.5 truncate">{item.notes}</p>
                      )}
                    </div>
                    <span className="text-xs text-gray-400 flex-shrink-0">
                      {item.startTime}–{item.endTime}
                    </span>
                  </label>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}

SchedulePreview.propTypes = {
  groups: PropTypes.array.isRequired,
  weekMonday: PropTypes.string.isRequired,
  selectedItems: PropTypes.instanceOf(Set).isRequired,
  onToggleItem: PropTypes.func.isRequired,
  onToggleGroup: PropTypes.func.isRequired,
}

// ─── Task Preview ─────────────────────────────────────────────────────────────

function TaskPreview({ tasks, selectedItems, onToggleItem, onToggleAll, dueDate, onDueDateChange }) {
  const allSelected = tasks.length > 0 && tasks.every((t) => selectedItems.has(t._importId))
  const someSelected = tasks.some((t) => selectedItems.has(t._importId))

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <label className="flex items-center gap-2 text-sm text-gray-600">
          <input
            type="checkbox"
            checked={allSelected}
            ref={(el) => { if (el) el.indeterminate = !allSelected && someSelected }}
            onChange={() => onToggleAll(!allSelected)}
            className="accent-indigo-600"
          />
          Select all ({tasks.length})
        </label>
        <div className="flex items-center gap-2 ml-auto">
          <label className="text-xs text-gray-500">Due date (optional):</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => onDueDateChange(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg divide-y divide-gray-100 max-h-64 overflow-y-auto">
        {tasks.map((task) => (
          <label key={task._importId} className="flex items-start gap-3 px-3 py-2 hover:bg-gray-50 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedItems.has(task._importId)}
              onChange={() => onToggleItem(task._importId)}
              className="mt-0.5 accent-indigo-600"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-sm text-gray-800">{task.title}</span>
                {task.dueTime && (
                  <span className="text-xs text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded font-medium">
                    🕐 {task.dueTime}
                  </span>
                )}
                {task.recurring && task.recurring !== 'none' && (
                  <span className="text-xs text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded font-medium">
                    🔁 {task.recurring === 'custom' && task._dayKeys
                      ? (task._dayKeys.map((d) => ({ mon:'M',tue:'T',wed:'W',thu:'Th',fri:'F',sat:'Sa',sun:'Su' })[d] ?? d).join(' '))
                      : task.recurring}
                  </span>
                )}
              </div>
              {task.notes && (
                <p className="text-xs text-gray-400 mt-0.5 truncate">{task.notes}</p>
              )}
            </div>
          </label>
        ))}
      </div>
    </div>
  )
}

TaskPreview.propTypes = {
  tasks: PropTypes.array.isRequired,
  selectedItems: PropTypes.instanceOf(Set).isRequired,
  onToggleItem: PropTypes.func.isRequired,
  onToggleAll: PropTypes.func.isRequired,
  dueDate: PropTypes.string.isRequired,
  onDueDateChange: PropTypes.func.isRequired,
}

// ─── Main Modal ───────────────────────────────────────────────────────────────

export function ImportModal({ mode, onImportSchedule, onImportTasks, onClose }) {
  const fileRef = useRef(null)
  const [parsed, setParsed] = useState(null)   // { kind: 'schedule'|'tasks', data }
  const [error, setError] = useState('')
  const [weekMonday, setWeekMonday] = useState(getThisWeekMonday)
  const [selectedItems, setSelectedItems] = useState(new Set())
  const [taskDueDate, setTaskDueDate] = useState('')
  const [importing, setImporting] = useState(false)

  const handleFile = useCallback((file) => {
    if (!file) return
    setError('')
    setParsed(null)
    setSelectedItems(new Set())

    const fileType = detectFileType(file.name)

    if (fileType === 'xlsx' || fileType === 'xls') {
      setError('Excel files (.xlsx) are not directly supported. Please save/export the file as CSV (.csv) from Excel first, then import it here.')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target.result

      // Schedule mode: .md file
      if (mode === 'schedule' || (mode === 'auto' && fileType === 'md')) {
        try {
          const groups = parseMdSchedule(content)
          if (groups.length === 0) {
            setError('No schedule time blocks found. Make sure the file uses the expected format: ### Day headers with - **HH:MM AM** - Title entries.')
            return
          }
          // Pre-select all items
          const allKeys = new Set()
          groups.forEach((g, gi) => g.items.forEach((_, ii) => allKeys.add(`${gi}_${ii}`)))
          setSelectedItems(allKeys)
          setParsed({ kind: 'schedule', data: groups })
        } catch {
          setError('Failed to parse the markdown file.')
        }
        return
      }

      // Tasks mode: .csv, .txt, or .md list (with schedule-format detection)
      try {
        let tasks
        if (fileType === 'md') {
          // Try schedule format first — it preserves times and recurrence
          const groups = parseMdSchedule(content)
          if (groups.length > 0) {
            tasks = scheduleGroupsToTasks(groups)
          }
        }
        if (!tasks) {
          tasks = parseCsvTasks(content)
        }
        if (!tasks || tasks.length === 0) {
          setError('No tasks found. For CSV: include a "title" column. For plain text: one task per line.')
          return
        }
        const allKeys = new Set(tasks.map((t) => t._importId))
        setSelectedItems(allKeys)
        setParsed({ kind: 'tasks', data: tasks })
      } catch {
        setError('Failed to parse the file.')
      }
    }
    reader.readAsText(file)
  }, [mode])

  const onDrop = useCallback((e) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }, [handleFile])

  const onFileChange = (e) => handleFile(e.target.files[0])

  // Toggle single item
  const toggleItem = (key) => {
    setSelectedItems((prev) => {
      const next = new Set(prev)
      next.has(key) ? next.delete(key) : next.add(key)
      return next
    })
  }

  // Toggle all items in a schedule group
  const toggleGroup = (gi, select) => {
    if (!parsed || parsed.kind !== 'schedule') return
    const group = parsed.data[gi]
    setSelectedItems((prev) => {
      const next = new Set(prev)
      group.items.forEach((_, ii) => {
        const key = `${gi}_${ii}`
        select ? next.add(key) : next.delete(key)
      })
      return next
    })
  }

  // Toggle all tasks
  const toggleAllTasks = (select) => {
    if (!parsed || parsed.kind !== 'tasks') return
    setSelectedItems(select ? new Set(parsed.data.map((t) => t._importId)) : new Set())
  }

  // ── Import ─────────────────────────────────────────────────────────────────

  const handleImport = () => {
    if (!parsed || selectedItems.size === 0) return
    setImporting(true)

    if (parsed.kind === 'schedule') {
      const mondayDate = parseISO(weekMonday)
      const events = []
      parsed.data.forEach((group, gi) => {
        group.items.forEach((item, ii) => {
          if (!selectedItems.has(`${gi}_${ii}`)) return
          group.dayKeys.forEach((dk) => {
            const date = format(addDays(mondayDate, DAY_OFFSETS[dk] ?? 0), 'yyyy-MM-dd')
            events.push({
              title: item.title,
              date,
              startTime: item.startTime,
              endTime: item.endTime,
              notes: item.notes,
              type: 'block',
              color: DAY_COLORS[dk] ?? 'blue',
              recurring: 'none',
            })
          })
        })
      })
      onImportSchedule(events)
    }

    if (parsed.kind === 'tasks') {
      const tasks = parsed.data
        .filter((t) => selectedItems.has(t._importId))
        // eslint-disable-next-line no-unused-vars
        .map(({ _importId, _dayKeys, ...rest }) => ({
          ...rest,
          dueDate: taskDueDate || rest.dueDate,
        }))
      onImportTasks(tasks)
    }

    onClose()
  }

  const selectedCount = selectedItems.size
  const totalEvents = parsed?.kind === 'schedule'
    ? [...selectedItems].reduce((acc, key) => {
        const [gi] = key.split('_').map(Number)
        return acc + (parsed.data[gi]?.dayKeys?.length ?? 1)
      }, 0)
    : 0

  const acceptAttr = mode === 'schedule' ? '.md' : '.csv,.txt,.md'

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-base font-semibold text-gray-800">
              {mode === 'schedule' ? 'Import Schedule' : 'Import Tasks'}
            </h2>
            <p className="text-xs text-gray-400">
              {mode === 'schedule'
                ? 'Import from a .md schedule file'
                : 'Import from a .csv file or plain text list'}
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* File drop zone */}
          {!parsed && (
            <div
              onDrop={onDrop}
              onDragOver={(e) => e.preventDefault()}
              className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-indigo-400 transition-colors cursor-pointer"
              onClick={() => fileRef.current?.click()}
            >
              <p className="text-3xl mb-2">📂</p>
              <p className="text-sm font-medium text-gray-700">Drop your file here or click to browse</p>
              <p className="text-xs text-gray-400 mt-1">
                {mode === 'schedule'
                  ? 'Accepts .md — schedule format with ### Day headers'
                  : 'Accepts .md (schedule or list), .csv, or .txt — times & recurrence auto-detected'}
              </p>
              <input
                ref={fileRef}
                type="file"
                accept={acceptAttr}
                onChange={onFileChange}
                className="hidden"
              />
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700">
              {error}
              <button
                onClick={() => { setError(''); setParsed(null); fileRef.current && (fileRef.current.value = '') }}
                className="ml-2 underline text-xs"
              >
                Try again
              </button>
            </div>
          )}

          {/* Schedule week picker */}
          {parsed?.kind === 'schedule' && (
            <div className="flex items-center gap-3 bg-indigo-50 border border-indigo-200 rounded-lg px-4 py-3">
              <span className="text-sm text-indigo-700 font-medium">Import for week of:</span>
              <input
                type="date"
                value={weekMonday}
                onChange={(e) => setWeekMonday(e.target.value)}
                className="border border-indigo-300 rounded px-2 py-1 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <span className="text-xs text-indigo-500">
                (pick the Monday of the target week)
              </span>
            </div>
          )}

          {/* Preview */}
          {parsed?.kind === 'schedule' && (
            <SchedulePreview
              groups={parsed.data}
              weekMonday={weekMonday}
              selectedItems={selectedItems}
              onToggleItem={toggleItem}
              onToggleGroup={toggleGroup}
            />
          )}

          {parsed?.kind === 'tasks' && (
            <TaskPreview
              tasks={parsed.data}
              selectedItems={selectedItems}
              onToggleItem={toggleItem}
              onToggleAll={toggleAllTasks}
              dueDate={taskDueDate}
              onDueDateChange={setTaskDueDate}
            />
          )}

          {/* Change file button */}
          {parsed && (
            <button
              onClick={() => { setParsed(null); setError(''); fileRef.current && (fileRef.current.value = '') }}
              className="text-xs text-gray-400 hover:text-gray-600 underline"
            >
              ← Choose a different file
            </button>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-gray-100 flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-md text-sm font-medium hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleImport}
            disabled={!parsed || selectedCount === 0 || importing}
            className={`flex-2 px-5 py-2 rounded-md text-sm font-medium transition-colors ${
              parsed && selectedCount > 0
                ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {parsed?.kind === 'schedule'
              ? `Import ${totalEvents} time block${totalEvents !== 1 ? 's' : ''}`
              : `Import ${selectedCount} task${selectedCount !== 1 ? 's' : ''}`}
          </button>
        </div>
      </div>
    </div>
  )
}

ImportModal.propTypes = {
  mode: PropTypes.oneOf(['schedule', 'tasks', 'auto']).isRequired,
  onImportSchedule: PropTypes.func,
  onImportTasks: PropTypes.func,
  onClose: PropTypes.func.isRequired,
}

ImportModal.defaultProps = {
  onImportSchedule: () => {},
  onImportTasks: () => {},
}
