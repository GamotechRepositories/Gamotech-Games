export const HTTP_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
export const AUTH_TYPES = ['NONE', 'API_KEY', 'BEARER', 'BASIC', 'HMAC', 'CUSTOM']
export const DEFAULT_OPERATION_KEYS = ['playerProfile', 'balance', 'debit', 'credit']

export const defaultAuthRefs = () => ({
  type: 'NONE',
  headersJson: '{}',
  apiKey: { header: 'X-API-Key', secretRef: '' },
  bearer: { tokenRef: '' },
  basic: { usernameRef: '', passwordRef: '' },
  hmac: {
    apiKeyHeader: 'X-API-Key',
    timestampHeader: 'X-Timestamp',
    signatureHeader: 'X-Signature',
    secretRef: '',
    algorithm: 'sha256',
  },
  custom: { headersJson: '{}' },
})

export const defaultOperation = () => ({
  enabled: true,
  method: 'POST',
  path: '',
  contentType: 'application/json',
  timeoutMs: 10000,
  auth: defaultAuthRefs(),
  headersJson: '{}',
  payload: {
    staticJson: '{}',
    mappingJson: '{}',
    templateJson: '{}',
  },
  requestMappingJson: '{}',
  responseMappingJson: '{}',
  useTransportOverride: false,
  transport: {
    type: 'API',
    api: { baseUrl: '', timeoutMs: 10000 },
    rabbitmq: {
      url: '',
      exchange: '',
      queue: '',
      routingKey: '',
      durable: true,
      prefetch: 1,
    },
    kafka: {
      brokers: [''],
      topic: '',
      clientId: '',
      groupId: '',
      acks: 'all',
      partition: 0,
    },
  },
})

export const initialSecretsForm = {
  apiKeyValue: '',
  bearerTokenValue: '',
  basicUsernameValue: '',
  basicPasswordValue: '',
  hmacSecretValue: '',
  rabbitmqPasswordValue: '',
  kafkaUsernameValue: '',
  kafkaPasswordValue: '',
  clientCertPem: '',
  privateKeyPem: '',
}

export const initialIntegrationForm = {
  operatorId: '',
  name: '',
  adapter: '',
  status: 'INACTIVE',
  environment: 'SANDBOX',
  createdBy: '',
  updatedBy: '',
  transport: {
    type: 'API',
    api: { baseUrl: '', timeoutMs: 10000 },
    rabbitmq: {
      url: '',
      exchange: '',
      queue: '',
      routingKey: '',
      durable: true,
      prefetch: 1,
    },
    kafka: {
      brokers: [''],
      topic: '',
      clientId: '',
      groupId: '',
      acks: 'all',
      partition: 0,
    },
  },
  auth: defaultAuthRefs(),
  operations: Object.fromEntries(
    DEFAULT_OPERATION_KEYS.map((key) => [key, defaultOperation()])
  ),
  capabilities: {
    supportsPlayerProfile: false,
    supportsBalance: false,
    supportsDebit: false,
    supportsCredit: false,
    asyncCredit: false,
    idempotentDebit: false,
    idempotentCredit: false,
  },
  metadataJson: '{}',
  secrets: initialSecretsForm,
}

const mapToJson = (value, fallback = {}) => {
  if (!value) return JSON.stringify(fallback, null, 2)
  if (typeof value === 'string') return value
  return JSON.stringify(
    value instanceof Map ? Object.fromEntries(value) : value,
    null,
    2
  )
}

