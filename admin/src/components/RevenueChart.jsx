import EmptyState from './EmptyState'

function RevenueChart({ data }) {
  if (!data?.length) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <h3 className="text-base font-semibold text-slate-900 mb-4">Revenue Overview</h3>
        <EmptyState message="No revenue data available yet" />
      </div>
    )
  }

  const max = Math.max(...data.map((d) => d.value)) || 1
  const width = 600
  const height = 200
  const padding = 20

  const points = data.map((d, i) => {
    const x = padding + (i / (data.length - 1 || 1)) * (width - padding * 2)
    const y = height - padding - (d.value / max) * (height - padding * 2)
    return { x, y, ...d }
  })

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-slate-900">Revenue Overview</h3>
      </div>

      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-48">
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
          </linearGradient>
        </defs>

        {[0, 0.25, 0.5, 0.75, 1].map((pct) => {
          const y = height - padding - pct * (height - padding * 2)
          return (
            <line key={pct} x1={padding} y1={y} x2={width - padding} y2={y} stroke="#e2e8f0" strokeWidth="1" />
          )
        })}

        <path d={areaPath} fill="url(#areaGrad)" />
        <path d={linePath} fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" />

        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="4" fill="#6366f1" stroke="#fff" strokeWidth="2" />
        ))}
      </svg>

      <div className="flex justify-between mt-2 px-1">
        {data.map((d) => (
          <span key={d.date} className="text-xs text-slate-500">
            {d.date}
          </span>
        ))}
      </div>
    </div>
  )
}

export default RevenueChart
