import PropTypes from 'prop-types'
import { formatTime } from '../../utils/dateHelpers.js'

export function FreeTimeCard({ fromTime, untilTime }) {
  return (
    <div className="flex items-center gap-2 py-2 ml-4 border-l-2 border-dashed border-gray-200 pl-3">
      <span className="text-gray-300 text-xs tracking-widest">···</span>
      <span className="text-gray-400 text-sm">
        Free time · until {formatTime(untilTime)}
      </span>
      <span className="text-gray-300 text-xs tracking-widest">···</span>
    </div>
  )
}

FreeTimeCard.propTypes = {
  fromTime: PropTypes.string.isRequired,
  untilTime: PropTypes.string.isRequired,
}
