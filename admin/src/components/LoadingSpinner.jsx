import { Loader2 } from 'lucide-react'

function LoadingSpinner({ message = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center h-64 gap-3">
      <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      <p className="text-sm text-slate-500">{message}</p>
    </div>
  )
}

export default LoadingSpinner
