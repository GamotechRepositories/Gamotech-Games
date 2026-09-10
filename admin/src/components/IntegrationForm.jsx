import AuthRefsForm from './AuthRefsForm'
import StorageInfoBanner from './StorageInfoBanner'
import { HTTP_METHODS } from '../utils/integrationForm'

const inputClass =
  'w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'
const labelClass = 'block text-sm font-medium text-slate-700 mb-1.5'
const sectionClass = 'bg-white border border-slate-200 rounded-xl p-6 shadow-sm'

function OperationBlock({ title, name, form, onChange }) {
  const op = form.operations[name]

  const updateOp = (patch) => {
    onChange({
      ...form,
      operations: {
        ...form.operations,
        [name]: { ...op, ...patch },
      },
    })
  }

  const updateNested = (path, value) => {
    if (path.startsWith('payload.')) {
      const field = path.split('.')[1]
      updateOp({ payload: { ...op.payload, [field]: value } })
      return
    }
    if (path.startsWith('transport.')) {
      const [, section, field] = path.split('.')
      if (section === 'kafka' && field === 'brokers') {
        updateOp({
          transport: {
            ...op.transport,
            kafka: {
              ...op.transport.kafka,
              brokers: value.split(',').map((b) => b.trim()).filter(Boolean),
            },
          },
        })
        return
      }
      updateOp({
        transport: {
          ...op.transport,
          [section]: { ...op.transport[section], [field]: value },
        },
      })
      return
    }
    updateOp({ [path]: value })
  }

  return (
    <div className="border border-slate-200 rounded-xl p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-slate-900">{title}</h4>
        <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
          <input
            type="checkbox"
            checked={op.enabled}
            onChange={(e) => updateOp({ enabled: e.target.checked })}
            className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
          />
          Enabled
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        <div>
          <label className={labelClass}>Method — MongoDB</label>
          <select value={op.method} onChange={(e) => updateOp({ method: e.target.value })} className={inputClass}>
            {HTTP_METHODS.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
        <div className="lg:col-span-2">
          <label className={labelClass}>Path — MongoDB</label>
          <input type="text" value={op.path} onChange={(e) => updateOp({ path: e.target.value })} placeholder="/api/wallet/balance" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Timeout (ms) — MongoDB</label>
          <input type="number" value={op.timeoutMs} min="100" max="60000" onChange={(e) => updateOp({ timeoutMs: e.target.value })} className={inputClass} />
        </div>
        <div className="lg:col-span-2">
          <label className={labelClass}>Content Type — MongoDB</label>
          <input type="text" value={op.contentType} onChange={(e) => updateOp({ contentType: e.target.value })} className={inputClass} />
        </div>
      </div>

      <div>
        <label className={labelClass}>Operation Headers (JSON) — MongoDB</label>
        <textarea value={op.headersJson} onChange={(e) => updateOp({ headersJson: e.target.value })} rows={2} className={`${inputClass} font-mono text-xs resize-none`} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <label className={labelClass}>Payload Static (JSON)</label>
          <textarea value={op.payload.staticJson} onChange={(e) => updateNested('payload.staticJson', e.target.value)} rows={3} className={`${inputClass} font-mono text-xs resize-none`} />
        </div>
        <div>
          <label className={labelClass}>Payload Mapping (JSON)</label>
          <textarea value={op.payload.mappingJson} onChange={(e) => updateNested('payload.mappingJson', e.target.value)} rows={3} className={`${inputClass} font-mono text-xs resize-none`} />
        </div>
        <div>
          <label className={labelClass}>Payload Template (JSON)</label>
          <textarea value={op.payload.templateJson} onChange={(e) => updateNested('payload.templateJson', e.target.value)} rows={3} className={`${inputClass} font-mono text-xs resize-none`} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Request Mapping (JSON) — MongoDB</label>
          <textarea value={op.requestMappingJson} onChange={(e) => updateOp({ requestMappingJson: e.target.value })} rows={3} className={`${inputClass} font-mono text-xs resize-none`} />
        </div>
        <div>
          <label className={labelClass}>Response Mapping (JSON) — MongoDB</label>
          <textarea value={op.responseMappingJson} onChange={(e) => updateOp({ responseMappingJson: e.target.value })} rows={3} className={`${inputClass} font-mono text-xs resize-none`} />
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-slate-800 mb-2">Operation Auth (refs in MongoDB)</p>
        <AuthRefsForm
          auth={op.auth}
          onChange={(nextAuth) => updateOp({ auth: nextAuth })}
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
        <input
          type="checkbox"
          checked={op.useTransportOverride}
          onChange={(e) => updateOp({ useTransportOverride: e.target.checked })}
          className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
        />
        Override transport for this operation
      </label>

      {op.useTransportOverride && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-1 border-l-2 border-indigo-100">
          <div>
            <label className={labelClass}>Transport Type</label>
            <select
              value={op.transport.type}
              onChange={(e) => updateOp({ transport: { ...op.transport, type: e.target.value } })}
              className={inputClass}
            >
              <option value="API">API</option>
              <option value="RABBITMQ">RabbitMQ</option>
              <option value="KAFKA">Kafka</option>
            </select>
          </div>
          {op.transport.type === 'API' && (
            <div>
              <label className={labelClass}>Base URL</label>
              <input type="url" value={op.transport.api.baseUrl} onChange={(e) => updateNested('transport.api.baseUrl', e.target.value)} className={inputClass} />
            </div>
          )}
          {op.transport.type === 'RABBITMQ' && (
            <div className="md:col-span-2">
              <label className={labelClass}>RabbitMQ URL (no password)</label>
              <input type="text" value={op.transport.rabbitmq.url} onChange={(e) => updateNested('transport.rabbitmq.url', e.target.value)} className={inputClass} />
            </div>
          )}
          {op.transport.type === 'KAFKA' && (
            <div className="md:col-span-2">
              <label className={labelClass}>Brokers</label>
              <input type="text" value={op.transport.kafka.brokers.join(', ')} onChange={(e) => updateNested('transport.kafka.brokers', e.target.value)} className={inputClass} />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function IntegrationForm({ form, onChange, operatorIdReadOnly = false, operators = [], isEdit = false }) {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target

    if (name.startsWith('secrets.')) {
      const field = name.split('.')[1]
      onChange({
        ...form,
        secrets: { ...form.secrets, [field]: value },
      })
      return
    }

    if (name.startsWith('transport.')) {
      const [, section, field] = name.split('.')
      if (section === 'type') {
        onChange({ ...form, transport: { ...form.transport, type: value } })
        return
      }
      if (section === 'kafka' && field === 'brokers') {
        onChange({
          ...form,
          transport: {
            ...form.transport,
            kafka: {
              ...form.transport.kafka,
              brokers: value.split(',').map((b) => b.trim()).filter(Boolean),
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

    if (name.startsWith('capabilities.')) {
      onChange({
        ...form,
        capabilities: { ...form.capabilities, [name.split('.')[1]]: checked },
      })
      return
    }

    onChange({ ...form, [name]: type === 'checkbox' ? checked : value })
  }

  return (
    <div className="space-y-6">
      <StorageInfoBanner />

      <div className={sectionClass}>
        <h3 className="text-base font-semibold text-slate-900 mb-4">Basic Information — MongoDB</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>Operator ID *</label>
            {operatorIdReadOnly ? (
              <input type="text" value={form.operatorId} readOnly className={`${inputClass} bg-slate-100 text-slate-500`} />
            ) : operators.length > 0 ? (
              <select name="operatorId" value={form.operatorId} onChange={handleChange} required className={inputClass}>
                <option value="">Select operator</option>
                {operators.map((op) => (
                  <option key={op._id} value={op.operatorId}>{op.operatorId} — {op.name}</option>
                ))}
              </select>
            ) : (
              <input type="text" name="operatorId" value={form.operatorId} onChange={handleChange} required placeholder="ROYAL-GAMING-001" className={inputClass} />
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
          <div>
            <label className={labelClass}>Created By</label>
            <input type="text" name="createdBy" value={form.createdBy} onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Updated By</label>
            <input type="text" name="updatedBy" value={form.updatedBy} onChange={handleChange} className={inputClass} />
          </div>
          {form.publishedBy !== undefined && (
            <div>
              <label className={labelClass}>Published By</label>
              <input type="text" value={form.publishedBy || '—'} readOnly className={`${inputClass} bg-slate-100 text-slate-500`} />
            </div>
          )}
        </div>
      </div>

      <div className={sectionClass}>
        <h3 className="text-base font-semibold text-slate-900 mb-4">Transport — MongoDB</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className={labelClass}>Type *</label>
            <select
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
              <input type="url" name="transport.api.baseUrl" value={form.transport.api.baseUrl} onChange={handleChange} required placeholder="https://operator-api.example.com" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Timeout (ms)</label>
              <input type="number" name="transport.api.timeoutMs" value={form.transport.api.timeoutMs} min="100" max="60000" onChange={handleChange} className={inputClass} />
            </div>
          </div>
        )}

        {form.transport.type === 'RABBITMQ' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-3">
              <label className={labelClass}>URL (without password)</label>
              <input type="text" name="transport.rabbitmq.url" value={form.transport.rabbitmq.url} onChange={handleChange} placeholder="amqp://host:5672/vhost" className={inputClass} />
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
              <input type="text" name="transport.kafka.brokers" value={form.transport.kafka.brokers.join(', ')} onChange={handleChange} className={inputClass} />
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
        <h3 className="text-base font-semibold text-slate-900 mb-4">Global Authentication — refs in MongoDB</h3>
        <AuthRefsForm auth={form.auth} onChange={(nextAuth) => onChange({ ...form, auth: nextAuth })} />
      </div>

      <div className={sectionClass}>
        <h3 className="text-base font-semibold text-slate-900 mb-2">Secret Values — AWS Secrets Manager</h3>
        <p className="text-xs text-amber-700 mb-4">
          {isEdit
            ? 'Leave blank to keep existing AWS secrets. Only filled fields are updated.'
            : 'Actual secret values are stored in AWS only. MongoDB stores references (secretRef) above.'}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>API Key Value</label>
            <input type="password" name="secrets.apiKeyValue" value={form.secrets.apiKeyValue} onChange={handleChange} className={inputClass} autoComplete="new-password" />
          </div>
          <div>
            <label className={labelClass}>Bearer Token Value</label>
            <input type="password" name="secrets.bearerTokenValue" value={form.secrets.bearerTokenValue} onChange={handleChange} className={inputClass} autoComplete="new-password" />
          </div>
          <div>
            <label className={labelClass}>Basic Username Value</label>
            <input type="text" name="secrets.basicUsernameValue" value={form.secrets.basicUsernameValue} onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Basic Password Value</label>
            <input type="password" name="secrets.basicPasswordValue" value={form.secrets.basicPasswordValue} onChange={handleChange} className={inputClass} autoComplete="new-password" />
          </div>
          <div>
            <label className={labelClass}>HMAC Secret Value</label>
            <input type="password" name="secrets.hmacSecretValue" value={form.secrets.hmacSecretValue} onChange={handleChange} className={inputClass} autoComplete="new-password" />
          </div>
          <div>
            <label className={labelClass}>RabbitMQ Password</label>
            <input type="password" name="secrets.rabbitmqPasswordValue" value={form.secrets.rabbitmqPasswordValue} onChange={handleChange} className={inputClass} autoComplete="new-password" />
          </div>
          <div>
            <label className={labelClass}>Kafka Username (SASL)</label>
            <input type="text" name="secrets.kafkaUsernameValue" value={form.secrets.kafkaUsernameValue} onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Kafka Password (SASL)</label>
            <input type="password" name="secrets.kafkaPasswordValue" value={form.secrets.kafkaPasswordValue} onChange={handleChange} className={inputClass} autoComplete="new-password" />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Client Certificate (PEM)</label>
            <textarea name="secrets.clientCertPem" value={form.secrets.clientCertPem} onChange={handleChange} rows={3} className={`${inputClass} font-mono text-xs resize-none`} />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Private Key (PEM)</label>
            <textarea name="secrets.privateKeyPem" value={form.secrets.privateKeyPem} onChange={handleChange} rows={3} className={`${inputClass} font-mono text-xs resize-none`} />
          </div>
        </div>
      </div>

      <div className={sectionClass}>
        <h3 className="text-base font-semibold text-slate-900 mb-4">Capabilities — MongoDB</h3>
        <div className="flex flex-wrap gap-6">
          {Object.keys(form.capabilities).map((key) => (
            <label key={key} className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
              <input type="checkbox" name={`capabilities.${key}`} checked={form.capabilities[key]} onChange={handleChange} className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
              {key.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase())}
            </label>
          ))}
        </div>
      </div>

      <div className={sectionClass}>
        <h3 className="text-base font-semibold text-slate-900 mb-4">Operations — MongoDB</h3>
        <div className="space-y-4">
          {Object.entries(form.operations).map(([key, op]) => (
            <OperationBlock
              key={key}
              title={key.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase())}
              name={key}
              form={form}
              onChange={onChange}
            />
          ))}
        </div>
      </div>

      <div className={sectionClass}>
        <label className={labelClass}>Metadata (JSON) — MongoDB</label>
        <textarea name="metadataJson" value={form.metadataJson} onChange={handleChange} rows={4} className={`${inputClass} font-mono text-xs resize-none`} />
      </div>
    </div>
  )
}

export default IntegrationForm
