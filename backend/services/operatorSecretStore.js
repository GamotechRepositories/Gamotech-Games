import {
  CreateSecretCommand,
  DeleteSecretCommand,
  GetSecretValueCommand,
  PutSecretValueCommand,
  SecretsManagerClient,
} from '@aws-sdk/client-secrets-manager'

let client = null

const getClient = () => {
  if (!client) {
    client = new SecretsManagerClient({
      region: process.env.AWS_REGION || 'ap-south-1',
    })
  }
  return client
}

export const getOperatorSecretName = (operatorId) =>
  `${process.env.AWS_OPERATOR_SECRET_PREFIX || 'gamotech/operators'}/${operatorId}`

export const storeOperatorApiSecret = async (operatorId, apiSecret) => {
  const Name = getOperatorSecretName(operatorId)
  const SecretString = JSON.stringify({ apiSecret })

  try {
    await getClient().send(new CreateSecretCommand({ Name, SecretString }))
  } catch (error) {
    if (error.name === 'ResourceExistsException') {
      await getClient().send(new PutSecretValueCommand({ SecretId: Name, SecretString }))
      return
    }
    throw error
  }
}

export const getOperatorApiSecret = async (secretPathOrOperatorId) => {
  const Name = secretPathOrOperatorId.includes('/')
    ? secretPathOrOperatorId
    : getOperatorSecretName(secretPathOrOperatorId)

  try {
    const { SecretString } = await getClient().send(
      new GetSecretValueCommand({ SecretId: Name })
    )
    if (!SecretString) return null
    const parsed = JSON.parse(SecretString)
    return parsed.apiSecret || null
  } catch (error) {
    if (error.name === 'ResourceNotFoundException') return null
    throw error
  }
}

export const deleteOperatorApiSecret = async (secretPathOrOperatorId) => {
  const Name = secretPathOrOperatorId.includes('/')
    ? secretPathOrOperatorId
    : getOperatorSecretName(secretPathOrOperatorId)

  try {
    await getClient().send(
      new DeleteSecretCommand({
        SecretId: Name,
        ForceDeleteWithoutRecovery: true,
      })
    )
  } catch (error) {
    if (error.name === 'ResourceNotFoundException') return
    throw error
  }
}
