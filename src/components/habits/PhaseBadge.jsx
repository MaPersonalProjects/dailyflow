import PropTypes from 'prop-types'

export function PhaseBadge({ phase }) {
  if (!phase) return null
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${phase.bg} ${phase.color}`}
    >
      {phase.icon} {phase.label}
    </span>
  )
}

PhaseBadge.propTypes = {
  phase: PropTypes.shape({
    key: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    bg: PropTypes.string.isRequired,
  }).isRequired,
}
