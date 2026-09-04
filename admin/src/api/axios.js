import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const loginAdmin = (email, password) =>
  api.post('/login', { email, password })

export const getDashboardStats = () => api.get('/dashboard/stats')

export const getPlayers = () => api.get('/players')

export const getTransactions = () => api.get('/transactions')

export const getWallet = () => api.get('/wallet')

export const getRevenue = () => api.get('/revenue')

export const getAnalytics = () => api.get('/analytics')

export const getApiLogs = () => api.get('/api-logs')

export const getGames = (params) => api.get('/games', { params })

export const createGame = (data) => api.post('/games', data)

export const getGameById = (id) => api.get(`/games/${id}`)

export const updateGame = (id, data) => api.put(`/games/${id}`, data)

export const deleteGame = (id) => api.delete(`/games/${id}`)

export const getOperators = (params) => api.get('/operators', { params })

export const createOperator = (data) => api.post('/operators', data)

export const getOperatorById = (id) => api.get(`/operators/${id}`)

export const updateOperator = (id, data) => api.put(`/operators/${id}`, data)

export const getAdmins = () => api.get('/')

export default api
