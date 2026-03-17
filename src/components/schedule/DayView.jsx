import { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { TimeBlock } from './TimeBlock.jsx'
import { computeEventLayout } from '../../utils/scheduleLayout.js'
import { getToday } from '../../utils/dateHelpers.js'

const HOUR_HEIGHT = 64
const SLOT_HEIGHT = 32
const TOTAL_HEIGHT = 24 * HOUR_HEIGHT
const PX_PER_MIN = HOUR_HEIGHT / 60

const SLOTS = Array.from({ length: 48 }, (_, i) => i)

function formatHour(h) {
  if (h === 0) return '12 AM'
  if (h < 12) return `${h} AM`
  if (h === 12) return '12 PM'
  return `${h - 12} PM`
}

function timeToMins(timeStr) {
  if (!timeStr) return 0
  const [h, m] = timeStr.split(':').map(Number)
  return (h || 0) * 60 + (m || 0)
}

export function DayView({ date, events, onAdd, onEdit, onDelete, selectMode, selectedIds, onToggleSelect }) {
  const [now, setNow] = useState(new Date())
  const scrollRef = useRef(null)
  const showCurrentTime = date === getToday()

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (scrollRef.current) {
      const scrollTo = showCurrentTime
        ? Math.max(0, (now.getHours() * 60 + now.getMinutes()) * PX_PER_MIN - 100)
        : 7 * HOUR_HEIGHT
      scrollRef.current.scrollTop = scrollTo
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const currentTimePx = (now.getHours() * 60 + now.getMinutes()) * PX_PER_MIN
  const laidOutEvents = computeEventLayout(events)

  const handleSlotClick = (slotIndex) => {
    const totalMins = slotIndex * 30
    const h = String(Math.floor(totalMins / 60)).padStart(2, '0')
    const m = totalMins % 60 === 0 ? '00' : '30'
    onAdd(`${h}:${m}`)
  }

  return (
    <div className="flex flex-col border border-gray-200 rounded-lg overflow-hidden">
      <div ref={scrollRef} className="overflow-y-auto" style={{ maxHeight: '70vh' }}>
        <div className="flex">
          {/* Left gutter */}
          <div className="flex-shrink-0 w-12 relative bg-white" style={{ height: TOTAL_HEIGHT }}>
            {Array.from({ length: 24 }, (_, h) => (
              <div
                key={h}
                className="absolute right-0 pr-1 text-right"
                style={{ top: h * HOUR_HEIGHT - 8, width: '100%' }}
              >
                {h !== 0 && (
                  <span className="text-xs text-gray-400 select-none leading-none">{formatHour(h)}</span>
                )}
              </div>
            ))}
          </div>

          {/* Timeline area */}
          <div className="flex-1 relative" style={{ height: TOTAL_HEIGHT }}>
            {/* Slot grid lines */}
            {SLOTS.map((i) => {
              const isHour = i % 2 === 0
              return (
                <div
                  key={i}
                  className={`absolute left-0 right-0 cursor-pointer hover:bg-indigo-50/40 transition-colors ${isHour ? 'border-t border-gray-200' : 'border-t border-dashed border-gray-100'}`}
                  style={{ top: i * SLOT_HEIGHT, height: SLOT_HEIGHT }}
                  onClick={() => handleSlotClick(i)}
                />
              )
            })}

            {/* Current time indicator */}
            {showCurrentTime && (
              <div
                className="absolute left-0 right-0 z-10 pointer-events-none flex items-center"
                style={{ top: currentTimePx }}
              >
                <div className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0 -ml-1" />
                <div className="flex-1 border-t-2 border-red-500" />
              </div>
            )}

            {/* Events */}
            {laidOutEvents.map((event) => {
              const startMins = timeToMins(event.startTime)
              const endMins = Math.max(timeToMins(event.endTime), startMins + 30)
              const top = startMins * PX_PER_MIN
              const height = Math.max((endMins - startMins) * PX_PER_MIN, 28)
              const left = `${event.layoutLeft * 100}%`
              const width = `${event.layoutWidth * 100}%`
              return (
                <TimeBlock
                  key={event.id}
                  event={event}
                  style={{ top, height, left, width }}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  selectMode={selectMode}
                  isSelected={selectedIds?.has(event.id) ?? false}
                  onToggleSelect={onToggleSelect}
                />
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

DayView.propTypes = {
  date: PropTypes.string.isRequired,
  events: PropTypes.array.isRequired,
  onAdd: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  selectMode: PropTypes.bool,
  selectedIds: PropTypes.instanceOf(Set),
  onToggleSelect: PropTypes.func,
}
