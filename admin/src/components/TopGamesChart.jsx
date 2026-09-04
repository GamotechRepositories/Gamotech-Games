import EmptyState from './EmptyState'

function TopGamesChart({ games }) {
  if (!games?.length) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <h3 className="text-base font-semibold text-slate-900 mb-4">Top Games</h3>
        <EmptyState message="No games data available yet" />
      </div>
    )
  }

  const colors = ['#6366f1', '#3b82f6', '#8b5cf6', '#06b6d4']
  const total = games.reduce((sum, g) => sum + g.percentage, 0) || 100

  let cumulative = 0
  const segments = games.map((game, i) => {
    const start = cumulative
    cumulative += (game.percentage / total) * 360
    return { ...game, start, end: cumulative, color: colors[i % colors.length] }
  })

  const describeArc = (startAngle, endAngle) => {
    const start = (startAngle - 90) * (Math.PI / 180)
    const end = (endAngle - 90) * (Math.PI / 180)
    const r = 70
    const cx = 90
    const cy = 90
    const x1 = cx + r * Math.cos(start)
    const y1 = cy + r * Math.sin(start)
    const x2 = cx + r * Math.cos(end)
    const y2 = cy + r * Math.sin(end)
    const large = endAngle - startAngle > 180 ? 1 : 0
    return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`
  }

  const formatCurrency = (n) => `₹${n.toLocaleString('en-IN')}`

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
      <h3 className="text-base font-semibold text-slate-900 mb-4">Top Games</h3>

      <div className="flex items-center gap-6">
        <svg viewBox="0 0 180 180" className="w-36 h-36 shrink-0">
          {segments.map((seg, i) => (
            <path key={i} d={describeArc(seg.start, seg.end)} fill={seg.color} />
          ))}
          <circle cx="90" cy="90" r="45" fill="#ffffff" />
        </svg>

        <div className="flex-1 space-y-3">
          {games.map((game, i) => (
            <div key={game.name}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: colors[i % colors.length] }} />
                  <span className="text-sm text-slate-900 font-medium">{game.name}</span>
                </div>
                <span className="text-sm text-slate-500">{game.percentage}%</span>
              </div>
              <p className="text-xs text-slate-400 pl-4">{formatCurrency(game.revenue)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default TopGamesChart
