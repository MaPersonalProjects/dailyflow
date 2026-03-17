import PropTypes from 'prop-types'

const EMOTION_EMOJI = {
  great: '😄',
  good: '🙂',
  okay: '😐',
  meh: '😔',
}

export function EmotionSparkline({ completions, count }) {
  const recent = [...completions]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, count)
    .reverse()

  if (recent.length < 2) return null

  return (
    <div className="flex items-center gap-0.5 mt-1">
      <span className="text-xs text-gray-400 mr-1">Mood:</span>
      {recent.map((c, i) => (
        <span key={i} className="text-sm" title={c.date}>
          {c.emotion ? EMOTION_EMOJI[c.emotion] ?? '○' : '·'}
        </span>
      ))}
    </div>
  )
}

EmotionSparkline.propTypes = {
  completions: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string.isRequired,
      emotion: PropTypes.string,
    })
  ).isRequired,
  count: PropTypes.number,
}

EmotionSparkline.defaultProps = {
  count: 10,
}
