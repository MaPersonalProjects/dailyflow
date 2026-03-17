import PropTypes from 'prop-types'

export function DailySummary({ todaysTasks, habitRate, overdueCount }) {
  const completedToday = todaysTasks.filter((t) => t.completed).length
  const totalToday = todaysTasks.length

  const stats = [
    {
      label: 'Tasks Done',
      value: `${completedToday}/${totalToday}`,
      color: 'bg-blue-50 border-blue-200',
      textColor: 'text-blue-700',
      sub: completedToday === totalToday && totalToday > 0 ? 'All done!' : `${totalToday - completedToday} remaining`,
    },
    {
      label: 'Habits',
      value: `${Math.round(habitRate * 100)}%`,
      color: 'bg-green-50 border-green-200',
      textColor: 'text-green-700',
      sub: 'Wins today',
    },
    {
      label: 'Overdue',
      value: overdueCount,
      color: overdueCount > 0 ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200',
      textColor: overdueCount > 0 ? 'text-red-700' : 'text-gray-600',
      sub: overdueCount > 0 ? 'Need attention' : 'All clear',
    },
  ]

  return (
    <div className="grid grid-cols-3 gap-3">
      {stats.map((stat) => (
        <div key={stat.label} className={`rounded-lg border p-3 ${stat.color}`}>
          <p className="text-xs text-gray-500 font-medium">{stat.label}</p>
          <p className={`text-2xl font-bold mt-1 ${stat.textColor}`}>{stat.value}</p>
          <p className="text-xs text-gray-400 mt-0.5">{stat.sub}</p>
        </div>
      ))}
    </div>
  )
}

DailySummary.propTypes = {
  todaysTasks: PropTypes.array.isRequired,
  habitRate: PropTypes.number.isRequired,
  overdueCount: PropTypes.number.isRequired,
}
