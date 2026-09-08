import { HTTP_METHODS } from '../utils/integrationForm'

const inputClass =
  'w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'
const labelClass = 'block text-sm font-medium text-slate-700 mb-1.5'
const sectionClass = 'bg-white border border-slate-200 rounded-xl p-6 shadow-sm'

function OperationBlock({ title, name, form, onChange }) {
  const op = form.operations[name]

  const handleOpChange = (field, value) => {
    onChange({
      target: {
        name: `operations.${name}.${field}`,
        value,
        type: field === 'enabled' ? 'checkbox' : 'text',
        checked: value,
      },
    })
  }

  return (
    <div className="border border-slate-200 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-slate-900">{title}</h4>
        <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
          <input
            type="checkbox"
            checked={op.enabled}
            onChange={(e) => handleOpChange('enabled', e.target.checked)}
            className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
          />
          Enabled
        </label>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        <div>
          <label className={labelClass}>Method</label>
          <select
            value={op.method}
            onChange={(e) => handleOpChange('method', e.target.value)}
            className={inputClass}
          >
            {HTTP_METHODS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
        <div className="lg:col-span-2">
          <label className={labelClass}>Path</label>
          <input
            type="text"
            value={op.path}
            onChange={(e) => handleOpChange('path', e.target.value)}
            placeholder="/api/wallet/balance"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Timeout (ms)</label>
          <input
            type="number"
            value={op.timeoutMs}
            onChange={(e) => handleOpChange('timeoutMs', e.target.value)}
            min="1000"
            className={inputClass}
          />
        </div>
        <div className="lg:col-span-2">
          <label className={labelClass}>Content Type</label>
          <input
            type="text"
            value={op.contentType}
            onChange={(e) => handleOpChange('contentType', e.target.value)}
            className={inputClass}
          />
        </div>
      </div>
    </div>
  )
}

function IntegrationForm({ form, onChange, operatorIdReadOnly = false, operators = [] }) {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target

    if (name.startsWith('operations.')) {
      const [, opName, field] = name.split('.')
      onChange({
        ...form,
        operations: {
          ...form.operations,
          [opName]: {
            ...form.operations[opName],
            [field]: type === 'checkbox' ? checked : value,
          },
        },
      })
      return
    }

    if (name.startsWith('transport.')) {
      const parts = name.split('.')
      const [, section, field] = parts
      if (section === 'kafka' && field === 'brokers') {
        onChange({
          ...form,
          transport: {
            ...form.transport,
            kafka: {
              ...form.transport.kafka,
              brokers: value.split(',').map((b) => b.trim()),
            },
          },
        })
        return
      }
      onChange({
        ...form,
        transport: {
          ...form.transport,
          [section]: {
            ...form.transport[section],
            [field]: type === 'checkbox' ? checked : value,
          },
        },
      })
      return
    }

    if (name.startsWith('auth.')) {
      const [, section, field] = name.split('.')
      if (section === 'custom' && field === 'headersJson') {
        onChange({
          ...form,
          auth: { ...form.auth, custom: { headersJson: value } },
        })
        return
      }
      onChange({
        ...form,
        auth: {
          ...form.auth,
          [section]: {
            ...form.auth[section],
            [field]: value,
          },
        },
      })
      return
    }

    if (name.startsWith('capabilities.')) {
      const field = name.split('.')[1]
      onChange({
        ...form,
        capabilities: {
          ...form.capabilities,
          [field]: checked,
        },
      })
      return
    }

    onChange({
      ...form,
      [name]: type === 'checkbox' ? checked : value,
    })
  }

  return (
    <div className="space-y-6">
      <div className={sectionClass}>
        <h3 className="text-base font-semibold text-slate-900 mb-4">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>Operator ID *</label>
            {operatorIdReadOnly ? (
              <input type="text" value={form.operatorId} readOnly className={`${inputClass} bg-slate-100 text-slate-500`} />
            ) : operators.length > 0 ? (
              <select
                name="operatorId"
                value={form.operatorId}
                onChange={handleChange}
                required
                className={inputClass}
              >
                <option value="">Select operator</option>
                {operators.map((op) => (
                  <option key={op._id} value={op.operatorId}>
                    {op.operatorId} — {op.name}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                name="operatorId"
                value={form.operatorId}
                onChange={handleChange}
                required
                placeholder="ROYAL-GAMING-001"
                className={inputClass}
              />
            )}
          </div>
          <div>
            <label className={labelClass}>Name *</label>
            <input type="text" name="name" value={form.name} onChange={handleChange} required className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Adapter *</label>
            <input type="text" name="adapter" value={form.adapter} onChange={handleChange} required placeholder="generic-rest" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Status</label>
            <select name="status" value={form.status} onChange={handleChange} className={inputClass}>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="MAINTENANCE">Maintenance</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Environment</label>
            <select name="environment" value={form.environment} onChange={handleChange} className={inputClass}>
              <option value="SANDBOX">Sandbox</option>
              <option value="PRODUCTION">Production</option>
            </select>
          </div>
        </div>
      </div>

      <div className={sectionClass}>
        <h3 className="text-base font-semibold text-slate-900 mb-4">Transport</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className={labelClass}>Type *</label>
            <select
              name="transport.type"
              value={form.transport.type}
              onChange={(e) =>
                onChange({ ...form, transport: { ...form.transport, type: e.target.value } })
              }
              className={inputClass}
            >
              <option value="API">API</option>
              <option value="RABBITMQ">RabbitMQ</option>
              <option value="KAFKA">Kafka</option>
            </select>
          </div>
        </div>

        {form.transport.type === 'API' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Base URL *</label>
              <input
                type="url"
                name="transport.api.baseUrl"
                value={form.transport.api.baseUrl}
                onChange={handleChange}
                required
                placeholder="https://operator-api.example.com"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Timeout (ms)</label>
              <input
                type="number"
                name="transport.api.timeoutMs"
                value={form.transport.api.timeoutMs}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
          </div>
        )}

        {form.transport.type === 'RABBITMQ' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-3">
              <label className={labelClass}>URL</label>
              <input type="text" name="transport.rabbitmq.url" value={form.transport.rabbitmq.url} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Exchange</label>
              <input type="text" name="transport.rabbitmq.exchange" value={form.transport.rabbitmq.exchange} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Queue</label>
              <input type="text" name="transport.rabbitmq.queue" value={form.transport.rabbitmq.queue} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Routing Key</label>
              <input type="text" name="transport.rabbitmq.routingKey" value={form.transport.rabbitmq.routingKey} onChange={handleChange} className={inputClass} />
            </div>
          </div>
        )}

        {form.transport.type === 'KAFKA' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className={labelClass}>Brokers (comma-separated)</label>
              <input
                type="text"
                name="transport.kafka.brokers"
                value={form.transport.kafka.brokers.join(', ')}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Topic</label>
              <input type="text" name="transport.kafka.topic" value={form.transport.kafka.topic} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Client ID</label>
              <input type="text" name="transport.kafka.clientId" value={form.transport.kafka.clientId} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Group ID</label>
              <input type="text" name="transport.kafka.groupId" value={form.transport.kafka.groupId} onChange={handleChange} className={inputClass} />
            </div>
          </div>
        )}
      </div>

      <div className={sectionClass}>
        <h3 className="text-base font-semibold text-slate-900 mb-4">Authentication</h3>
        <div className="mb-4">
          <label className={labelClass}>Auth Type</label>
          <select
            name="auth.type"
            value={form.auth.type}
            onChange={(e) => onChange({ ...form, auth: { ...form.auth, type: e.target.value } })}
            className={`${inputClass} max-w-xs`}
          >
            <option value="NONE">None</option>
            <option value="API_KEY">API Key</option>
            <option value="BEARER">Bearer</option>
            <option value="BASIC">Basic</option>
            <option value="HMAC">HMAC</option>
            <option value="CUSTOM">Custom</option>
          </select>
        </div>

        {form.auth.type === 'API_KEY' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Header</label>
              <input type="text" name="auth.apiKey.header" value={form.auth.apiKey.header} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Secret Ref</label>
              <input type="text" name="auth.apiKey.secretRef" value={form.auth.apiKey.secretRef} onChange={handleChange} className={inputClass} />
            </div>
          </div>
        )}

        {form.auth.type === 'BEARER' && (
          <div>
            <label className={labelClass}>Token Ref</label>
            <input type="text" name="auth.bearer.tokenRef" value={form.auth.bearer.tokenRef} onChange={handleChange} className={inputClass} />
          </div>
        )}

        {form.auth.type === 'BASIC' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Username Ref</label>
              <input type="text" name="auth.basic.usernameRef" value={form.auth.basic.usernameRef} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Password Ref</label>
              <input type="text" name="auth.basic.passwordRef" value={form.auth.basic.passwordRef} onChange={handleChange} className={inputClass} />
            </div>
          </div>
        )}

        {form.auth.type === 'HMAC' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Secret Ref</label>
              <input type="text" name="auth.hmac.secretRef" value={form.auth.hmac.secretRef} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Algorithm</label>
              <input type="text" name="auth.hmac.algorithm" value={form.auth.hmac.algorithm} onChange={handleChange} className={inputClass} />
            </div>
          </div>
        )}

        {form.auth.type === 'CUSTOM' && (
          <div>
            <label className={labelClass}>Custom Headers (JSON)</label>
            <textarea
              name="auth.custom.headersJson"
              value={form.auth.custom.headersJson}
              onChange={handleChange}
              rows={4}
              className={`${inputClass} font-mono text-xs resize-none`}
            />
          </div>
        )}
      </div>

      <div className={sectionClass}>
        <h3 className="text-base font-semibold text-slate-900 mb-4">Capabilities</h3>
        <div className="flex flex-wrap gap-6">
          {Object.keys(form.capabilities).map((key) => (
            <label key={key} className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                name={`capabilities.${key}`}
                checked={form.capabilities[key]}
                onChange={handleChange}
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              {key.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase())}
            </label>
          ))}
        </div>
      </div>

      <div className={sectionClass}>
        <h3 className="text-base font-semibold text-slate-900 mb-4">Operations</h3>
        <div className="space-y-4">
          <OperationBlock title="Player Profile" name="playerProfile" form={form} onChange={handleChange} />
          <OperationBlock title="Balance" name="balance" form={form} onChange={handleChange} />
          <OperationBlock title="Debit" name="debit" form={form} onChange={handleChange} />
          <OperationBlock title="Credit" name="credit" form={form} onChange={handleChange} />
        </div>
      </div>

      <div className={sectionClass}>
        <label className={labelClass}>Metadata (JSON)</label>
        <textarea
          name="metadataJson"
          value={form.metadataJson}
          onChange={handleChange}
          rows={4}
          className={`${inputClass} font-mono text-xs resize-none`}
        />
      </div>
    </div>
  )
}

export default IntegrationForm
