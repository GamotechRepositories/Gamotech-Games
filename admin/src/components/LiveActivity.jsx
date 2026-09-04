import { Activity, LogIn, Trophy, UserPlus } from 'lucide-react'
import EmptyState from './EmptyState'

const iconMap = {
  win: { icon: Trophy, color: '#059669', bg: '#ecfdf5' },
  register: { icon: UserPlus, color: '#6366f1', bg: '#eef2ff' },
  bet: { icon: Activity, color: '#d97706', bg: '#fffbeb' },
  login: { icon: LogIn, color: '#2563eb', bg: '#eff6ff' },
}

function LiveActivity({ activities }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
      <h3 className="text-base font-semibold text-slate-900 mb-4">Live Activity</h3>

      {!activities?.length ? (
        <EmptyState message="No recent activity" />
      ) : (
        <div className="space-y-4">
          {activities.map((activity, i) => {
            const { icon: Icon, color, bg } = iconMap[activity.type] || iconMap.bet
            return (
              <div key={i} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: bg }}>
                  <Icon className="w-4 h-4" style={{ color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-700 leading-snug">{activity.message}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{activity.time}</p>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default LiveActivity
