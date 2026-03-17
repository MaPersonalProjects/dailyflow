import PropTypes from 'prop-types'
import { formatTime, formatDuration } from '../../utils/dateHelpers.js'
import { CATEGORY_COLORS } from '../../constants.js'

const GLOW_STYLES = {
  current:   (hex) => ({ boxShadow: `0 0 0 2px ${hex}99, 0 0 24px ${hex}66`, transform: 'scale(1.025)' }),
  next:      (hex) => ({ boxShadow: `0 0 0 1px ${hex}66, 0 0 12px ${hex}33`, transform: 'scale(1.010)' }),
  upcoming2: (hex) => ({ boxShadow: `0 0 8px ${hex}22` }),
  upcoming3: (hex) => ({ boxShadow: `0 0 4px ${hex}11` }),
  future:    ()    => ({}),
  past:      ()    => ({ opacity: 0.5 }),
  done:      ()    => ({ opacity: 0.4 }),
}

function GlowBadge({ glowState }) {
  if (glowState === 'current') {
    return <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-semibold">NOW</span>
  }
  if (glowState === 'next') {
    return <span className="bg-indigo-500 text-white text-xs px-2 py-0.5 rounded-full font-semibold">NEXT</span>
  }
  return null
}

GlowBadge.propTypes = { glowState: PropTypes.string.isRequired }

export function TodayItem({ item, glowState, onSelect, onDone, onSkip, itemRef }) {
  const glowStyle = (GLOW_STYLES[glowState] ?? GLOW_STYLES.future)(item.colorHex)
  const isDone = item.completed && !item.skipped
  const isSkipped = item.skipped
  const catColors = item.category ? CATEGORY_COLORS[item.category] : null

  function timeLabel() {
    if (item.itemType === 'event') {
      const base = `${formatTime(item.startTime)} – ${formatTime(item.endTime)}`
      return item.startTime && item.endTime
        ? `${base} · ${formatDuration(item.startTime, item.endTime)}`
        : base
    }
    return item.dueTime ? `Due ${formatTime(item.dueTime)}` : ''
  }

  return (
    <div
      ref={itemRef}
      className="relative flex items-start gap-3 bg-white rounded-xl p-3 mb-2 cursor-pointer transition-all duration-500"
      style={glowStyle}
      onClick={() => onSelect(item)}
    >
      {/* Left color bar */}
      <div
        className="w-1 self-stretch rounded-full flex-shrink-0"
        style={{ backgroundColor: item.colorHex, minHeight: '100%' }}
      />

      <div className="flex-1 min-w-0">
        {/* Title row */}
        <div className="flex items-center gap-2 flex-wrap">
          <GlowBadge glowState={glowState} />
          <span className={`font-medium text-sm text-gray-800 ${isDone || isSkipped ? 'line-through text-gray-400' : ''}`}>
            {isDone ? '✅ ' : isSkipped ? '⏭ ' : ''}{item.title}
          </span>
        </div>

        {/* Time + category row */}
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          {timeLabel() && (
            <span className="text-xs text-gray-400">{timeLabel()}</span>
          )}
          {catColors && (
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${catColors.bg} ${catColors.text}`}>
              {item.category}
            </span>
          )}
        </div>
      </div>

      {/* Quick actions */}
      {!isDone && !isSkipped && (
        <div className="flex items-center gap-1 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
          <button
            className="text-xs text-green-600 hover:bg-green-50 px-2 py-1 rounded transition-colors"
            onClick={() => onDone(item)}
            title="Mark Done"
          >
            ✅
          </button>
          {item.itemType === 'task' && (
            <button
              className="text-xs text-gray-400 hover:bg-gray-100 px-2 py-1 rounded transition-colors"
              onClick={() => onSkip(item)}
              title="Skip"
            >
              ⏭
            </button>
          )}
        </div>
      )}
    </div>
  )
}

TodayItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    itemType: PropTypes.oneOf(['event', 'task']).isRequired,
    title: PropTypes.string.isRequired,
    startTime: PropTypes.string,
    endTime: PropTypes.string,
    dueTime: PropTypes.string,
    colorHex: PropTypes.string.isRequired,
    category: PropTypes.string,
    completed: PropTypes.bool,
    skipped: PropTypes.bool,
    notes: PropTypes.string,
  }).isRequired,
  glowState: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
  onDone: PropTypes.func.isRequired,
  onSkip: PropTypes.func.isRequired,
  itemRef: PropTypes.object,
}

TodayItem.defaultProps = {
  itemRef: null,
}
