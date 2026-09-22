import {
  getSessionById as fetchSessionById,
  listSessions as fetchSessions,
  trackSessionByToken,
} from '../services/sessionApi.js'
import { isSessionAdminKeyConfigured } from '../utils/sessionAdminKey.js'

const forwardError = (res, error) => {
  const status = error.response?.status || 500
  const payload = error.response?.data || {
    success: false,
    message: error.message || 'Session service request failed',
  }
  res.status(status).json(payload)
}

const ensureConfigured = (res) => {
  if (!isSessionAdminKeyConfigured()) {
    res.status(503).json({
      success: false,
      message:
        'Session service is not configured. Set ADMIN_API_KEY in backend/.env to the same value as Session Service ADMIN_API_KEY.',
    })
    return false
  }
  return true
}

export const listSessions = async (req, res) => {
  if (!ensureConfigured(res)) return

  try {
    const { page, limit, operatorId, status, gameCode } = req.query
    const params = {}
    if (page) params.page = page
    if (limit) params.limit = limit
    if (operatorId) params.operatorId = operatorId
    if (status) params.status = status
    if (gameCode) params.gameCode = gameCode

    const { data } = await fetchSessions(params)
    res.status(200).json(data)
  } catch (error) {
    forwardError(res, error)
  }
}

export const trackSession = async (req, res) => {
  if (!ensureConfigured(res)) return

  try {
    const { sessionToken } = req.query
    if (!sessionToken) {
      return res.status(400).json({
        success: false,
        message: 'sessionToken query parameter is required',
      })
    }

    const { data } = await trackSessionByToken(sessionToken)
    res.status(200).json(data)
  } catch (error) {
    forwardError(res, error)
  }
}

export const getSessionById = async (req, res) => {
  if (!ensureConfigured(res)) return

  try {
    const { sessionId } = req.params
    const { data } = await fetchSessionById(sessionId)
    res.status(200).json(data)
  } catch (error) {
    forwardError(res, error)
  }
}
