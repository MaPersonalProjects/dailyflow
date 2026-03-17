import { useState } from 'react'
import PropTypes from 'prop-types'
import { ANCHOR_MENU, ANCHOR_CATEGORIES } from '../../constants.js'

const CATEGORY_LABELS = {
  morning: '🌅 Morning',
  work: '💼 Work',
  evening: '🌙 Evening',
  custom: '✏️ Custom',
}

export function AnchorMenu({ value, anchorCategory, onChange }) {
  const [search, setSearch] = useState('')
  const [customText, setCustomText] = useState(
    // Pre-fill custom if the value doesn't match any preset
    ANCHOR_CATEGORIES.filter((c) => c !== 'custom').every(
      (cat) => !(ANCHOR_MENU[cat] ?? []).includes(value)
    )
      ? value
      : ''
  )

  const isPreset = (anchor) =>
    ANCHOR_CATEGORIES.filter((c) => c !== 'custom').some((cat) =>
      (ANCHOR_MENU[cat] ?? []).includes(anchor)
    )

  const filteredCategories = ANCHOR_CATEGORIES.filter((c) => c !== 'custom').map((cat) => ({
    cat,
    items: (ANCHOR_MENU[cat] ?? []).filter((item) =>
      item.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter(({ items }) => items.length > 0)

  const handleSelect = (anchor, cat) => {
    onChange(anchor, cat)
  }

  const handleCustom = (text) => {
    setCustomText(text)
    if (text.trim()) onChange(text.trim(), 'custom')
  }

  return (
    <div className="space-y-3">
      <input
        type="text"
        placeholder="Search anchors…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      <div className="max-h-56 overflow-y-auto space-y-3 pr-1">
        {filteredCategories.map(({ cat, items }) => (
          <div key={cat}>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
              {CATEGORY_LABELS[cat]}
            </p>
            <div className="space-y-1">
              {items.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => handleSelect(item, cat)}
                  className={`w-full text-left px-3 py-1.5 rounded-md text-sm transition-colors ${
                    value === item
                      ? 'bg-indigo-100 text-indigo-700 font-medium'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  After I {item}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
          {CATEGORY_LABELS.custom}
        </p>
        <input
          type="text"
          placeholder="After I… (type your own)"
          value={customText}
          onChange={(e) => handleCustom(e.target.value)}
          className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
            anchorCategory === 'custom' && value
              ? 'border-indigo-300 bg-indigo-50'
              : 'border-gray-300'
          }`}
        />
      </div>
    </div>
  )
}

AnchorMenu.propTypes = {
  value: PropTypes.string.isRequired,
  anchorCategory: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
}
