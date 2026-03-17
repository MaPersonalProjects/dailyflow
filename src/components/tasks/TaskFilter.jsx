import PropTypes from 'prop-types'
import { PRIORITIES, CATEGORIES } from '../../constants.js'

export function TaskFilter({ filters, onChange }) {
  return (
    <div className="flex flex-wrap gap-2 items-center">
      <select
        value={filters.priority}
        onChange={(e) => onChange({ ...filters, priority: e.target.value })}
        className="text-sm border border-gray-300 rounded-md px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <option value="">All Priorities</option>
        {Object.entries(PRIORITIES).map(([key, val]) => (
          <option key={key} value={key}>{val.label}</option>
        ))}
      </select>

      <select
        value={filters.category}
        onChange={(e) => onChange({ ...filters, category: e.target.value })}
        className="text-sm border border-gray-300 rounded-md px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <option value="">All Categories</option>
        {CATEGORIES.map((cat) => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>

      <label className="flex items-center gap-1.5 text-sm text-gray-600 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={filters.showCompleted}
          onChange={(e) => onChange({ ...filters, showCompleted: e.target.checked })}
          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
        />
        Show completed
      </label>
    </div>
  )
}

TaskFilter.propTypes = {
  filters: PropTypes.shape({
    priority: PropTypes.string,
    category: PropTypes.string,
    showCompleted: PropTypes.bool,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
}
