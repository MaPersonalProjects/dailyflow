function timeToMins(timeStr) {
  if (!timeStr) return 0
  const [h, m] = timeStr.split(':').map(Number)
  return (h || 0) * 60 + (m || 0)
}

export function computeEventLayout(events) {
  if (!events.length) return []

  const sorted = [...events].sort((a, b) =>
    timeToMins(a.startTime) - timeToMins(b.startTime)
  )

  // Greedy lane assignment
  const laneEnds = []
  const laneOf = sorted.map((event) => {
    const startMins = timeToMins(event.startTime)
    const endMins = Math.max(timeToMins(event.endTime), startMins + 30)
    let lane = laneEnds.findIndex((end) => end <= startMins)
    if (lane === -1) lane = laneEnds.length
    laneEnds[lane] = endMins
    return lane
  })

  // Union-Find to group overlapping events into clusters
  const n = sorted.length
  const parent = Array.from({ length: n }, (_, i) => i)

  function find(i) {
    while (parent[i] !== i) { parent[i] = parent[parent[i]]; i = parent[i] }
    return i
  }
  function union(i, j) {
    const pi = find(i), pj = find(j)
    if (pi !== pj) parent[pi] = pj
  }

  for (let i = 0; i < n; i++) {
    const aStart = timeToMins(sorted[i].startTime)
    const aEnd = Math.max(timeToMins(sorted[i].endTime), aStart + 30)
    for (let j = i + 1; j < n; j++) {
      const bStart = timeToMins(sorted[j].startTime)
      if (bStart >= aEnd) break // sorted by start, no more overlaps with i
      union(i, j)
    }
  }

  // Determine max lane per cluster
  const clusterMaxLane = {}
  for (let i = 0; i < n; i++) {
    const root = find(i)
    clusterMaxLane[root] = Math.max(clusterMaxLane[root] ?? 0, laneOf[i])
  }

  return sorted.map((event, i) => {
    const totalLanes = clusterMaxLane[find(i)] + 1
    return {
      ...event,
      layoutLeft: laneOf[i] / totalLanes,
      layoutWidth: 1 / totalLanes,
    }
  })
}