const mergeOperation = (operation) => ({
  ...defaultOperation(),
  ...operation,
  auth: {
    ...defaultAuthRefs(),
    ...operation?.auth,
    apiKey: { ...defaultAuthRefs().apiKey, ...operation?.auth?.apiKey },
    bearer: { ...defaultAuthRefs().bearer, ...operation?.auth?.bearer },
    basic: { ...defaultAuthRefs().basic, ...operation?.auth?.basic },
    hmac: { ...defaultAuthRefs().hmac, ...operation?.auth?.hmac },
    custom: {
      headersJson: mapToJson(operation?.auth?.custom?.headers, {}),
    },
    headersJson: mapToJson(operation?.auth?.headers, {}),
  },
  headersJson: mapToJson(operation?.headers, {}),
  payload: {
    staticJson: mapToJson(operation?.payload?.static, {}),
    mappingJson: mapToJson(operation?.payload?.mapping, {}),
    templateJson: mapToJson(operation?.payload?.template, {}),
  },
  requestMappingJson: mapToJson(operation?.requestMapping, {}),
  responseMappingJson: mapToJson(operation?.responseMapping, {}),
  useTransportOverride: Boolean(operation?.transport),
  transport: {
    ...defaultOperation().transport,
    ...operation?.transport,
    api: { ...defaultOperation().transport.api, ...operation?.transport?.api },
    rabbitmq: {
      ...defaultOperation().transport.rabbitmq,
      ...operation?.transport?.rabbitmq,
    },
    kafka: {
      ...defaultOperation().transport.kafka,
      ...operation?.transport?.kafka,
      brokers: operation?.transport?.kafka?.brokers?.length
        ? operation.transport.kafka.brokers
        : [''],
    },
  },
})

export const normalizeOperations = (operations) => {
  const raw =
    operations instanceof Map ? Object.fromEntries(operations) : operations || {}
  const merged = { ...raw }

  for (const key of DEFAULT_OPERATION_KEYS) {
    if (!merged[key]) merged[key] = defaultOperation()
  }

  return Object.fromEntries(
    Object.entries(merged).map(([key, op]) => [key, mergeOperation(op)])
  )
}

export const integrationToForm = (integration) => {
  const transport = integration.transport || {}
  const auth = integration.auth || {}

  return {
    operatorId: integration.operatorId || '',
    name: integration.name || '',
    adapter: integration.adapter || '',
    status: integration.status || 'INACTIVE',
    environment: integration.environment || 'SANDBOX',
    createdBy: integration.createdBy || '',
    updatedBy: integration.updatedBy || '',
    publishedBy: integration.publishedBy || '',
    transport: {
      type: transport.type || 'API',
      api: {
        baseUrl: transport.api?.baseUrl || '',
        timeoutMs: transport.api?.timeoutMs ?? 10000,
      },
      rabbitmq: {
        url: transport.rabbitmq?.url || '',
        exchange: transport.rabbitmq?.exchange || '',
        queue: transport.rabbitmq?.queue || '',
        routingKey: transport.rabbitmq?.routingKey || '',
        durable: transport.rabbitmq?.durable ?? true,
        prefetch: transport.rabbitmq?.prefetch ?? 1,
      },
      kafka: {
        brokers: transport.kafka?.brokers?.length ? transport.kafka.brokers : [''],
        topic: transport.kafka?.topic || '',
        clientId: transport.kafka?.clientId || '',
        groupId: transport.kafka?.groupId || '',
        acks: transport.kafka?.acks || 'all',
        partition: transport.kafka?.partition ?? 0,
      },
    },
    auth: {
      ...defaultAuthRefs(),
      type: auth.type || 'NONE',
      headersJson: mapToJson(auth.headers, {}),
      apiKey: {
        header: auth.apiKey?.header || 'X-API-Key',
        secretRef: auth.apiKey?.secretRef || '',
      },
      bearer: { tokenRef: auth.bearer?.tokenRef || '' },
      basic: {
        usernameRef: auth.basic?.usernameRef || '',
        passwordRef: auth.basic?.passwordRef || '',
      },
      hmac: {
        apiKeyHeader: auth.hmac?.apiKeyHeader || 'X-API-Key',
        timestampHeader: auth.hmac?.timestampHeader || 'X-Timestamp',
        signatureHeader: auth.hmac?.signatureHeader || 'X-Signature',
        secretRef: auth.hmac?.secretRef || '',
        algorithm: auth.hmac?.algorithm || 'sha256',
      },
      custom: {
        headersJson: mapToJson(auth.custom?.headers, {}),
      },
    },
    operations: normalizeOperations(integration.operations),
    capabilities: {
      ...initialIntegrationForm.capabilities,
      ...integration.capabilities,
    },
    metadataJson: mapToJson(integration.metadata, {}),
    secrets: { ...initialSecretsForm },
  }
}

