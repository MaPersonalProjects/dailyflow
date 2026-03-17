import { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { format, addDays } from 'date-fns'
import { toISODate, getToday } from '../../utils/dateHelpers.js'
import { TimeBlock } from './TimeBlock.jsx'
import { computeEventLayout } from '../../utils/scheduleLayout.js'

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

export function WeekView({ weekStart, events, onAdd, onEdit, onDelete, selectMode, selectedIds, onToggleSelect }) {
  const [now, setNow] = useState(new Date())
  const scrollRef = useRef(null)
  const today = getToday()
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (scrollRef.current) {
      const scrollTo = Math.max(0, (now.getHours() * 60 + now.getMinutes()) * PX_PER_MIN - 100)
      scrollRef.current.scrollTop = scrollTo
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const currentTimePx = (now.getHours() * 60 + now.getMinutes()) * PX_PER_MIN

  const handleSlotClick = (isoDate, slotIndex) => {
    const totalMins = slotIndex * 30
    const h = String(Math.floor(totalMins / 60)).padStart(2, '0')
    const m = totalMins % 60 === 0 ? '00' : '30'
    onAdd(isoDate, `${h}:${m}`)
  }

  return (
    <div className="flex flex-col border border-gray-200 rounded-lg overflow-hidden">
      {/* Sticky day-of-week header */}
      <div className="flex sticky top-0 z-20 bg-white border-b border-gray-200 flex-shrink-0">
        <div className="flex-shrink-0 w-12" />
        {days.map((day) => {
          const isoDate = toISODate(day)
          const isToday = isoDate === today
          return (
            <div
              key={isoDate}
              className={`flex-1 text-center py-2 border-l border-gray-100 ${isToday ? 'bg-indigo-50' : ''}`}
            >
              <p className="text-xs text-gray-400">{format(day, 'EEE')}</p>
              <p className={`text-sm font-semibold ${isToday ? 'text-indigo-600' : 'text-gray-700'}`}>
                {format(day, 'd')}
              </p>
            </div>
          )
        })}
      </div>

      {/* Scrollable body */}
      <div ref={scrollRef} className="overflow-y-auto" style={{ maxHeight: '70vh' }}>
        <div className="flex">
          {/* Left gutter */}
          <div className="flex-shrink-0 w-12 relative bg-white z-10" style={{ height: TOTAL_HEIGHT }}>
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

          {/* Day columns */}
          {days.map((day) => {
            const isoDate = toISODate(day)
            const isToday = isoDate === today
            const dayEvents = events.filter((e) => e.date === isoDate)
            const laidOutEvents = computeEventLayout(dayEvents)

            return (
              <div
                key={isoDate}
                className={`flex-1 relative border-l border-gray-100 ${isToday ? 'bg-indigo-50/30' : ''}`}
                style={{ height: TOTAL_HEIGHT }}
              >
                {/* Slot grid lines */}
                {SLOTS.map((i) => {
                  const isHour = i % 2 === 0
                  return (
                    <div
                      key={i}
                      className={`absolute left-0 right-0 cursor-pointer hover:bg-indigo-50/50 transition-colors ${isHour ? 'border-t border-gray-200' : 'border-t border-dashed border-gray-100'}`}
                      style={{ top: i * SLOT_HEIGHT, height: SLOT_HEIGHT }}
                      onClick={() => handleSlotClick(isoDate, i)}
                    />
                  )
                })}

                {/* Current time indicator (today's column only) */}
                {isToday && (
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
            )
          })}
        </div>
      </div>
    </div>
  )
}

WeekView.propTypes = {
  weekStart: PropTypes.instanceOf(Date).isRequired,
  events: PropTypes.array.isRequired,
  onAdd: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  selectMode: PropTypes.bool,
  selectedIds: PropTypes.instanceOf(Set),
  onToggleSelect: PropTypes.func,
}
