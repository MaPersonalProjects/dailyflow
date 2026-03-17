/**
 * Parse a markdown schedule file into structured day groups.
 *
 * Expected format:
 *   ### **Monday - Wednesday - Friday (label)**
 *   - **6:00 AM** - Wake up
 *   - **6:00-6:05 AM** - Brush teeth
 *   - **8:00 AM-12:00 PM** - **Work Block**
 *       - sub-item becomes notes
 */

// "6:00 AM" | "12:30 PM" → "06:00" | "12:30"
function parseTimeStr(s) {
  const m = s.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i)
  if (!m) return null
  let h = parseInt(m[1])
  const min = m[2]
  const mer = m[3].toUpperCase()
  if (mer === 'PM' && h !== 12) h += 12
  if (mer === 'AM' && h === 12) h = 0
  return `${String(h).padStart(2, '0')}:${min}`
}

// Add `minutes` to a "HH:mm" string, wrapping at 24h
function addMinutes(timeStr, minutes) {
  const [h, m] = timeStr.split(':').map(Number)
  const total = h * 60 + m + minutes
  const hh = Math.floor(total / 60) % 24
  const mm = total % 60
  return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`
}

// "6:00-6:05 AM" | "8:00 AM-12:00 PM" | "6:00 AM" → { start, end }
function parseTimeRange(raw) {
  // Same-meridiem range: "1:00-5:30 PM"
  const sameM = raw.match(/^(\d{1,2}:\d{2})-(\d{1,2}:\d{2})\s*(AM|PM)$/i)
  if (sameM) {
    return {
      start: parseTimeStr(`${sameM[1]} ${sameM[3]}`),
      end: parseTimeStr(`${sameM[2]} ${sameM[3]}`),
    }
  }
  // Different-meridiem range: "8:00 AM-12:00 PM"
  const diffM = raw.match(/^(\d{1,2}:\d{2}\s*(?:AM|PM))\s*[-–]\s*(\d{1,2}:\d{2}\s*(?:AM|PM))$/i)
  if (diffM) {
    return {
      start: parseTimeStr(diffM[1].trim()),
      end: parseTimeStr(diffM[2].trim()),
    }
  }
  // Single time: "6:00 AM"
  const single = parseTimeStr(raw.trim())
  if (single) return { start: single, end: null }
  return null
}

const DAY_NAME_MAP = {
  monday: 'mon', tuesday: 'tue', wednesday: 'wed',
  thursday: 'thu', friday: 'fri', saturday: 'sat', sunday: 'sun',
}

function parseDayKeys(headerText) {
  const lower = headerText.toLowerCase()
  return Object.entries(DAY_NAME_MAP)
    .filter(([name]) => lower.includes(name))
    .map(([, key]) => key)
}

/**
 * Returns an array of day groups:
 * [{
 *   label: string,           // "Monday - Wednesday - Friday (…)"
 *   dayKeys: string[],       // ['mon','wed','fri']
 *   items: [{
 *     title: string,
 *     notes: string,
 *     startTime: string,     // "HH:mm"
 *     endTime: string,       // "HH:mm" (defaults to start+15min)
 *   }]
 * }]
 */
export function parseMdSchedule(markdown) {
  const lines = markdown.split('\n')
  const groups = []
  let currentGroup = null
  let currentItem = null

  for (const rawLine of lines) {
    // Day group header: ### anything
    if (/^###\s/.test(rawLine)) {
      const label = rawLine.replace(/^###\s+/, '').replace(/\*\*/g, '').trim()
      currentGroup = { label, dayKeys: parseDayKeys(rawLine), items: [] }
      groups.push(currentGroup)
      currentItem = null
      continue
    }

    if (!currentGroup) continue

    // Time entry: - **<time>** - <title>
    const entryMatch = rawLine.match(/^\s*-\s+\*\*(.+?)\*\*\s*[-–]\s*(.+)$/)
    if (entryMatch) {
      const times = parseTimeRange(entryMatch[1].trim())
      if (!times) continue

      // Strip remaining bold markers from title
      let titleRaw = entryMatch[2].trim().replace(/\*\*/g, '')
      // Pull out trailing (notes) — lazy match so nested parens work
      const parenMatch = titleRaw.match(/^(.+?)\s*\((.+)\)\s*$/)
      const title = parenMatch ? parenMatch[1].trim() : titleRaw
      const notesFromParen = parenMatch ? parenMatch[2].trim() : ''

      currentItem = {
        title,
        notes: notesFromParen,
        startTime: times.start,
        endTime: times.end ?? addMinutes(times.start, 15),
      }
      currentGroup.items.push(currentItem)
      continue
    }

    // Indented sub-item → append to current item's notes
    const subMatch = rawLine.match(/^\s{4,}-\s+(.+)$/)
    if (subMatch && currentItem) {
      const sub = subMatch[1].trim()
      currentItem.notes = currentItem.notes ? `${currentItem.notes}\n${sub}` : sub
      continue
    }
  }

  // Drop groups with no parseable items or no day keys
  return groups.filter((g) => g.dayKeys.length > 0 && g.items.length > 0)
}
