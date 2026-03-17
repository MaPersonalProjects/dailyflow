import PropTypes from 'prop-types'

const NAV_ITEMS = [
  { id: 'today', label: 'Today', icon: '🗓️' },
  { id: 'tasks', label: 'Tasks', icon: '✅' },
  { id: 'schedule', label: 'Schedule', icon: '📅' },
  { id: 'habits', label: 'Habits', icon: '🔥' },
  { id: 'reminders', label: 'Reminders', icon: '🔔' },
]

export function Sidebar({ activeSection, onNavigate }) {
  return (
    <aside className="hidden md:flex flex-col w-56 min-h-screen bg-gray-900 text-white">
      <div className="px-6 py-5 border-b border-gray-700">
        <h1 className="text-xl font-bold text-white tracking-tight">DailyFlow</h1>
        <p className="text-xs text-gray-400 mt-0.5">Your productivity hub</p>
      </div>
      <nav className="flex-1 py-4">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`w-full flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors ${
              activeSection === item.id
                ? 'bg-indigo-600 text-white'
                : 'text-gray-300 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <span className="text-base">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>
      <div className="px-6 py-4 border-t border-gray-700 text-xs text-gray-500">
        Offline · Local storage
      </div>
    </aside>
  )
}

Sidebar.propTypes = {
  activeSection: PropTypes.string.isRequired,
  onNavigate: PropTypes.func.isRequired,
}
