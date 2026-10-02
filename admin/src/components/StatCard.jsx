import { useId } from 'react'
import { TrendingDown, TrendingUp } from 'lucide-react'

function getSparklinePoints(data, trend = 0, title = '') {
  if (Array.isArray(data) && data.length >= 2) return data

  const numericTrend = typeof trend === 'number' ? trend : parseFloat(trend)
  const isUp = !isNaN(numericTrend) ? numericTrend >= 0 : true
  const seed = (title || '').split('').reduce((acc, c, idx) => acc + c.charCodeAt(0) * (idx + 1), 0)

  const base = isUp
    ? [10, 13, 11, 16, 14, 20, 23]
    : [23, 20, 22, 16, 17, 12, 9]

  return base.map((val, i) => {
    const jitter = ((seed * (i + 1) * 9301 + 49297) % 233280) / 233280
    const offset = Math.round((jitter - 0.5) * 4)
    return Math.max(4, val + offset)
  })
}

function MiniChart({ data, color = '#6366f1', isPositive = true, id }) {
  if (!data || data.length < 2) return null
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1

  const width = 60
  const height = 22
  const paddingY = 2

  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width
    const y = height - paddingY - ((v - min) / range) * (height - paddingY * 2)
    return { x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 }
  })

  const polylinePoints = pts.map((p) => `${p.x},${p.y}`).join(' ')
  const areaPoints = `${pts[0].x},${height} ${polylinePoints} ${pts[pts.length - 1].x},${height}`
  const strokeColor = color || (isPositive ? '#10b981' : '#ef4444')
  const gradId = `spark-${id ? id.replace(/:/g, '') : Math.random().toString(36).slice(2, 7)}`

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-12 sm:w-16 h-5 sm:h-6 shrink-0 overflow-visible"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={strokeColor} stopOpacity="0.28" />
          <stop offset="100%" stopColor={strokeColor} stopOpacity="0.0" />
        </linearGradient>
      </defs>
      <polygon fill={`url(#${gradId})`} points={areaPoints} />
      <polyline
        fill="none"
        stroke={strokeColor}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={polylinePoints}
      />
    </svg>
  )
}

function StatCard({
  title,
  label,
  value,
  trend,
  icon: Icon,
  color = '#6366f1',
  chartData,
  showGraph = true,
  tone,
  className = '',
  onClick,
}) {
  const chartId = useId()
  const displayTitle = title || label || ''
  const hasTrend = trend !== undefined && trend !== null && trend !== ''
  const numericTrend = typeof trend === 'number' ? trend : parseFloat(trend)
  const isPositive = !isNaN(numericTrend) ? numericTrend >= 0 : true
  const sparklineData = showGraph ? getSparklinePoints(chartData, trend, displayTitle) : null

  const valueToneClass =
    tone === 'win'
      ? 'text-emerald-600'
      : tone === 'loss'
        ? 'text-red-600'
        : 'text-slate-900'

  return (
    <div
      onClick={onClick}
      className={`bg-white border border-slate-200/90 rounded-xl p-3 sm:p-3.5 shadow-xs hover:border-slate-300 hover:shadow-sm transition-all flex flex-col justify-between ${
        onClick ? 'cursor-pointer hover:bg-slate-50/50' : ''
      } ${className}`}
    >
      {/* Row 1: Icon with title, no percentage */}
      <div className="flex items-center gap-2 min-w-0">
        {Icon && (
          <div
            className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0"
            style={{ backgroundColor: `${color}18` }}
          >
            <Icon className="w-3.5 h-3.5" style={{ color }} />
          </div>
        )}
        <p className="text-xs font-medium text-slate-500 truncate" title={displayTitle}>
          {displayTitle}
        </p>
      </div>

      {/* Row 2: Count, graph, and percentage */}
      <div className="flex items-center justify-between gap-2 mt-2 pt-0.5">
        <span className={`text-xl font-bold tracking-tight leading-none truncate ${valueToneClass}`}>
          {value ?? '—'}
        </span>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {showGraph && sparklineData && (
            <MiniChart
              data={sparklineData}
              color={color}
              isPositive={isPositive}
              id={chartId}
            />
          )}

          {hasTrend && (
            <div
              className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[10px] font-semibold ${
                isPositive ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
              }`}
            >
              {isPositive ? (
                <TrendingUp className="w-2.5 h-2.5" />
              ) : (
                <TrendingDown className="w-2.5 h-2.5" />
              )}
              <span>
                {!isNaN(numericTrend)
                  ? `${numericTrend >= 0 ? '+' : ''}${Math.abs(numericTrend)}%`
                  : trend}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default StatCard
