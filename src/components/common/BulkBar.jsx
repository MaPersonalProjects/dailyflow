import PropTypes from 'prop-types'

/**
 * Sticky bottom bar shown when bulk-select mode is active.
 * The parent is responsible for positioning context (fixed vs absolute).
 */
export function BulkBar({ count, total, onSelectAll, onDeselectAll, onDelete, onCancel }) {
  const allSelected = total > 0 && count === total

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-lg">
      <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
        <span className="text-sm font-medium text-gray-700">
          {count} selected
        </span>
        <button
          onClick={allSelected ? onDeselectAll : onSelectAll}
          className="text-xs text-indigo-600 hover:underline"
        >
          {allSelected ? 'Deselect all' : 'Select all'}
        </button>

        <div className="flex-1" />

        <button
          onClick={onCancel}
          className="text-sm text-gray-500 hover:text-gray-700 px-3 py-1.5 rounded-md hover:bg-gray-100 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onDelete}
          disabled={count === 0}
          className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
            count > 0
              ? 'bg-red-600 text-white hover:bg-red-700'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          Delete{count > 0 ? ` (${count})` : ''}
        </button>
      </div>
    </div>
  )
}

BulkBar.propTypes = {
  count: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  onSelectAll: PropTypes.func.isRequired,
  onDeselectAll: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
}
