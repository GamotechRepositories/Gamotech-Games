function EmptyState({ message = 'No data available' }) {
  return (
    <div className="flex items-center justify-center h-40 text-sm text-slate-500">
      {message}
    </div>
  )
}

export default EmptyState
