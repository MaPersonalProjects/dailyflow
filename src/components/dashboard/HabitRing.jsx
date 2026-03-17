import PropTypes from 'prop-types'

export function HabitRing({ completionRate }) {
  const radius = 36
  const circumference = 2 * Math.PI * radius
  const progress = Math.max(0, Math.min(1, completionRate))
  const offset = circumference * (1 - progress)
  const percent = Math.round(progress * 100)

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-24 h-24">
        <svg className="w-24 h-24 -rotate-90" viewBox="0 0 88 88">
          <circle cx="44" cy="44" r={radius} fill="none" stroke="#e5e7eb" strokeWidth="8" />
          <circle
            cx="44" cy="44" r={radius}
            fill="none"
            stroke={progress >= 1 ? '#22c55e' : '#6366f1'}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.5s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold text-gray-700">{percent}%</span>
        </div>
      </div>
      <p className="text-xs text-gray-500 mt-1">Wins today</p>
    </div>
  )
}

HabitRing.propTypes = {
  completionRate: PropTypes.number.isRequired,
}