const parseJsonField = (value, fieldName) => {
  if (!value?.trim()) return undefined
  try {
    return JSON.parse(value)
  } catch {
    throw new Error(`Invalid JSON in ${fieldName}`)
  }
}

const buildAuthPayload = (auth) => {
  const headers = parseJsonField(auth.headersJson, 'auth headers')
  const payload = { type: auth.type }

  if (headers && Object.keys(headers).length) payload.headers = headers

  if (auth.type === 'API_KEY') {
    payload.apiKey = auth.apiKey
  } else if (auth.type === 'BEARER') {
    payload.bearer = auth.bearer
  } else if (auth.type === 'BASIC') {
    payload.basic = auth.basic
  } else if (auth.type === 'HMAC') {
    payload.hmac = auth.hmac
  } else if (auth.type === 'CUSTOM') {
    payload.custom = {
      headers: parseJsonField(auth.custom.headersJson, 'custom auth headers') || {},
    }
  }

  return payload
}

const buildTransportPayload = (transport) => {
  if (transport.type === 'API') {
    return { type: 'API', api: transport.api }
  }
  if (transport.type === 'RABBITMQ') {
    return { type: 'RABBITMQ', rabbitmq: transport.rabbitmq }
  }
  return {
    type: 'KAFKA',
    kafka: {
      ...transport.kafka,
      brokers: transport.kafka.brokers.filter(Boolean),
    },
  }
}

const buildOperationPayload = (operation) => {
  const payload = {
    enabled: operation.enabled,
    method: operation.method,
    path: operation.path,
    contentType: operation.contentType,
    timeoutMs: Number(operation.timeoutMs),
    auth: buildAuthPayload(operation.auth),
    requestMapping: parseJsonField(operation.requestMappingJson, 'request mapping'),
    responseMapping: parseJsonField(operation.responseMappingJson, 'response mapping'),
    payload: {
      static: parseJsonField(operation.payload.staticJson, 'payload static'),
      mapping: parseJsonField(operation.payload.mappingJson, 'payload mapping'),
      template: parseJsonField(operation.payload.templateJson, 'payload template'),
    },
  }

  const headers = parseJsonField(operation.headersJson, 'operation headers')
  if (headers && Object.keys(headers).length) payload.headers = headers

  if (operation.useTransportOverride) {
    payload.transport = buildTransportPayload(operation.transport)
  }

  return payload
}

const buildSecretsPayload = (secrets) => {
  const payload = {}
  const entries = [
    ['apiKeyValue', 'apiKey'],
    ['bearerTokenValue', 'bearerToken'],
    ['basicUsernameValue', 'basicUsername'],
    ['basicPasswordValue', 'basicPassword'],
    ['hmacSecretValue', 'hmacSecret'],
    ['rabbitmqPasswordValue', 'rabbitmqPassword'],
    ['kafkaUsernameValue', 'kafkaUsername'],
    ['kafkaPasswordValue', 'kafkaPassword'],
    ['clientCertPem', 'clientCertPem'],
    ['privateKeyPem', 'privateKeyPem'],
  ]

  for (const [formKey, secretKey] of entries) {
    if (secrets[formKey]?.trim()) payload[secretKey] = secrets[formKey].trim()
  }

  return payload
}

export const buildIntegrationPayload = (form) => {
  const { metadataJson, auth, transport, operations, secrets, publishedBy, ...rest } =
    form

  const integration = {
    ...rest,
    metadata: parseJsonField(metadataJson, 'metadata') || {},
    capabilities: { ...form.capabilities },
    auth: buildAuthPayload(auth),
    transport: buildTransportPayload(transport),
    operations: Object.fromEntries(
      Object.entries(operations).map(([key, operation]) => [
        key,
        buildOperationPayload(operation),
      ])
    ),
  }

  const secretValues = buildSecretsPayload(secrets || {})

  return {
    ...integration,
    ...(Object.keys(secretValues).length ? { secrets: secretValues } : {}),
  }
}


