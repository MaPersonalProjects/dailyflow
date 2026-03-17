import PropTypes from 'prop-types'
import { BEHAVIOR_SIZES } from '../../constants.js'

export function BehaviorSizer({ value, onChange }) {
  const selected = BEHAVIOR_SIZES.find((s) => s.key === value)

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        {BEHAVIOR_SIZES.map((size) => (
          <button
            key={size.key}
            type="button"
            onClick={() => onChange(size.key)}
            className={`flex-1 flex flex-col items-center gap-1 py-2 px-1 rounded-lg border-2 text-xs font-medium transition-all ${
              value === size.key
                ? `${size.bg} ${size.border} ${size.color}`
                : 'bg-gray-50 border-gray-200 text-gray-500 hover:border-gray-300'
            }`}
          >
            <span className="text-base">{size.icon}</span>
            <span>{size.label}</span>
          </button>
        ))}
      </div>
      {selected && (
        <p
          className={`text-xs px-3 py-2 rounded-md ${
            value === 'tiny'
              ? 'bg-green-50 text-green-700'
              : 'bg-amber-50 text-amber-700'
          }`}
        >
          {selected.description}
        </p>
      )}
    </div>
  )
}

BehaviorSizer.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
}
