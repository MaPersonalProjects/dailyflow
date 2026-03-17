import PropTypes from 'prop-types'
import { REPEAT_OPTIONS } from '../../constants.js'
import { formatDate, formatTime } from '../../utils/dateHelpers.js'

export function ReminderCard({ reminder, onDismiss, onDelete, onEdit, selectMode, isSelected, onToggleSelect }) {
  const repeatLabel = REPEAT_OPTIONS.find((o) => o.value === reminder.recurring)?.label

  return (
    <div
      className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${
        selectMode && isSelected
          ? 'border-indigo-300 bg-indigo-50'
          : reminder.done
          ? 'border-gray-100 bg-gray-50 opacity-60'
          : 'border-gray-200 bg-white hover:border-gray-300'
      }`}
      onClick={selectMode ? () => onToggleSelect(reminder.id) : undefined}
    >
      {selectMode && (
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onToggleSelect(reminder.id)}
          onClick={(e) => e.stopPropagation()}
          className="mt-1 w-4 h-4 accent-indigo-600 flex-shrink-0 cursor-pointer"
        />
      )}
      <div className="flex-1 min-w-0 cursor-pointer" onClick={selectMode ? undefined : () => onEdit(reminder)}>
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-sm font-medium ${reminder.done ? 'line-through text-gray-400' : 'text-gray-800'}`}>
            {reminder.title}
          </span>
          {reminder.recurring !== 'none' && (
            <span className="text-xs px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-600 font-medium">
              {repeatLabel}
            </span>
          )}
          {reminder.notified && !reminder.done && (
            <span className="text-xs px-1.5 py-0.5 rounded bg-yellow-50 text-yellow-600">Notified</span>
          )}
        </div>
        <p className="text-xs text-gray-400 mt-0.5">
          {reminder.datetime && `${formatDate(reminder.datetime.split('T')[0])} at ${formatTime(reminder.datetime.split('T')[1]?.slice(0, 5))}`}
        </p>
      </div>

      {!selectMode && (
        <div className="flex gap-1.5 flex-shrink-0">
          {!reminder.done && (
            <button
              onClick={() => onDismiss(reminder.id)}
              className="text-xs text-green-600 hover:text-green-700 font-medium px-2 py-1 rounded bg-green-50 hover:bg-green-100"
            >Done</button>
          )}
          <button
            onClick={() => onDelete(reminder.id)}
            className="text-gray-300 hover:text-red-500 transition-colors"
            aria-label="Delete reminder"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      )}
    </div>
  )
}

ReminderCard.propTypes = {
  reminder: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    datetime: PropTypes.string.isRequired,
    recurring: PropTypes.string,
    notified: PropTypes.bool,
    done: PropTypes.bool,
  }).isRequired,
  onDismiss: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  selectMode: PropTypes.bool,
  isSelected: PropTypes.bool,
  onToggleSelect: PropTypes.func,
}

ReminderCard.defaultProps = {
  selectMode: false,
  isSelected: false,
  onToggleSelect: () => {},
}
