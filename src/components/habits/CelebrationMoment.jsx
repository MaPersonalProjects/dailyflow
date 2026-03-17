import PropTypes from 'prop-types'
import { CELEBRATION_TYPES } from '../../constants.js'

export function CelebrationMoment({ habit, onDone }) {
  const celebrationType = CELEBRATION_TYPES.find((t) => t.key === habit.celebration)
  const emoji = celebrationType?.emoji ?? '🎉'
  const label =
    habit.celebration === 'custom' && habit.celebrationCustom
      ? habit.celebrationCustom
      : celebrationType?.description ?? 'Celebrate!'

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 text-center">
        <div className="text-7xl animate-bounce mb-4">{emoji}</div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">You did it! 🎊</h2>
        <p className="text-sm text-gray-500 mb-2">
          <span className="font-medium text-gray-700">After</span>{' '}
          {habit.anchor},{' '}
          <span className="font-medium text-gray-700">I</span>{' '}
          {habit.behavior}.
        </p>
        <p className="text-sm text-indigo-600 font-medium mb-6">{label}</p>
        <button
          onClick={onDone}
          className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold text-base hover:bg-indigo-700 transition-colors"
        >
          I celebrated! 🌟
        </button>
      </div>
    </div>
  )
}

CelebrationMoment.propTypes = {
  habit: PropTypes.shape({
    anchor: PropTypes.string.isRequired,
    behavior: PropTypes.string.isRequired,
    celebration: PropTypes.string.isRequired,
    celebrationCustom: PropTypes.string,
  }).isRequired,
  onDone: PropTypes.func.isRequired,
}
