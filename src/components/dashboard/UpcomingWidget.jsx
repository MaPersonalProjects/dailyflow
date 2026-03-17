import PropTypes from 'prop-types'
import { formatDate, formatTime } from '../../utils/dateHelpers.js'
import { EVENT_COLORS } from '../../constants.js'

export function UpcomingWidget({ upcomingEvents }) {
  if (upcomingEvents.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Upcoming Events</h3>
        <p className="text-sm text-gray-400">No upcoming events</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">Upcoming Events</h3>
      <ul className="space-y-2">
        {upcomingEvents.map((event) => {
          const colorConfig = EVENT_COLORS.find((c) => c.key === event.color) || EVENT_COLORS[0]
          return (
            <li key={event.id} className={`flex items-start gap-2 p-2 rounded ${colorConfig.light}`}>
              <div className={`w-1 rounded-full self-stretch ${colorConfig.bg} min-h-[32px]`} />
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${colorConfig.text} truncate`}>{event.title}</p>
                <p className="text-xs text-gray-500">
                  {formatDate(event.date)} {event.startTime && `· ${formatTime(event.startTime)}`}
                </p>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

UpcomingWidget.propTypes = {
  upcomingEvents: PropTypes.array.isRequired,
}
