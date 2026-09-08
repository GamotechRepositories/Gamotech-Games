export const HTTP_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']

export const defaultOperation = () => ({
  enabled: true,
  method: 'POST',
  path: '',
  contentType: 'application/json',
  timeoutMs: 10000,
})

export const initialIntegrationForm = {
  operatorId: '',
  name: '',
  adapter: '',
  status: 'INACTIVE',
  environment: 'SANDBOX',
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
  auth: {
    type: 'NONE',
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
  },
  operations: {
    playerProfile: defaultOperation(),
    balance: defaultOperation(),
    debit: defaultOperation(),
    credit: defaultOperation(),
  },
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
}

const mergeOperation = (operation) => ({
  ...defaultOperation(),
  ...operation,
})

export const integrationToForm = (integration) => {
  const transport = integration.transport || {}
  const auth = integration.auth || {}
  const customHeaders = auth.custom?.headers

  return {
    operatorId: integration.operatorId || '',
    name: integration.name || '',
    adapter: integration.adapter || '',
    status: integration.status || 'INACTIVE',
    environment: integration.environment || 'SANDBOX',
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
        brokers: transport.kafka?.brokers?.length
          ? transport.kafka.brokers
          : [''],
        topic: transport.kafka?.topic || '',
        clientId: transport.kafka?.clientId || '',
        groupId: transport.kafka?.groupId || '',
        acks: transport.kafka?.acks || 'all',
        partition: transport.kafka?.partition ?? 0,
      },
    },
    auth: {
      type: auth.type || 'NONE',
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
        headersJson: JSON.stringify(
          customHeaders instanceof Map
            ? Object.fromEntries(customHeaders)
            : customHeaders || {},
          null,
          2
        ),
      },
    },
    operations: {
      playerProfile: mergeOperation(integration.operations?.playerProfile),
      balance: mergeOperation(integration.operations?.balance),
      debit: mergeOperation(integration.operations?.debit),
      credit: mergeOperation(integration.operations?.credit),
    },
    capabilities: {
      ...initialIntegrationForm.capabilities,
      ...integration.capabilities,
    },
    metadataJson: JSON.stringify(integration.metadata || {}, null, 2),
  }
}

export const buildIntegrationPayload = (form) => {
  const { metadataJson, auth, transport, ...rest } = form

  let metadata = {}
  if (metadataJson?.trim()) {
    metadata = JSON.parse(metadataJson)
  }

  let customHeaders = {}
  if (auth.type === 'CUSTOM' && auth.custom?.headersJson?.trim()) {
    customHeaders = JSON.parse(auth.custom.headersJson)
  }

  const payload = {
    ...rest,
    metadata,
    capabilities: { ...form.capabilities },
    operations: { ...form.operations },
    auth: {
      type: auth.type,
      ...(auth.type === 'API_KEY' && { apiKey: auth.apiKey }),
      ...(auth.type === 'BEARER' && { bearer: auth.bearer }),
      ...(auth.type === 'BASIC' && { basic: auth.basic }),
      ...(auth.type === 'HMAC' && { hmac: auth.hmac }),
      ...(auth.type === 'CUSTOM' && { custom: { headers: customHeaders } }),
    },
  }

  if (transport.type === 'API') {
    payload.transport = { type: 'API', api: transport.api }
  } else if (transport.type === 'RABBITMQ') {
    payload.transport = { type: 'RABBITMQ', rabbitmq: transport.rabbitmq }
  } else {
    payload.transport = {
      type: 'KAFKA',
      kafka: {
        ...transport.kafka,
        brokers: transport.kafka.brokers.filter(Boolean),
      },
    }
  }

  return payload
}
