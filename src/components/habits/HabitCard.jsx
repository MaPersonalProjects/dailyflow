import PropTypes from 'prop-types'
import { PhaseBadge } from './PhaseBadge.jsx'
import { WinsBadge } from './WinsBadge.jsx'
import { EmotionSparkline } from './EmotionSparkline.jsx'
import { HabitGarden } from './HabitGarden.jsx'
import { computePhase } from '../../hooks/useHabits.js'

export function HabitCard({ habit, onComplete, onEdit, onDelete, today, isCompleted, expanded, onToggleExpand, selectMode, isSelected, onToggleSelect }) {
  const phase = computePhase(habit.totalWins ?? 0)

  return (
    <div
      className={`bg-white rounded-lg border p-3 transition-colors ${
        selectMode && isSelected
          ? 'border-indigo-300 bg-indigo-50'
          : isCompleted
          ? 'border-green-200 bg-green-50'
          : 'border-gray-200'
      }`}
      onClick={selectMode ? () => onToggleSelect(habit.id) : undefined}
    >
      <div className="flex items-start gap-3">
        {/* Left control: checkbox in select mode, complete button otherwise */}
        {selectMode ? (
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onToggleSelect(habit.id)}
            onClick={(e) => e.stopPropagation()}
            className="mt-1 w-4 h-4 accent-indigo-600 flex-shrink-0 cursor-pointer"
          />
        ) : (
          <button
            onClick={() => !isCompleted && onComplete(habit.id, today)}
            disabled={isCompleted}
            className={`w-7 h-7 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors mt-0.5 ${
              isCompleted
                ? 'border-green-500 bg-green-500 cursor-default'
                : 'border-gray-300 hover:border-indigo-400 hover:bg-indigo-50'
            }`}
            aria-label={isCompleted ? 'Completed today' : 'Mark complete'}
          >
            {isCompleted && (
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>
        )}

        {/* Recipe + badges */}
        <div className="flex-1 min-w-0 cursor-pointer" onClick={onToggleExpand}>
          <div className="flex items-center gap-2 flex-wrap mb-0.5">
            <PhaseBadge phase={phase} />
            <WinsBadge totalWins={habit.totalWins ?? 0} phase={phase} />
          </div>
          <p className="text-sm text-gray-700">
            <span className="text-gray-400">After I </span>
            <span className="font-medium text-gray-800">{habit.anchor}</span>
            <span className="text-gray-400">, I will </span>
            <span className={`font-medium ${isCompleted ? 'text-green-700' : 'text-indigo-700'}`}>
              {habit.behavior}
            </span>
            <span className="text-gray-400">.</span>
          </p>
          {habit.category && (
            <span className="text-xs text-gray-400">{habit.category}</span>
          )}
          {expanded && <EmotionSparkline completions={habit.completions} />}
        </div>

        {/* Actions — hidden in select mode */}
        {!selectMode && (
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button
              onClick={() => onEdit(habit)}
              className="text-gray-400 hover:text-gray-600 text-sm"
              aria-label="Edit habit"
            >
              ✎
            </button>
            <button
              onClick={() => onDelete(habit.id)}
              className="text-gray-300 hover:text-red-500 text-sm"
              aria-label="Delete habit"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {expanded && <HabitGarden habit={habit} />}
    </div>
  )
}

HabitCard.propTypes = {
  habit: PropTypes.shape({
    id: PropTypes.number.isRequired,
    anchor: PropTypes.string.isRequired,
    behavior: PropTypes.string.isRequired,
    category: PropTypes.string,
    completions: PropTypes.array.isRequired,
    totalWins: PropTypes.number,
    celebration: PropTypes.string,
    celebrationCustom: PropTypes.string,
  }).isRequired,
  onComplete: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  today: PropTypes.string.isRequired,
  isCompleted: PropTypes.bool.isRequired,
  expanded: PropTypes.bool,
  onToggleExpand: PropTypes.func,
  selectMode: PropTypes.bool,
  isSelected: PropTypes.bool,
  onToggleSelect: PropTypes.func,
}

HabitCard.defaultProps = {
  expanded: false,
  onToggleExpand: () => {},
  selectMode: false,
  isSelected: false,
  onToggleSelect: () => {},
}
