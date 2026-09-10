import { AUTH_TYPES } from '../utils/integrationForm'

const inputClass =
  'w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'
const labelClass = 'block text-sm font-medium text-slate-700 mb-1.5'

function AuthRefsForm({ auth, onChange, prefix = 'auth' }) {
  const setAuth = (nextAuth) => onChange(nextAuth)

  const handleField = (e) => {
    const { name, value } = e.target
    const parts = name.replace(`${prefix}.`, '').split('.')

    if (parts[0] === 'type') {
      setAuth({ ...auth, type: value })
      return
    }

    if (parts[0] === 'headersJson') {
      setAuth({ ...auth, headersJson: value })
      return
    }

    if (parts[0] === 'custom') {
      setAuth({ ...auth, custom: { headersJson: value } })
      return
    }

    const [section, field] = parts
    setAuth({
      ...auth,
      [section]: { ...auth[section], [field]: value },
    })
  }

  return (
    <div className="space-y-3">
      <div>
        <label className={labelClass}>Auth Type</label>
        <select
          name={`${prefix}.type`}
          value={auth.type}
          onChange={handleField}
          className={`${inputClass} max-w-xs`}
        >
          {AUTH_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className={labelClass}>Auth Headers (JSON) — MongoDB</label>
        <textarea
          name={`${prefix}.headersJson`}
          value={auth.headersJson}
          onChange={handleField}
          rows={2}
          className={`${inputClass} font-mono text-xs resize-none`}
        />
      </div>

      {auth.type === 'API_KEY' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Header — MongoDB</label>
            <input
              type="text"
              name={`${prefix}.apiKey.header`}
              value={auth.apiKey.header}
              onChange={handleField}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Secret Ref — MongoDB</label>
            <input
              type="text"
              name={`${prefix}.apiKey.secretRef`}
              value={auth.apiKey.secretRef}
              onChange={handleField}
              placeholder="gamotech/operators/OP-001/api-key"
              className={inputClass}
            />
          </div>
        </div>
      )}

      {auth.type === 'BEARER' && (
        <div>
          <label className={labelClass}>Token Ref — MongoDB</label>
          <input
            type="text"
            name={`${prefix}.bearer.tokenRef`}
            value={auth.bearer.tokenRef}
            onChange={handleField}
            placeholder="gamotech/operators/OP-001/bearer-token"
            className={inputClass}
          />
        </div>
      )}

      {auth.type === 'BASIC' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Username Ref — MongoDB</label>
            <input
              type="text"
              name={`${prefix}.basic.usernameRef`}
              value={auth.basic.usernameRef}
              onChange={handleField}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Password Ref — MongoDB</label>
            <input
              type="text"
              name={`${prefix}.basic.passwordRef`}
              value={auth.basic.passwordRef}
              onChange={handleField}
              className={inputClass}
            />
          </div>
        </div>
      )}

      {auth.type === 'HMAC' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <div>
            <label className={labelClass}>Secret Ref — MongoDB</label>
            <input
              type="text"
              name={`${prefix}.hmac.secretRef`}
              value={auth.hmac.secretRef}
              onChange={handleField}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Algorithm — MongoDB</label>
            <input
              type="text"
              name={`${prefix}.hmac.algorithm`}
              value={auth.hmac.algorithm}
              onChange={handleField}
              className={inputClass}
            />
          </div>
        </div>
      )}

      {auth.type === 'CUSTOM' && (
        <div>
          <label className={labelClass}>Custom Header Refs (JSON) — MongoDB</label>
          <textarea
            name={`${prefix}.custom.headersJson`}
            value={auth.custom.headersJson}
            onChange={handleField}
            rows={3}
            className={`${inputClass} font-mono text-xs resize-none`}
          />
        </div>
      )}
    </div>
  )
}

export default AuthRefsForm
