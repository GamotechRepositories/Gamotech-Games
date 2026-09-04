import Game from '../model/games.js'
import Operator from '../model/operator.js'

const handleError = (res, error, statusCode = 500) => {
  res.status(statusCode).json({
    success: false,
    message: error.message,
  })
}

export const getDashboardStats = async (req, res) => {
  try {
    const [totalOperators, totalGames, games] = await Promise.all([
      Operator.countDocuments(),
      Game.countDocuments(),
      Game.find().select('name code category status').sort({ sortOrder: 1, createdAt: -1 }).limit(5),
    ])

    const share = games.length ? Math.round(100 / games.length) : 0
    const topGames = games.map((game) => ({
      name: game.name,
      code: game.code,
      percentage: share,
      revenue: 0,
    }))

    res.status(200).json({
      success: true,
      stats: {
        totalOperators,
        totalGames,
        totalPlayers: 0,
        totalRevenue: 0,
        betsToday: 0,
        winsToday: 0,
        activeSessions: 0,
        apiCalls: 0,
        trends: {
          totalOperators: 0,
          totalGames: 0,
          totalPlayers: 0,
          totalRevenue: 0,
          betsToday: 0,
          winsToday: 0,
          activeSessions: 0,
          apiCalls: 0,
        },
      },
      revenueChart: [],
      topGames,
      recentTransactions: [],
      liveActivity: [],
      games,
    })
  } catch (error) {
    handleError(res, error)
  }
}

export const getPlayers = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      count: 0,
      players: [],
    })
  } catch (error) {
    handleError(res, error)
  }
}

export const getTransactions = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      count: 0,
      transactions: [],
    })
  } catch (error) {
    handleError(res, error)
  }
}

export const getWallet = async (req, res) => {
  try {
    const operators = await Operator.find().select('name status').sort({ createdAt: -1 })

    const wallets = operators.map((operator) => ({
      id: operator._id,
      operator: operator.name,
      balance: 0,
      locked: 0,
      available: 0,
      status: operator.status,
    }))

    res.status(200).json({
      success: true,
      summary: {
        totalBalance: 0,
        depositsToday: 0,
        withdrawalsToday: 0,
        pendingRequests: 0,
      },
      wallets,
    })
  } catch (error) {
    handleError(res, error)
  }
}

export const getRevenue = async (req, res) => {
  try {
    const games = await Game.find().select('name code').sort({ sortOrder: 1, createdAt: -1 }).limit(5)
    const share = games.length ? Math.round(100 / games.length) : 0

    res.status(200).json({
      success: true,
      stats: {
        totalRevenue: 0,
        monthlyGrowth: 0,
        operatorRevenue: 0,
        gameRevenue: 0,
        trends: {
          totalRevenue: 0,
          monthlyGrowth: 0,
          operatorRevenue: 0,
          gameRevenue: 0,
        },
      },
      revenueChart: [],
      topGames: games.map((game) => ({
        name: game.name,
        code: game.code,
        percentage: share,
        revenue: 0,
      })),
    })
  } catch (error) {
    handleError(res, error)
  }
}

export const getAnalytics = async (req, res) => {
  try {
    const [totalGames, totalOperators] = await Promise.all([
      Game.countDocuments(),
      Operator.countDocuments(),
    ])

    res.status(200).json({
      success: true,
      stats: {
        dailyActiveUsers: 0,
        sessionsToday: 0,
        gamesPlayed: 0,
        growthRate: 0,
        trends: {
          dailyActiveUsers: 0,
          sessionsToday: 0,
          gamesPlayed: 0,
          growthRate: 0,
        },
      },
      metrics: [
        { metric: 'Total Games', value: String(totalGames), change: '—' },
        { metric: 'Total Operators', value: String(totalOperators), change: '—' },
        { metric: 'Daily Active Users', value: '0', change: '—' },
        { metric: 'Avg Session Duration', value: '—', change: '—' },
        { metric: 'Conversion Rate', value: '—', change: '—' },
        { metric: 'Retention (7-day)', value: '—', change: '—' },
      ],
    })
  } catch (error) {
    handleError(res, error)
  }
}

export const getApiLogs = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      count: 0,
      logs: [],
    })
  } catch (error) {
    handleError(res, error)
  }
}
