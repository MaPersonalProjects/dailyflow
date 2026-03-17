import { useState } from 'react'
import PropTypes from 'prop-types'
import { MAP_FIX_SUGGESTIONS } from '../../constants.js'

const MAP_CHOICES = [
  { key: 'motivation', label: 'Motivation', emoji: '💪', description: "I don't want to do it" },
  { key: 'ability', label: 'Ability', emoji: '🔧', description: "It feels too hard" },
  { key: 'prompt', label: 'Prompt', emoji: '🔔', description: "I keep forgetting" },
]

export function MapCheckin({ habit, onDismiss, onRespond }) {
  const [choice, setChoice] = useState(null)

  const handleChoose = (key) => {
    setChoice(key)
    onRespond(habit.id, key)
  }

  return (
    <div className="mb-2 rounded-lg border border-amber-200 bg-amber-50 p-3">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <span className="text-base">⚠️</span>
          <div>
            <p className="text-sm font-medium text-amber-800">Habit Check-In</p>
            <p className="text-xs text-amber-600">
              You&apos;ve missed this habit {habit.mapMissedDays} days in a row. What&apos;s getting in the way?
            </p>
          </div>
        </div>
        <button
          onClick={() => onDismiss(habit.id)}
          className="text-amber-400 hover:text-amber-600 text-sm flex-shrink-0"
          aria-label="Dismiss"
        >
          ✕
        </button>
      </div>

      {!choice ? (
        <div className="flex gap-2 flex-wrap">
          {MAP_CHOICES.map(({ key, label, emoji, description }) => (
            <button
              key={key}
              onClick={() => handleChoose(key)}
              className="flex-1 min-w-0 flex flex-col items-center gap-0.5 py-2 px-1 rounded-md bg-white border border-amber-200 hover:border-amber-400 text-xs text-amber-700 transition-colors"
            >
              <span className="text-base">{emoji}</span>
              <span className="font-medium">{label}</span>
              <span className="text-amber-500 text-center leading-tight">{description}</span>
            </button>
          ))}
        </div>
      ) : (
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-amber-800">
            {MAP_CHOICES.find((c) => c.key === choice)?.emoji} Try one of these:
          </p>
          <ul className="space-y-1">
            {MAP_FIX_SUGGESTIONS[choice].map((tip, i) => (
              <li key={i} className="text-xs text-amber-700 flex gap-1.5">
                <span className="text-amber-400 flex-shrink-0">•</span>
                {tip}
              </li>
            ))}
          </ul>
          <button
            onClick={() => onDismiss(habit.id)}
            className="mt-2 text-xs text-amber-600 font-medium hover:underline"
          >
            Got it, thanks ✓
          </button>
        </div>
      )}
    </div>
  )
}

MapCheckin.propTypes = {
  habit: PropTypes.shape({
    id: PropTypes.number.isRequired,
    mapMissedDays: PropTypes.number.isRequired,
  }).isRequired,
  onDismiss: PropTypes.func.isRequired,
  onRespond: PropTypes.func.isRequired,
}
