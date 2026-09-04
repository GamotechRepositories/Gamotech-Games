export const nameToOperatorIdBase = (name) =>
  name
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

export const suggestOperatorId = (name, existingIds = []) => {
  const base = nameToOperatorIdBase(name)
  if (!base) return ''

  const pattern = new RegExp(
    `^${base.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}-(\\d+)$`,
    'i'
  )

  let maxNum = 0
  for (const id of existingIds) {
    const match = id.match(pattern)
    if (match) maxNum = Math.max(maxNum, parseInt(match[1], 10))
  }

  return `${base}-${String(maxNum + 1).padStart(3, '0')}`
}
