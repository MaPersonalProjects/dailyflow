import PropTypes from 'prop-types'
import { CELEBRATION_TYPES } from '../../constants.js'

export function CelebrationPicker({ value, customValue, onChange, onCustomChange }) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {CELEBRATION_TYPES.map((type) => (
          <button
            key={type.key}
            type="button"
            onClick={() => onChange(type.key)}
            className={`flex flex-col items-center gap-1.5 p-3 rounded-lg border-2 text-xs text-center transition-all ${
              value === type.key
                ? 'border-indigo-400 bg-indigo-50 text-indigo-700'
                : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
            }`}
          >
            <span className="text-2xl">{type.emoji}</span>
            <span className="font-medium">{type.label}</span>
            <span className="text-gray-400 text-xs leading-tight">{type.description}</span>
          </button>
        ))}
      </div>

      {value === 'custom' && (
        <div>
          <input
            type="text"
            placeholder="Describe your celebration…"
            value={customValue}
            onChange={(e) => onCustomChange(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            autoFocus
          />
        </div>
      )}
    </div>
  )
}

CelebrationPicker.propTypes = {
  value: PropTypes.string.isRequired,
  customValue: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onCustomChange: PropTypes.func.isRequired,
}
