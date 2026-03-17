/**
 * Parse a CSV or plain-text list file into task objects.
 *
 * Supported formats:
 *
 * 1. CSV with header row:
 *    title,priority,category,dueDate,dueTime,notes
 *    Buy groceries,medium,Personal,2024-01-15,,
 *
 * 2. Plain list (CSV without headers, or .md bullet list):
 *    - Task one
 *    - Task two
 *    Buy milk
 */

function parseCsvLine(line) {
  const fields = []
  let field = ''
  let inQuotes = false
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (ch === '"') {
      inQuotes = !inQuotes
    } else if (ch === ',' && !inQuotes) {
      fields.push(field.trim())
      field = ''
    } else {
      field += ch
    }
  }
  fields.push(field.trim())
  return fields
}

const VALID_PRIORITIES = new Set(['high', 'medium', 'low'])

export function parseCsvTasks(content) {
  const lines = content
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)

  if (lines.length === 0) return []

  const KNOWN_HEADERS = ['title', 'priority', 'category', 'duedate', 'duetime', 'notes']
  const firstCols = parseCsvLine(lines[0]).map((h) => h.toLowerCase().replace(/\s+/g, ''))
  const hasHeader = firstCols.some((h) => KNOWN_HEADERS.includes(h))

  if (hasHeader) {
    const headers = firstCols
    return lines
      .slice(1)
      .map((line, i) => {
        const cols = parseCsvLine(line)
        const get = (key) => {
          const idx = headers.indexOf(key)
          return idx !== -1 ? (cols[idx] ?? '').trim() : ''
        }
        const title = get('title')
        if (!title) return null
        const priority = VALID_PRIORITIES.has(get('priority').toLowerCase())
          ? get('priority').toLowerCase()
          : 'medium'
        return {
          _importId: `${Date.now()}_${i}`,
          title,
          priority,
          category: get('category') || 'Personal',
          dueDate: get('duedate') || get('due date') || '',
          dueTime: get('duetime') || get('due time') || '',
          notes: get('notes') || '',
        }
      })
      .filter(Boolean)
  }

  // Plain list: one task per line, strip markdown bullets
  return lines
    .map((line, i) => {
      // Strip: - [ ] | - [x] | - | * | 1. etc.
      const text = line
        .replace(/^-\s*\[[ xX]\]\s*/, '')
        .replace(/^[-*]\s+/, '')
        .replace(/^\d+\.\s+/, '')
        // Strip markdown bold/italic
        .replace(/\*\*/g, '')
        .replace(/^\s*#+\s*/, '')
        .trim()
      if (!text) return null
      return {
        _importId: `${Date.now()}_${i}`,
        title: text,
        priority: 'medium',
        category: 'Personal',
        dueDate: '',
        dueTime: '',
        notes: '',
      }
    })
    .filter(Boolean)
}
