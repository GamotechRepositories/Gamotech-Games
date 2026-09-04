import crypto from 'crypto'
import Operator from '../model/operator.js'
import {
  deleteOperatorApiSecret,
  getOperatorApiSecret,
  getOperatorSecretName,
  storeOperatorApiSecret,
} from '../services/operatorSecretStore.js'

const handleError = (res, error, statusCode = 500) => {
  const code = error.code === 11000 ? 409 : statusCode
  res.status(code).json({
    success: false,
    message: error.message,
  })
}

const generateApiKey = () => crypto.randomBytes(16).toString('hex')
const generateApiSecret = () => crypto.randomBytes(32).toString('hex')

const attachApiSecret = async (operator, apiSecret = null) => {
  const doc = operator.toObject ? operator.toObject() : { ...operator }
  const secretPath =
    doc.apiSecretPath || getOperatorSecretName(doc.operatorId)
  doc.apiSecret =
    apiSecret ?? (await getOperatorApiSecret(secretPath)) ?? ''
  return doc
}

const nameToOperatorIdBase = (name) =>
  name
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

const generateOperatorId = async (name, excludeId = null) => {
  const base = nameToOperatorIdBase(name)
  if (!base) {
    throw new Error('Operator name is required to generate operator ID')
  }

  const existing = await Operator.find({
    operatorId: new RegExp(`^${base.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}-\\d+$`, 'i'),
  }).select('operatorId _id')

  let maxNum = 0
  for (const op of existing) {
    if (excludeId && op._id.toString() === excludeId.toString()) continue
    const match = op.operatorId.match(/-(\d+)$/)
    if (match) maxNum = Math.max(maxNum, parseInt(match[1], 10))
  }

  return `${base}-${String(maxNum + 1).padStart(3, '0')}`
}

export const createOperator = async (req, res) => {
  try {
    const { apiSecret: _apiSecret, apiKey: bodyApiKey, apiSecretPath: _path, ...body } =
      req.body
    const operatorId = body.operatorId || (await generateOperatorId(body.name))
    const apiKey = bodyApiKey || generateApiKey()
    const apiSecret = generateApiSecret()
    const apiSecretPath = getOperatorSecretName(operatorId)

    const operator = await Operator.create({
      ...body,
      operatorId,
      apiKey,
      apiSecretPath,
    })

    try {
      await storeOperatorApiSecret(operatorId, apiSecret)
    } catch (error) {
      await Operator.findByIdAndDelete(operator._id)
      throw error
    }

    res.status(201).json({
      success: true,
      message: 'Operator created successfully',
      operator: await attachApiSecret(operator, apiSecret),
    })
  } catch (error) {
    handleError(res, error, 400)
  }
}

export const getOperators = async (req, res) => {
  try {
    const filter = {}
    if (req.query.status) filter.status = req.query.status

    const operators = await Operator.find(filter)
      .populate('enabledGames', 'name code slug status')
      .sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      count: operators.length,
      operators,
    })
  } catch (error) {
    handleError(res, error)
  }
}

export const getOperatorById = async (req, res) => {
  try {
    const operator = await Operator.findById(req.params.id).populate(
      'enabledGames',
      'name code slug status'
    )

    if (!operator) {
      return res.status(404).json({
        success: false,
        message: 'Operator not found',
      })
    }

    res.status(200).json({
      success: true,
      operator: await attachApiSecret(operator),
    })
  } catch (error) {
    handleError(res, error, 400)
  }
}

export const updateOperator = async (req, res) => {
  try {
    const {
      apiSecret,
      apiKey: _apiKey,
      operatorId: _operatorId,
      apiSecretPath: _apiSecretPath,
      ...updates
    } = req.body

    const existing = await Operator.findById(req.params.id)
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Operator not found',
      })
    }

    if (!existing.operatorId) {
      updates.operatorId = await generateOperatorId(
        updates.name || existing.name,
        existing._id
      )
    }

    if (!existing.apiSecretPath) {
      updates.apiSecretPath = getOperatorSecretName(
        updates.operatorId || existing.operatorId
      )
    }

    const operator = await Operator.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    }).populate('enabledGames', 'name code slug status')

    if (!operator) {
      return res.status(404).json({
        success: false,
        message: 'Operator not found',
      })
    }

    res.status(200).json({
      success: true,
      message: 'Operator updated successfully',
      operator: await attachApiSecret(operator),
    })
  } catch (error) {
    handleError(res, error, 400)
  }
}

export const getOperatorEnabledGames = async (req, res) => {
  try {
    const operatorId = req.params.operatorId?.trim().toUpperCase()

    if (!operatorId) {
      return res.status(400).json({
        success: false,
        message: 'Operator ID is required',
      })
    }

    const operator = await Operator.findOne({ operatorId }).populate({
      path: 'enabledGames',
      match: { status: 'ACTIVE' },
      select: '-launchUrl',
    })

    if (!operator) {
      return res.status(404).json({
        success: false,
        message: 'Operator not found',
      })
    }

    const games = (operator.enabledGames || []).filter(Boolean)

    res.status(200).json({
      success: true,
      operatorId: operator.operatorId,
      operatorName: operator.name,
      operatorStatus: operator.status,
      count: games.length,
      games,
    })
  } catch (error) {
    handleError(res, error, 400)
  }
}

export const deleteOperator = async (req, res) => {
  try {
    const operator = await Operator.findById(req.params.id)
    if (!operator) {
      return res.status(404).json({
        success: false,
        message: 'Operator not found',
      })
    }

    await deleteOperatorApiSecret(
      operator.apiSecretPath || operator.operatorId
    )
    await Operator.findByIdAndDelete(req.params.id)

    res.status(200).json({
      success: true,
      message: 'Operator deleted successfully',
    })
  } catch (error) {
    handleError(res, error, 400)
  }
}
