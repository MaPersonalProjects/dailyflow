import PropTypes from 'prop-types'
import { EVENT_COLORS } from '../../constants.js'
import { formatTime } from '../../utils/dateHelpers.js'

export function TimeBlock({ event, style, onEdit, onDelete, selectMode, isSelected, onToggleSelect }) {
  const colorConfig = EVENT_COLORS.find((c) => c.key === event.color) || EVENT_COLORS[0]
  const isShort = (style.height ?? 0) < 40

  const handleClick = () => {
    if (selectMode) {
      onToggleSelect(event.id)
    } else {
      onEdit(event)
    }
  }

  return (
    <div
      className={`absolute rounded px-2 py-1 cursor-pointer border-l-4 hover:shadow-md transition-shadow overflow-hidden ${
        selectMode && isSelected
          ? 'bg-indigo-100 border-indigo-500 text-indigo-800 ring-2 ring-indigo-400'
          : `${colorConfig.light} ${colorConfig.text} ${colorConfig.border}`
      }`}
      style={{ ...style, minHeight: 28 }}
      onClick={handleClick}
    >
      <div className="flex items-start justify-between gap-1">
        <div className="min-w-0 flex-1 flex items-start gap-1">
          {selectMode && (
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => onToggleSelect(event.id)}
              onClick={(e) => e.stopPropagation()}
              className="mt-0.5 w-3 h-3 accent-indigo-600 flex-shrink-0 cursor-pointer"
            />
          )}
          <div className="min-w-0">
            <p className="text-xs font-semibold truncate leading-tight">{event.title}</p>
            {!isShort && event.startTime && (
              <p className="text-xs opacity-75 truncate">
                {formatTime(event.startTime)}{event.endTime ? ` – ${formatTime(event.endTime)}` : ''}
              </p>
            )}
          </div>
        </div>
        {!selectMode && (
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(event.id) }}
            className="text-xs opacity-50 hover:opacity-100 flex-shrink-0 leading-none"
            aria-label="Delete event"
          >✕</button>
        )}
      </div>
    </div>
  )
}

TimeBlock.propTypes = {
  event: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    title: PropTypes.string.isRequired,
    startTime: PropTypes.string,
    endTime: PropTypes.string,
    color: PropTypes.string,
  }).isRequired,
  style: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  selectMode: PropTypes.bool,
  isSelected: PropTypes.bool,
  onToggleSelect: PropTypes.func,
}

TimeBlock.defaultProps = {
  selectMode: false,
  isSelected: false,
  onToggleSelect: () => {},
}
