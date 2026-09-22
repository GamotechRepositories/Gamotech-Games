function SessionReportFilters({
  operators = [],
  games = [],
  showOperator = true,
  showGame = true,
  showResult = false,
  operatorId,
  gameCode,
  from,
  to,
  result,
  onOperatorChange,
  onGameChange,
  onFromChange,
  onToChange,
  onResultChange,
  onSubmit,
  submitLabel = 'Apply',
  loading = false,
}) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit?.()
      }}
      className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm mb-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
        {showOperator && (
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">
              Operator {showOperator && !showGame ? '*' : ''}
            </label>
            <select
              value={operatorId}
              onChange={(e) => onOperatorChange(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 text-sm text-slate-700"
            >
              <option value="">Select operator</option>
              {operators.map((operator) => (
                <option key={operator._id} value={operator.operatorId}>
                  {operator.name} ({operator.operatorId})
                </option>
              ))}
            </select>
          </div>
        )}

        {showGame && (
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">
              Game {showGame && !showOperator ? '*' : ''}
            </label>
            <select
              value={gameCode}
              onChange={(e) => onGameChange(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 text-sm text-slate-700"
            >
              <option value="">Select game</option>
              {games.map((game) => (
                <option key={game._id} value={game.code}>
                  {game.name} ({game.code})
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">From</label>
          <input
            type="datetime-local"
            value={from}
            onChange={(e) => onFromChange(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 text-sm text-slate-700"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">To</label>
          <input
            type="datetime-local"
            value={to}
            onChange={(e) => onToChange(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 text-sm text-slate-700"
          />
        </div>

        {showResult && (
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Result</label>
            <select
              value={result}
              onChange={(e) => onResultChange(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 text-sm text-slate-700"
            >
              <option value="">All</option>
              <option value="WIN">WIN</option>
              <option value="LOSS">LOSS</option>
              <option value="DRAW">DRAW</option>
            </select>
          </div>
        )}
      </div>

      <div className="mt-4 flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
        >
          {loading ? 'Loading…' : submitLabel}
        </button>
      </div>
    </form>
  )
}

export default SessionReportFilters
