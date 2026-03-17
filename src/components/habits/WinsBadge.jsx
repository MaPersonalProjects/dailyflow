import PropTypes from 'prop-types'

export function WinsBadge({ totalWins, phase }) {
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${phase?.bg ?? 'bg-gray-50'} ${phase?.color ?? 'text-gray-500'}`}
    >
      {phase?.icon ?? '🌱'} {totalWins} {totalWins === 1 ? 'win' : 'wins'}
    </span>
  )
}

WinsBadge.propTypes = {
  totalWins: PropTypes.number.isRequired,
  phase: PropTypes.shape({
    icon: PropTypes.string,
    color: PropTypes.string,
    bg: PropTypes.string,
  }),
}
