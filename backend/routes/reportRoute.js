import express from 'express'
import {
  getAnalytics,
  getApiLogs,
  getDashboardStats,
  getPlayers,
  getRevenue,
  getTransactions,
  getWallet,
} from '../controllers/reportController.js'

const reportRouter = express.Router()

reportRouter.get('/dashboard/stats', getDashboardStats)
reportRouter.get('/players', getPlayers)
reportRouter.get('/transactions', getTransactions)
reportRouter.get('/wallet', getWallet)
reportRouter.get('/revenue', getRevenue)
reportRouter.get('/analytics', getAnalytics)
reportRouter.get('/api-logs', getApiLogs)

export default reportRouter
