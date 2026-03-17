import PropTypes from 'prop-types'
import { computePhase } from '../../hooks/useHabits.js'

export function HabitStackView({ stacks, habits, today, onComplete, onAddStack, onDeleteStack }) {
  const habitMap = new Map(habits.map((h) => [String(h.id), h]))

  return (
    <div className="space-y-4">
      {stacks.map((stack) => {
        const stackHabits = stack.habitIds
          .map((id) => habitMap.get(id))
          .filter(Boolean)

        return (
          <div key={stack.id} className="border border-gray-200 rounded-xl p-4 bg-white">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-gray-800 text-sm">{stack.name}</h3>
              <button
                onClick={() => onDeleteStack(stack.id)}
                className="text-gray-300 hover:text-red-400 text-xs"
                aria-label="Delete stack"
              >
                ✕
              </button>
            </div>

            {stackHabits.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-2">No habits in this stack yet.</p>
            ) : (
              <div className="relative pl-4">
                {/* Vertical line */}
                <div className="absolute left-2 top-3 bottom-3 w-0.5 bg-gray-200" />

                <div className="space-y-3">
                  {stackHabits.map((habit, idx) => {
                    const isCompleted = habit.completions.some((c) => c.date === today)
                    const phase = computePhase(habit.totalWins ?? 0)

                    return (
                      <div key={habit.id} className="flex items-start gap-3">
                        {/* Chain node */}
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 z-10 text-xs font-bold ${
                            isCompleted
                              ? 'border-green-500 bg-green-500 text-white'
                              : 'border-gray-300 bg-white text-gray-400'
                          }`}
                        >
                          {isCompleted ? '✓' : idx + 1}
                        </div>

                        <div className="flex-1 min-w-0 pb-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs">{phase.icon}</span>
                            <p className="text-sm text-gray-700">
                              <span className="font-medium">{habit.anchor}</span>
                              <span className="text-gray-400"> → </span>
                              <span className={isCompleted ? 'text-green-700' : 'text-indigo-700'}>
                                {habit.behavior}
                              </span>
                            </p>
                          </div>
                        </div>

                        {!isCompleted && (
                          <button
                            onClick={() => onComplete(habit.id, today)}
                            className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex-shrink-0"
                          >
                            Done
                          </button>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )
      })}

      <button
        onClick={onAddStack}
        className="w-full border-2 border-dashed border-gray-300 rounded-xl py-4 text-sm text-gray-400 hover:border-indigo-300 hover:text-indigo-500 transition-colors"
      >
        + Create New Stack
      </button>
    </div>
  )
}

HabitStackView.propTypes = {
  stacks: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      habitIds: PropTypes.arrayOf(PropTypes.string).isRequired,
    })
  ).isRequired,
  habits: PropTypes.array.isRequired,
  today: PropTypes.string.isRequired,
  onComplete: PropTypes.func.isRequired,
  onAddStack: PropTypes.func.isRequired,
  onDeleteStack: PropTypes.func.isRequired,
}
