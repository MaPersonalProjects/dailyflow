import { useState, useRef, useEffect } from 'react'
import { format } from 'date-fns'
import { useTasksContext } from '../../contexts/TasksContext.jsx'
import { useSchedule } from '../../hooks/useSchedule.js'
import { useTodayPanel } from '../../hooks/useTodayPanel.js'
import { TodayItem } from './TodayItem.jsx'
import { FreeTimeCard } from './FreeTimeCard.jsx'
import { TaskDetailModal } from './TaskDetailModal.jsx'
import { CATEGORY_COLORS } from '../../constants.js'
import { getToday } from '../../utils/dateHelpers.js'

export function TodayPanel() {
  const { tasks, toggleComplete, skipTask } = useTasksContext()
  const today = getToday()
  const { events } = useSchedule()
  const { timedItems, unscheduledTasks, freeGaps, currentIndex } = useTodayPanel(tasks, events)

  const [selectedItem, setSelectedItem] = useState(null)
  const currentItemRef = useRef(null)

  useEffect(() => {
    if (currentItemRef.current) {
      currentItemRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [])

  function handleDone(item) {
    if (item.itemType === 'task') toggleComplete(item.id, today)
  }

  function handleSkip(item) {
    if (item.itemType === 'task') skipTask(item.id)
  }

  const gapMap = {}
  freeGaps.forEach((g) => { gapMap[g.afterIndex] = g })

  const completedTimedItems = timedItems.filter((i) => i.glowState === 'done')
  const activeTimedItems = timedItems.filter((i) => i.glowState !== 'done')

  const hasAnything = timedItems.length > 0 || unscheduledTasks.length > 0

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Date header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {format(new Date(), 'EEEE, MMMM d')}
        </h2>
        <p className="text-sm text-gray-400 mt-0.5">Today's timeline</p>
      </div>

      {!hasAnything && (
        <div className="text-center py-16 text-gray-400">
          <div className="text-4xl mb-3">🌅</div>
          <p className="text-lg font-medium text-gray-500">Nothing scheduled</p>
          <p className="text-sm mt-1">Enjoy your free day!</p>
        </div>
      )}

      {/* Timed items */}
      {activeTimedItems.length > 0 && (
        <section className="mb-6">
          {activeTimedItems.map((item, idx) => {
            const originalIndex = timedItems.indexOf(item)
            const gap = gapMap[originalIndex]
            const isCurrentItem = item.glowState === 'current'

            return (
              <div key={item.id}>
                <TodayItem
                  item={item}
                  glowState={item.glowState}
                  onSelect={setSelectedItem}
                  onDone={handleDone}
                  onSkip={handleSkip}
                  itemRef={isCurrentItem ? currentItemRef : null}
                />
                {gap && <FreeTimeCard fromTime={gap.fromTime} untilTime={gap.untilTime} />}
              </div>
            )
          })}
        </section>
      )}

      {/* Unscheduled tasks */}
      {unscheduledTasks.length > 0 && (
        <section className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Unscheduled</span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>
          {unscheduledTasks.map((task) => {
            const catColors = CATEGORY_COLORS[task.category] ?? CATEGORY_COLORS.Other
            const item = {
              id: task.id,
              itemType: 'task',
              title: task.title,
              startTime: null,
              endTime: null,
              dueTime: null,
              colorHex: catColors.hex,
              colorKey: null,
              category: task.category,
              completed: task.completed,
              skipped: task.skipped ?? false,
              notes: task.notes,
              originalItem: task,
            }
            return (
              <TodayItem
                key={task.id}
                item={item}
                glowState="future"
                onSelect={setSelectedItem}
                onDone={handleDone}
                onSkip={handleSkip}
              />
            )
          })}
        </section>
      )}

      {/* Completed items */}
      {completedTimedItems.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-3">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Completed</span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>
          {completedTimedItems.map((item) => (
            <TodayItem
              key={item.id}
              item={item}
              glowState="done"
              onSelect={setSelectedItem}
              onDone={handleDone}
              onSkip={handleSkip}
            />
          ))}
        </section>
      )}

      {/* Detail modal */}
      {selectedItem && (
        <TaskDetailModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onDone={(i) => { handleDone(i); setSelectedItem(null) }}
          onSkip={(i) => { handleSkip(i); setSelectedItem(null) }}
        />
      )}
    </div>
  )
}
