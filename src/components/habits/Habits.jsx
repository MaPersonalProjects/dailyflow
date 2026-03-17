import { useState } from 'react'
import { useHabits } from '../../hooks/useHabits.js'
import { useHabitStacks } from '../../hooks/useHabitStacks.js'
import { HabitCard } from './HabitCard.jsx'
import { HabitGarden } from './HabitGarden.jsx'
import { HabitForm } from './HabitForm.jsx'
import { CelebrationMoment } from './CelebrationMoment.jsx'
import { EmotionLogger } from './EmotionLogger.jsx'
import { MapCheckin } from './MapCheckin.jsx'
import { HabitStackView } from './HabitStackView.jsx'
import { BulkBar } from '../common/BulkBar.jsx'
import { getToday, getTodayDayKey } from '../../utils/dateHelpers.js'

const TABS = [
  { key: 'today', label: 'Today' },
  { key: 'garden', label: '🌿 Garden' },
  { key: 'stacks', label: '🔗 Stacks' },
]

export function Habits() {
  const {
    habits,
    addHabit,
    updateHabit,
    deleteHabit,
    logCompletion,
    updateEmotion,
    dismissMapCheckin,
    recordMapResponse,
    habitNeedsMapCheckin,
    bulkDeleteHabits,
  } = useHabits()

  const { stacks, addStack, deleteStack } = useHabitStacks()

  const [showForm, setShowForm] = useState(false)
  const [editingHabit, setEditingHabit] = useState(null)
  const [expandedId, setExpandedId] = useState(null)
  const [activeView, setActiveView] = useState('today')
  const [selectMode, setSelectMode] = useState(false)
  const [selectedIds, setSelectedIds] = useState(new Set())

  // Completion flow state
  const [pendingCompletion, setPendingCompletion] = useState(null) // { habitId, date }
  const [showCelebration, setShowCelebration] = useState(false)
  const [showEmotionLogger, setShowEmotionLogger] = useState(false)

  const today = getToday()
  const todayKey = getTodayDayKey()
  const todaysHabits = habits.filter((h) => h.targetDays.includes(todayKey))
  const otherHabits = habits.filter((h) => !h.targetDays.includes(todayKey))

  const completedTodayCount = todaysHabits.filter((h) =>
    h.completions.some((c) => c.date === today)
  ).length

  // ── Completion flow ────────────────────────────────────────────────────────

  const handleComplete = (habitId, date) => {
    setPendingCompletion({ habitId, date })
    setShowCelebration(true)
  }

  const handleCelebrationDone = () => {
    if (!pendingCompletion) return
    logCompletion(pendingCompletion.habitId, pendingCompletion.date, null)
    setShowCelebration(false)
    setShowEmotionLogger(true)
  }

  const handleEmotionLog = (emotion) => {
    if (pendingCompletion) {
      updateEmotion(pendingCompletion.habitId, pendingCompletion.date, emotion)
    }
    setShowEmotionLogger(false)
    setPendingCompletion(null)
  }

  const handleEmotionSkip = () => {
    setShowEmotionLogger(false)
    setPendingCompletion(null)
  }

  // ── Form ──────────────────────────────────────────────────────────────────

  const handleSubmit = (data) => {
    if (editingHabit) {
      updateHabit(editingHabit.id, data)
    } else {
      addHabit(data)
    }
    setShowForm(false)
    setEditingHabit(null)
  }

  const handleEdit = (habit) => {
    setEditingHabit(habit)
    setShowForm(true)
  }

  // ── Stacks ────────────────────────────────────────────────────────────────

  const handleAddStack = () => {
    const name = prompt('Stack name (e.g. "Morning Routine"):')
    if (name?.trim()) addStack(name.trim())
  }

  // ── Render ────────────────────────────────────────────────────────────────

  const celebrationHabit = pendingCompletion
    ? habits.find((h) => h.id === pendingCompletion.habitId)
    : null

  const toggleSelectHabit = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const exitSelectMode = () => {
    setSelectMode(false)
    setSelectedIds(new Set())
  }

  const handleBulkDelete = () => {
    bulkDeleteHabits([...selectedIds])
    exitSelectMode()
  }

  const renderHabitCard = (habit) => {
    const isCompleted = habit.completions.some((c) => c.date === today)
    const needsCheckin = !selectMode && habitNeedsMapCheckin(habit, today)

    return (
      <div key={habit.id}>
        {needsCheckin && (
          <MapCheckin
            habit={habit}
            onDismiss={dismissMapCheckin}
            onRespond={recordMapResponse}
          />
        )}
        <HabitCard
          habit={habit}
          today={today}
          isCompleted={isCompleted}
          onComplete={handleComplete}
          onEdit={handleEdit}
          onDelete={deleteHabit}
          expanded={!selectMode && expandedId === habit.id}
          onToggleExpand={() =>
            !selectMode && setExpandedId(expandedId === habit.id ? null : habit.id)
          }
          selectMode={selectMode}
          isSelected={selectedIds.has(habit.id)}
          onToggleSelect={toggleSelectHabit}
        />
      </div>
    )
  }

  return (
    <div className={`p-4 md:p-6 max-w-2xl${selectMode ? ' pb-20' : ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-500">
          {todaysHabits.length > 0
            ? `${completedTodayCount}/${todaysHabits.length} wins today`
            : 'No habits scheduled for today'}
        </h3>
        <div className="flex items-center gap-1">
          {activeView !== 'stacks' && (
            <button
              onClick={() => setSelectMode((v) => !v)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium border transition-colors ${
                selectMode
                  ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                  : 'border-gray-300 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {selectMode ? 'Selecting…' : 'Select'}
            </button>
          )}
          <button
            onClick={() => {
              setEditingHabit(null)
              setShowForm(true)
            }}
            className="bg-indigo-600 text-white px-3 py-1.5 rounded-md text-sm font-medium hover:bg-indigo-700"
          >
            🌱 Plant a Habit
          </button>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 mb-4 bg-gray-100 rounded-lg p-1">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveView(tab.key)}
            className={`flex-1 py-1.5 rounded-md text-xs font-medium transition-colors ${
              activeView === tab.key
                ? 'bg-white text-gray-800 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Today view */}
      {activeView === 'today' && (
        <>
          {habits.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              <p className="text-4xl mb-2">🌱</p>
              <p className="text-sm">No habits yet.</p>
              <p className="text-xs text-gray-300 mt-1">Plant your first tiny habit to get started.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {todaysHabits.length > 0 && (
                <>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-2 mb-1">
                    Today
                  </p>
                  {todaysHabits.map(renderHabitCard)}
                </>
              )}
              {otherHabits.length > 0 && (
                <>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-4 mb-1">
                    Other Days
                  </p>
                  {otherHabits.map(renderHabitCard)}
                </>
              )}
            </div>
          )}
        </>
      )}

      {/* Garden view */}
      {activeView === 'garden' && (
        <div className="space-y-4">
          {habits.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              <p className="text-4xl mb-2">🌿</p>
              <p className="text-sm">Your garden is empty. Plant a habit!</p>
            </div>
          ) : (
            habits.map((habit) => (
              <div key={habit.id} className="bg-white rounded-lg border border-gray-200 p-3">
                <p className="text-sm font-medium text-gray-800 mb-1">
                  {habit.anchor} → {habit.behavior}
                </p>
                <HabitGarden habit={habit} />
              </div>
            ))
          )}
        </div>
      )}

      {/* Stacks view */}
      {activeView === 'stacks' && (
        <HabitStackView
          stacks={stacks}
          habits={habits}
          today={today}
          onComplete={handleComplete}
          onAddStack={handleAddStack}
          onDeleteStack={deleteStack}
        />
      )}

      {selectMode && (
        <BulkBar
          count={selectedIds.size}
          total={todaysHabits.length + otherHabits.length}
          onSelectAll={() => setSelectedIds(new Set(habits.map((h) => h.id)))}
          onDeselectAll={() => setSelectedIds(new Set())}
          onDelete={handleBulkDelete}
          onCancel={exitSelectMode}
        />
      )}

      {/* Overlays */}
      {showCelebration && celebrationHabit && (
        <CelebrationMoment habit={celebrationHabit} onDone={handleCelebrationDone} />
      )}

      {showEmotionLogger && (
        <EmotionLogger onLog={handleEmotionLog} onSkip={handleEmotionSkip} />
      )}

      {showForm && (
        <HabitForm
          initial={editingHabit}
          onSubmit={handleSubmit}
          onClose={() => {
            setShowForm(false)
            setEditingHabit(null)
          }}
        />
      )}
    </div>
  )
}
