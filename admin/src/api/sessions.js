import api from './axios'

export const getSessions = (params) => api.get('/sessions', { params })

export const trackSession = (sessionToken) =>
  api.get('/sessions/track', { params: { sessionToken } })

export const getSessionById = (sessionId) => api.get(`/sessions/${sessionId}`)

export const getStatsByOperator = (params) =>
  api.get('/sessions/stats/by-operator', { params })

export const getStatsByGame = (params) =>
  api.get('/sessions/stats/by-game', { params })

export const getRoundEventsByOperator = (params) =>
  api.get('/sessions/events/by-operator', { params })

export const getRoundEventsByGame = (params) =>
  api.get('/sessions/events/by-game', { params })

export const parseSessionList = (data) => {
  if (Array.isArray(data)) {
    return { sessions: data, total: data.length, page: 1, limit: data.length }
  }

  const sessions =
    data?.sessions ?? data?.data ?? data?.items ?? []

  return {
    sessions: Array.isArray(sessions) ? sessions : [],
    total: data?.total ?? data?.count ?? sessions.length ?? 0,
    page: data?.page ?? 1,
    limit: data?.limit ?? 20,
  }
}

export const parseSession = (data) => data?.session ?? data?.data ?? data

export const parseSessionDetail = (data) => {
  const session = parseSession(data)
  const events = data?.events ?? session?.events ?? []

  return {
    session,
    events: Array.isArray(events) ? events : [],
  }
}

export const parseRoundEventList = (data) => ({
  events: Array.isArray(data?.events) ? data.events : [],
  pagination: data?.pagination ?? {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  },
  filters: data?.filters ?? {},
})

export const formatCurrency = (value, currency = 'INR') => {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return '—'
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(Number(value))
}
