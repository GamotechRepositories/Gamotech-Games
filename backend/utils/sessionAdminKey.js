const PLACEHOLDER_VALUES = new Set([
  '',
  'your-long-random-admin-secret',
  'your-admin-key-here',
  'YOUR_SECRET',
])

export const getSessionAdminKey = () =>
  process.env.ADMIN_API_KEY || process.env.SESSION_ADMIN_KEY

export const isSessionAdminKeyConfigured = () => {
  const key = getSessionAdminKey()
  return Boolean(key && !PLACEHOLDER_VALUES.has(key))
}
