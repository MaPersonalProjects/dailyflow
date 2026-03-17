import PropTypes from 'prop-types'
import { ReminderCard } from './ReminderCard.jsx'
import { getToday } from '../../utils/dateHelpers.js'

export function ReminderList({ reminders, onDismiss, onDelete, onEdit, selectMode, selectedIds, onToggleSelect }) {
  const today = getToday()

  const overdue = reminders.filter((r) => !r.done && r.datetime.split('T')[0] < today)
  const upcoming = reminders.filter((r) => !r.done && r.datetime.split('T')[0] >= today)
  const done = reminders.filter((r) => r.done)

  if (reminders.length === 0) {
    return (
      <div className="text-center py-10 text-gray-400">
        <p className="text-3xl mb-2">🔔</p>
        <p className="text-sm">No reminders yet. Add one to stay on track!</p>
      </div>
    )
  }

  const Section = ({ title, items }) => {
    if (items.length === 0) return null
    return (
      <div className="mb-4">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{title}</p>
        <div className="space-y-2">
          {items.map((r) => (
            <ReminderCard
              key={r.id}
              reminder={r}
              onDismiss={onDismiss}
              onDelete={onDelete}
              onEdit={onEdit}
              selectMode={selectMode}
              isSelected={selectedIds?.has(r.id) ?? false}
              onToggleSelect={onToggleSelect}
            />
          ))}
        </div>
      </div>
    )
  }

  Section.propTypes = {
    title: PropTypes.string.isRequired,
    items: PropTypes.array.isRequired,
  }

  return (
    <div>
      {overdue.length > 0 && <Section title={`Overdue (${overdue.length})`} items={overdue} />}
      <Section title="Upcoming" items={upcoming} />
      {done.length > 0 && <Section title="Done" items={done} />}
    </div>
  )
}

ReminderList.propTypes = {
  reminders: PropTypes.array.isRequired,
  onDismiss: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  selectMode: PropTypes.bool,
  selectedIds: PropTypes.instanceOf(Set),
  onToggleSelect: PropTypes.func,
}
