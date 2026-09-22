import axios from 'axios'
import { getSessionAdminKey } from '../utils/sessionAdminKey.js'

const sessionApi = axios.create({
  baseURL: process.env.SESSION_API_URL || 'https://api.dpbossking.com',
  headers: {
    'Content-Type': 'application/json',
  },
})

sessionApi.interceptors.request.use((config) => {
  const adminKey = getSessionAdminKey()
  if (adminKey) {
    config.headers['X-Admin-Key'] = adminKey
  }
  return config
})

export const listSessions = (params) =>
  sessionApi.get('/api/v1/admin/sessions', { params })

export const trackSessionByToken = (sessionToken) =>
  sessionApi.get('/api/v1/admin/sessions/track', {
    params: { sessionToken },
  })

export const getSessionById = (sessionId) =>
  sessionApi.get(`/api/v1/admin/sessions/${sessionId}`)

export const getStatsByOperator = (params) =>
  sessionApi.get('/api/v1/admin/sessions/stats/by-operator', { params })

export const getStatsByGame = (params) =>
  sessionApi.get('/api/v1/admin/sessions/stats/by-game', { params })

export const getEventsByOperator = (params) =>
  sessionApi.get('/api/v1/admin/sessions/events/by-operator', { params })

export const getEventsByGame = (params) =>
  sessionApi.get('/api/v1/admin/sessions/events/by-game', { params })

export default sessionApi
