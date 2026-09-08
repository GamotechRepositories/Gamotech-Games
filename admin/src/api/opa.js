import axios from 'axios'

const opaApi = axios.create({
  baseURL: import.meta.env.VITE_OPA_API_URL || 'https://opa.dpbossking.com',
  headers: {
    'Content-Type': 'application/json',
  },
})

export const getIntegrations = (params) =>
  opaApi.get('/api/v1/integrations', { params })

export const getIntegration = (operatorId) =>
  opaApi.get(`/api/v1/integrations/${encodeURIComponent(operatorId)}`)

export const createIntegration = (data) =>
  opaApi.post('/api/v1/integrations', data)

export const updateIntegration = (operatorId, data) =>
  opaApi.put(`/api/v1/integrations/${encodeURIComponent(operatorId)}`, data)

export const patchIntegrationStatus = (operatorId, status) =>
  opaApi.patch(`/api/v1/integrations/${encodeURIComponent(operatorId)}/status`, {
    status,
  })

export const deleteIntegration = (operatorId) =>
  opaApi.delete(`/api/v1/integrations/${encodeURIComponent(operatorId)}`)

export const getOpaHealth = () => opaApi.get('/health')

export const parseIntegrationList = (data) => {
  if (Array.isArray(data)) return data
  if (Array.isArray(data?.integrations)) return data.integrations
  if (Array.isArray(data?.data)) return data.data
  return []
}

export const parseIntegration = (data) =>
  data?.integration ?? data?.data ?? data

export default opaApi
