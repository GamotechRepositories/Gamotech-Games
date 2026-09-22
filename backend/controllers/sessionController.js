import {
  getEventsByGame as fetchEventsByGame,
  getEventsByOperator as fetchEventsByOperator,
  getSessionById as fetchSessionById,
  getStatsByGame as fetchStatsByGame,
  getStatsByOperator as fetchStatsByOperator,
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

const pickQuery = (query, keys) => {
  const params = {}
  for (const key of keys) {
    if (query[key] !== undefined && query[key] !== '') {
      params[key] = query[key]
    }
  }
  return params
}

export const listSessions = async (req, res) => {
  if (!ensureConfigured(res)) return

  try {
    const params = pickQuery(req.query, [
      'page',
      'limit',
      'operatorId',
      'status',
      'gameCode',
    ])
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

export const getStatsByOperator = async (req, res) => {
  if (!ensureConfigured(res)) return

  try {
    const params = pickQuery(req.query, ['operatorId', 'gameCode', 'from', 'to'])
    if (!params.operatorId) {
      return res.status(400).json({
        success: false,
        message: 'operatorId query parameter is required',
      })
    }

    const { data } = await fetchStatsByOperator(params)
    res.status(200).json(data)
  } catch (error) {
    forwardError(res, error)
  }
}

export const getStatsByGame = async (req, res) => {
  if (!ensureConfigured(res)) return

  try {
    const params = pickQuery(req.query, ['gameCode', 'operatorId', 'from', 'to'])
    if (!params.gameCode) {
      return res.status(400).json({
        success: false,
        message: 'gameCode query parameter is required',
      })
    }

    const { data } = await fetchStatsByGame(params)
    res.status(200).json(data)
  } catch (error) {
    forwardError(res, error)
  }
}

export const getEventsByOperator = async (req, res) => {
  if (!ensureConfigured(res)) return

  try {
    const params = pickQuery(req.query, [
      'operatorId',
      'gameCode',
      'from',
      'to',
      'result',
      'page',
      'limit',
    ])
    if (!params.operatorId) {
      return res.status(400).json({
        success: false,
        message: 'operatorId query parameter is required',
      })
    }

    const { data } = await fetchEventsByOperator(params)
    res.status(200).json(data)
  } catch (error) {
    forwardError(res, error)
  }
}

export const getEventsByGame = async (req, res) => {
  if (!ensureConfigured(res)) return

  try {
    const params = pickQuery(req.query, [
      'gameCode',
      'operatorId',
      'from',
      'to',
      'result',
      'page',
      'limit',
    ])
    if (!params.gameCode) {
      return res.status(400).json({
        success: false,
        message: 'gameCode query parameter is required',
      })
    }

    const { data } = await fetchEventsByGame(params)
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
