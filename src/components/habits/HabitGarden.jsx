import PropTypes from 'prop-types'
import { subDays, format } from 'date-fns'
import { computePhase } from '../../hooks/useHabits.js'

const EMOTION_PLANT = {
  great: '🌻',
  good: '🌸',
  okay: '🌿',
  meh: '🌱',
  null: '🌱',
}

function getPlantEmoji(emotion) {
  return EMOTION_PLANT[emotion] ?? '🌱'
}

export function HabitGarden({ habit }) {
  const completionMap = new Map(habit.completions.map((c) => [c.date, c.emotion]))

  const days = Array.from({ length: 30 }, (_, i) => {
    const date = subDays(new Date(), 29 - i)
    const isoDate = format(date, 'yyyy-MM-dd')
    const completed = completionMap.has(isoDate)
    const emotion = completionMap.get(isoDate) ?? null
    return { isoDate, completed, emotion }
  })

  const phase = computePhase(habit.totalWins ?? 0)

  return (
    <div className="mt-2 mb-2 px-1">
      <div className="grid grid-cols-10 gap-0.5">
        {days.map(({ isoDate, completed, emotion }) => (
          <div
            key={isoDate}
            title={isoDate}
            className="w-full aspect-square flex items-center justify-center rounded-sm text-sm"
            style={{ fontSize: '0.7rem' }}
          >
            {completed ? (
              <span title={`${isoDate}: ${emotion ?? 'completed'}`}>
                {getPlantEmoji(emotion)}
              </span>
            ) : (
              <span className="block w-full h-full rounded-sm bg-gray-100" />
            )}
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between mt-2">
        <p className="text-xs text-gray-400">Last 30 days</p>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-medium ${phase.color}`}>
            {phase.icon} {phase.label}
          </span>
          <span className="text-xs text-gray-400">
            Total wins: {habit.totalWins ?? 0}
          </span>
        </div>
      </div>
    </div>
  )
}

HabitGarden.propTypes = {
  habit: PropTypes.shape({
    completions: PropTypes.arrayOf(
      PropTypes.shape({
        date: PropTypes.string.isRequired,
        emotion: PropTypes.string,
      })
    ).isRequired,
    totalWins: PropTypes.number,
  }).isRequired,
}
