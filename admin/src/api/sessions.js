import api from './axios'

export const getSessions = (params) => api.get('/sessions', { params })

export const trackSession = (sessionToken) =>
  api.get('/sessions/track', { params: { sessionToken } })

export const getSessionById = (sessionId) => api.get(`/sessions/${sessionId}`)

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
