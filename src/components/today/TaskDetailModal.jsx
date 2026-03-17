import PropTypes from 'prop-types'
import { formatTime, formatDate } from '../../utils/dateHelpers.js'
import { CATEGORY_COLORS } from '../../constants.js'

export function TaskDetailModal({ item, onClose, onDone, onSkip }) {
  if (!item) return null

  const catColors = item.category ? CATEGORY_COLORS[item.category] : null
  const isTask = item.itemType === 'task'
  const isDone = item.completed && !item.skipped
  const isSkipped = item.skipped

  function timeInfo() {
    if (item.itemType === 'event' && item.startTime && item.endTime) {
      return `${formatTime(item.startTime)} – ${formatTime(item.endTime)}`
    }
    if (item.dueTime) return `Due at ${formatTime(item.dueTime)}`
    return null
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl leading-none"
          aria-label="Close"
        >
          ✕
        </button>

        {/* Type badge */}
        <div className="mb-2">
          <span className="text-xs text-gray-400 uppercase tracking-wider font-medium">
            {item.itemType === 'event' ? 'Scheduled Event' : 'Task'}
          </span>
        </div>

        {/* Title */}
        <h2 className={`text-xl font-bold text-gray-900 mb-3 ${isDone || isSkipped ? 'line-through text-gray-400' : ''}`}>
          {isDone ? '✅ ' : isSkipped ? '⏭ ' : ''}{item.title}
        </h2>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {catColors && (
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${catColors.bg} ${catColors.text}`}>
              {item.category}
            </span>
          )}
          {timeInfo() && (
            <span className="text-sm text-gray-500">{timeInfo()}</span>
          )}
        </div>

        {/* Notes */}
        {item.notes && (
          <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3 mb-4">
            {item.notes}
          </p>
        )}

        {/* Actions — tasks only */}
        {isTask && !isDone && !isSkipped && (
          <div className="flex gap-3">
            <button
              onClick={() => { onDone(item); onClose() }}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-2.5 rounded-xl transition-colors"
            >
              ✅ Mark Done
            </button>
            <button
              onClick={() => { onSkip(item); onClose() }}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 rounded-xl transition-colors"
            >
              ⏭ Skip
            </button>
          </div>
        )}

        {isTask && (isDone || isSkipped) && (
          <p className="text-center text-sm text-gray-400">
            {isDone ? 'Marked as done' : 'Skipped'}
          </p>
        )}

        {!isTask && (
          <p className="text-center text-sm text-gray-400">Schedule event — no actions needed</p>
        )}
      </div>
    </div>
  )
}

TaskDetailModal.propTypes = {
  item: PropTypes.shape({
    itemType: PropTypes.oneOf(['event', 'task']).isRequired,
    title: PropTypes.string.isRequired,
    category: PropTypes.string,
    startTime: PropTypes.string,
    endTime: PropTypes.string,
    dueTime: PropTypes.string,
    notes: PropTypes.string,
    completed: PropTypes.bool,
    skipped: PropTypes.bool,
  }),
  onClose: PropTypes.func.isRequired,
  onDone: PropTypes.func.isRequired,
  onSkip: PropTypes.func.isRequired,
}

TaskDetailModal.defaultProps = {
  item: null,
}
