import { useDashboard } from '../../hooks/useDashboard.js'
import { DailySummary } from './DailySummary.jsx'
import { UpcomingWidget } from './UpcomingWidget.jsx'
import { HabitRing } from './HabitRing.jsx'
import PropTypes from 'prop-types'

export function Dashboard({ tasks, events, habits, reminders }) {
  const { todaysTasks, upcomingEvents, overdueReminders, habitCompletionRate } =
    useDashboard({ tasks, events, habits, reminders })

  return (
    <div className="p-4 md:p-6 space-y-5 max-w-2xl">
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <DailySummary
            todaysTasks={todaysTasks}
            habitRate={habitCompletionRate}
            overdueCount={overdueReminders.length}
          />
        </div>
        <HabitRing completionRate={habitCompletionRate} />
      </div>
      <UpcomingWidget upcomingEvents={upcomingEvents} />
      {overdueReminders.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-red-700 mb-2">
            Overdue Reminders ({overdueReminders.length})
          </h3>
          <ul className="space-y-1">
            {overdueReminders.map((r) => (
              <li key={r.id} className="text-sm text-red-600">• {r.title}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

Dashboard.propTypes = {
  tasks: PropTypes.array.isRequired,
  events: PropTypes.array.isRequired,
  habits: PropTypes.array.isRequired,
  reminders: PropTypes.array.isRequired,
}
