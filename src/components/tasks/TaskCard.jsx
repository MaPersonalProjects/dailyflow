import PropTypes from 'prop-types'
import { PRIORITIES, TASK_RECURRENCE } from '../../constants.js'
import { formatTime } from '../../utils/dateHelpers.js'
import { isTaskCompletedOn } from '../../hooks/useTasks.js'

const PRIORITY_STYLES = {
  high: 'bg-red-100 text-red-700',
  medium: 'bg-yellow-100 text-yellow-700',
  low: 'bg-green-100 text-green-700',
}

export function TaskCard({ task, onToggle, onDelete, onEdit, today, selectMode, isSelected, onToggleSelect }) {
  const isRecurring = task.recurring && task.recurring !== 'none'
  const isCompleted = isTaskCompletedOn(task, today)

  const recurringLabel = isRecurring
    ? TASK_RECURRENCE.find((r) => r.key === task.recurring)?.label ?? task.recurring
    : null

  return (
    <div
      className={`flex items-start gap-3 p-3 bg-white rounded-lg border transition-colors ${
        selectMode && isSelected
          ? 'border-indigo-300 bg-indigo-50'
          : isCompleted
          ? 'border-gray-100 opacity-60'
          : 'border-gray-200 hover:border-gray-300'
      }`}
      onClick={selectMode ? () => onToggleSelect(task.id) : undefined}
    >
      {/* Left control: checkbox in select mode, complete button otherwise */}
      {selectMode ? (
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onToggleSelect(task.id)}
          onClick={(e) => e.stopPropagation()}
          className="mt-1 w-4 h-4 accent-indigo-600 flex-shrink-0 cursor-pointer"
        />
      ) : (
        <button
          onClick={() => onToggle(task.id, today)}
          className={`mt-0.5 w-5 h-5 rounded-full border-2 flex-shrink-0 transition-colors ${
            isCompleted ? 'bg-green-500 border-green-500' : 'border-gray-300 hover:border-indigo-400'
          }`}
          aria-label={isCompleted ? 'Mark incomplete' : 'Mark complete'}
        >
          {isCompleted && (
            <svg className="w-full h-full text-white p-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>
      )}

      <div
        className="flex-1 min-w-0 cursor-pointer"
        onClick={selectMode ? undefined : () => onEdit(task)}
      >
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-sm font-medium ${isCompleted ? 'line-through text-gray-400' : 'text-gray-800'}`}>
            {task.title}
          </span>
          {task.priority && (
            <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${PRIORITY_STYLES[task.priority]}`}>
              {PRIORITIES[task.priority]?.label}
            </span>
          )}
          {task.category && (
            <span className="text-xs px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">{task.category}</span>
          )}
          {isRecurring && (
            <span className="text-xs px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-600 font-medium">
              🔁 {recurringLabel}
            </span>
          )}
        </div>

        {task.dueTime && (
          <p className="text-xs mt-0.5 text-gray-400">
            {formatTime(task.dueTime)}
          </p>
        )}
        {task.notes && <p className="text-xs text-gray-400 mt-0.5 truncate">{task.notes}</p>}
      </div>

      {!selectMode && (
        <button
          onClick={() => onDelete(task.id)}
          className="text-gray-300 hover:text-red-500 transition-colors flex-shrink-0 mt-0.5"
          aria-label="Delete task"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      )}
    </div>
  )
}

TaskCard.propTypes = {
  task: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    notes: PropTypes.string,
    priority: PropTypes.string,
    category: PropTypes.string,
    dueTime: PropTypes.string,
    completed: PropTypes.bool,
    recurring: PropTypes.string,
    recurringDays: PropTypes.arrayOf(PropTypes.string),
    completions: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  onToggle: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  today: PropTypes.string.isRequired,
  selectMode: PropTypes.bool,
  isSelected: PropTypes.bool,
  onToggleSelect: PropTypes.func,
}

TaskCard.defaultProps = {
  selectMode: false,
  isSelected: false,
  onToggleSelect: () => {},
}
