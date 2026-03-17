import PropTypes from 'prop-types'

const EMOTIONS = [
  { key: 'great', emoji: '😄', label: 'Great' },
  { key: 'good', emoji: '🙂', label: 'Good' },
  { key: 'okay', emoji: '😐', label: 'Okay' },
  { key: 'meh', emoji: '😔', label: 'Meh' },
]

export function EmotionLogger({ onLog, onSkip }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center">
        <h3 className="text-base font-semibold text-gray-800 mb-1">How did it feel?</h3>
        <p className="text-sm text-gray-500 mb-5">Noticing your emotions builds self-awareness.</p>

        <div className="flex justify-center gap-4 mb-5">
          {EMOTIONS.map(({ key, emoji, label }) => (
            <button
              key={key}
              onClick={() => onLog(key)}
              className="flex flex-col items-center gap-1 group"
            >
              <span className="text-3xl transition-transform group-hover:scale-125">{emoji}</span>
              <span className="text-xs text-gray-500">{label}</span>
            </button>
          ))}
        </div>

        <button
          onClick={onSkip}
          className="text-xs text-gray-400 hover:text-gray-600 underline"
        >
          Skip for now
        </button>
      </div>
    </div>
  )
}

EmotionLogger.propTypes = {
  onLog: PropTypes.func.isRequired,
  onSkip: PropTypes.func.isRequired,
}
