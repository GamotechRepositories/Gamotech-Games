import StatusBadge from './StatusBadge'
import EmptyState from './EmptyState'

function RecentTransactions({ transactions }) {
  const formatCurrency = (n) => `₹${n.toLocaleString('en-IN')}`

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-slate-900">Recent Transactions</h3>
      </div>

      {!transactions?.length ? (
        <EmptyState message="No transactions yet" />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-500 border-b border-slate-200">
                <th className="text-left pb-3 font-semibold">Player</th>
                <th className="text-left pb-3 font-semibold">Operator</th>
                <th className="text-left pb-3 font-semibold">Game</th>
                <th className="text-right pb-3 font-semibold">Bet Amount</th>
                <th className="text-right pb-3 font-semibold">Win Amount</th>
                <th className="text-center pb-3 font-semibold">Status</th>
                <th className="text-right pb-3 font-semibold">Time</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-xs text-indigo-700 font-medium">
                        {tx.player.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-slate-900 text-xs font-medium">{tx.player.name}</p>
                        <p className="text-slate-400 text-xs">{tx.player.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-slate-200 flex items-center justify-center text-xs text-slate-700 font-medium">
                        {tx.operator.initial}
                      </div>
                      <span className="text-slate-700 text-xs">{tx.operator.name}</span>
                    </div>
                  </td>
                  <td className="py-3 text-slate-700 text-xs">{tx.game}</td>
                  <td className="py-3 text-right text-slate-700 text-xs">{formatCurrency(tx.betAmount)}</td>
                  <td className="py-3 text-right text-slate-700 text-xs">
                    {tx.winAmount > 0 ? formatCurrency(tx.winAmount) : '—'}
                  </td>
                  <td className="py-3 text-center">
                    <StatusBadge status={tx.status} />
                  </td>
                  <td className="py-3 text-right text-slate-400 text-xs whitespace-nowrap">{tx.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default RecentTransactions
