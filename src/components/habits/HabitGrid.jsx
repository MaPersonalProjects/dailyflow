import PropTypes from 'prop-types'
import { subDays, format } from 'date-fns'
import { HABIT_COLORS } from '../../constants.js'

export function HabitGrid({ habit }) {
  const colorConfig = HABIT_COLORS.find((c) => c.key === habit.color) || HABIT_COLORS[5]
  const completionSet = new Set(habit.completions)

  const days = Array.from({ length: 30 }, (_, i) => {
    const date = subDays(new Date(), 29 - i)
    const isoDate = format(date, 'yyyy-MM-dd')
    return { isoDate, completed: completionSet.has(isoDate), date }
  })

  return (
    <div className="mt-2 ml-9 mb-2">
      <div className="flex gap-0.5 flex-wrap">
        {days.map(({ isoDate, completed }) => (
          <div
            key={isoDate}
            title={isoDate}
            className={`w-4 h-4 rounded-sm ${completed ? colorConfig.bg : 'bg-gray-100'}`}
          />
        ))}
      </div>
      <p className="text-xs text-gray-400 mt-1">Last 30 days</p>
    </div>
  )
}

HabitGrid.propTypes = {
  habit: PropTypes.shape({
    completions: PropTypes.arrayOf(PropTypes.string).isRequired,
    color: PropTypes.string,
  }).isRequired,
}
