import PropTypes from 'prop-types'

const NAV_ITEMS = [
  { id: 'today', label: 'Today', icon: '🗓️' },
  { id: 'tasks', label: 'Tasks', icon: '✅' },
  { id: 'schedule', label: 'Schedule', icon: '📅' },
  { id: 'habits', label: 'Habits', icon: '🔥' },
  { id: 'reminders', label: 'Alerts', icon: '🔔' },
]

export function MobileNav({ activeSection, onNavigate }) {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`flex-1 flex flex-col items-center py-2 text-xs font-medium transition-colors ${
              activeSection === item.id
                ? 'text-indigo-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <span className="text-lg mb-0.5">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </div>
    </nav>
  )
}

MobileNav.propTypes = {
  activeSection: PropTypes.string.isRequired,
  onNavigate: PropTypes.func.isRequired,
}
