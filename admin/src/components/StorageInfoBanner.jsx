function StorageInfoBanner() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
        <p className="text-sm font-semibold text-emerald-900 mb-2">Stored in MongoDB</p>
        <ul className="text-xs text-emerald-800 space-y-1 list-disc list-inside">
          <li>Operator configuration, base URLs, endpoints/paths</li>
          <li>Payload templates, request/response mappings</li>
          <li>Timeouts and feature flags (capabilities)</li>
          <li>Secret references only (`secretRef`, `tokenRef`, etc.)</li>
        </ul>
      </div>
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
        <p className="text-sm font-semibold text-amber-900 mb-2">Stored in AWS Secrets Manager</p>
        <ul className="text-xs text-amber-800 space-y-1 list-disc list-inside">
          <li>API keys, bearer tokens, username/password values</li>
          <li>HMAC secrets, RabbitMQ passwords</li>
          <li>Kafka SASL credentials, client certificates</li>
          <li>Actual secret values — never saved in MongoDB</li>
        </ul>
      </div>
    </div>
  )
}

export default StorageInfoBanner
