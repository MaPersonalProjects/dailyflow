import PropTypes from 'prop-types'

export function StreakBadge({ streak }) {
  if (streak === 0) return null
  return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">
      🔥 {streak}
    </span>
  )
}

StreakBadge.propTypes = {
  streak: PropTypes.number.isRequired,
}
