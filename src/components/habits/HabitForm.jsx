import { useState } from 'react'
import PropTypes from 'prop-types'
import { CATEGORIES, DAYS_OF_WEEK, HABIT_COLORS } from '../../constants.js'
import { AnchorMenu } from './AnchorMenu.jsx'
import { BehaviorSizer } from './BehaviorSizer.jsx'
import { CelebrationPicker } from './CelebrationPicker.jsx'

const STEPS = [
  { label: 'Anchor', description: 'When will you do it?' },
  { label: 'Behavior', description: 'What tiny thing will you do?' },
  { label: 'Celebration', description: 'How will you celebrate?' },
  { label: 'Schedule', description: 'When does it apply?' },
]

function buildInitialForm(initial) {
  return {
    anchor: initial?.anchor ?? '',
    anchorCategory: initial?.anchorCategory ?? 'custom',
    behavior: initial?.behavior ?? '',
    behaviorSize: initial?.behaviorSize ?? 'tiny',
    celebration: initial?.celebration ?? 'fist-pump',
    celebrationCustom: initial?.celebrationCustom ?? '',
    targetDays: initial?.targetDays ?? ['mon', 'tue', 'wed', 'thu', 'fri'],
    color: initial?.color ?? 'blue',
    category: initial?.category ?? 'Personal',
  }
}

function isStepValid(step, form) {
  if (step === 0) return form.anchor.trim().length > 0
  if (step === 1) return form.behavior.trim().length > 0
  if (step === 2) return form.celebration !== 'custom' || form.celebrationCustom.trim().length > 0
  return true
}

export function HabitForm({ onSubmit, onClose, initial }) {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState(() => buildInitialForm(initial))

  const set = (field, value) => setForm((f) => ({ ...f, [field]: value }))

  const toggleDay = (dayKey) => {
    setForm((f) => ({
      ...f,
      targetDays: f.targetDays.includes(dayKey)
        ? f.targetDays.filter((d) => d !== dayKey)
        : [...f.targetDays, dayKey],
    }))
  }

  const handleNext = () => {
    if (step < STEPS.length - 1) setStep((s) => s + 1)
  }

  const handleBack = () => {
    if (step > 0) setStep((s) => s - 1)
  }

  const handleSubmit = () => {
    onSubmit(form)
  }

  const valid = isStepValid(step, form)
  const isEditing = !!initial

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-base font-semibold text-gray-800">
              {isEditing ? 'Edit Habit' : 'Plant a Habit'}
            </h2>
            <p className="text-xs text-gray-400">{STEPS[step].description}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>

        {/* Progress */}
        <div className="px-5 pt-4">
          <div className="flex items-center gap-2 mb-1">
            {STEPS.map((s, i) => (
              <button
                key={i}
                type="button"
                onClick={() => i < step && setStep(i)}
                className={`flex-1 flex flex-col items-center gap-0.5 ${i <= step ? '' : 'opacity-40'}`}
              >
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                    i < step
                      ? 'bg-green-500 text-white'
                      : i === step
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {i < step ? '✓' : i + 1}
                </span>
                <span className="text-xs text-gray-500 hidden sm:block">{s.label}</span>
              </button>
            ))}
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1 mb-4">
            <div
              className="bg-indigo-500 h-1 rounded-full transition-all"
              style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Step content */}
        <div className="flex-1 overflow-y-auto px-5 pb-4">
          {step === 0 && (
            <div className="space-y-3">
              <p className="text-sm text-gray-600">
                Pick an existing behavior as your anchor — something you already do automatically.
              </p>
              <AnchorMenu
                value={form.anchor}
                anchorCategory={form.anchorCategory}
                onChange={(anchor, cat) => {
                  set('anchor', anchor)
                  set('anchorCategory', cat)
                }}
              />
              {form.anchor && (
                <p className="text-sm text-indigo-600 bg-indigo-50 px-3 py-2 rounded-md">
                  <strong>After I</strong> {form.anchor}…
                </p>
              )}
            </div>
          )}

          {step === 1 && (
            <div className="space-y-3">
              <p className="text-sm text-gray-600">
                Make your behavior as tiny as possible. It should take less than 30 seconds.
              </p>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">I will…</label>
                <input
                  type="text"
                  value={form.behavior}
                  onChange={(e) => set('behavior', e.target.value)}
                  autoFocus
                  placeholder="e.g. write one sentence in my journal"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              {form.behavior && (
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-2">
                    How tiny is this behavior?
                  </label>
                  <BehaviorSizer
                    value={form.behaviorSize}
                    onChange={(size) => set('behaviorSize', size)}
                  />
                </div>
              )}
              {form.anchor && form.behavior && (
                <p className="text-sm text-indigo-600 bg-indigo-50 px-3 py-2 rounded-md">
                  After I {form.anchor}, I will <strong>{form.behavior}</strong>.
                </p>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-3">
              <p className="text-sm text-gray-600">
                Celebration wires your habit to a positive emotion. Pick one you&apos;ll actually do!
              </p>
              <CelebrationPicker
                value={form.celebration}
                customValue={form.celebrationCustom}
                onChange={(key) => set('celebration', key)}
                onCustomChange={(text) => set('celebrationCustom', text)}
              />
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">Target Days</label>
                <div className="flex gap-1.5 flex-wrap">
                  {DAYS_OF_WEEK.map(({ key, label }) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => toggleDay(key)}
                      className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                        form.targetDays.includes(key)
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => set('category', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Color</label>
                <div className="flex gap-2 flex-wrap">
                  {HABIT_COLORS.map((c) => (
                    <button
                      key={c.key}
                      type="button"
                      onClick={() => set('color', c.key)}
                      className={`w-6 h-6 rounded-full ${c.bg} transition-transform ${
                        form.color === c.key
                          ? 'ring-2 ring-offset-1 ring-gray-600 scale-110'
                          : 'hover:scale-105'
                      }`}
                      aria-label={c.label}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-gray-100 flex gap-2">
          {step > 0 ? (
            <button
              type="button"
              onClick={handleBack}
              className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-md text-sm font-medium hover:bg-gray-50"
            >
              Back
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-md text-sm font-medium hover:bg-gray-50"
            >
              Cancel
            </button>
          )}

          {step < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={handleNext}
              disabled={!valid}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
                valid
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              Next →
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!valid}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
                valid
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {isEditing ? 'Save Changes' : '🌱 Plant This Habit'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

HabitForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  initial: PropTypes.object,
}
