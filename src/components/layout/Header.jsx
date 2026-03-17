import PropTypes from 'prop-types'
import { formatDate, getToday } from '../../utils/dateHelpers.js'

export function Header({ title }) {
  return (
    <header className="bg-white border-b border-gray-200 px-4 md:px-6 py-3 flex items-center justify-between">
      <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
      <span className="text-sm text-gray-500">{formatDate(getToday())}</span>
    </header>
  )
}

Header.propTypes = {
  title: PropTypes.string.isRequired,
}
