function StatusBadge({ status }) {
  const styles = {
    ACTIVE: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    INACTIVE: 'bg-slate-100 text-slate-600 border-slate-200',
    MAINTENANCE: 'bg-amber-50 text-amber-700 border-amber-200',
    SUSPENDED: 'bg-red-50 text-red-700 border-red-200',
    Won: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Lost: 'bg-red-50 text-red-700 border-red-200',
    Success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Failed: 'bg-red-50 text-red-700 border-red-200',
    Pending: 'bg-amber-50 text-amber-700 border-amber-200',
  }

  return (
    <span
      className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium border ${
        styles[status] || 'bg-slate-100 text-slate-600 border-slate-200'
      }`}
    >
      {status}
    </span>
  )
}

export default StatusBadge
