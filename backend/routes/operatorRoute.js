import express from 'express'
import {
  createOperator,
  deleteOperator,
  getOperatorById,
  getOperatorEnabledGames,
  getOperators,
  updateOperator,
} from '../controllers/operatorController.js'

const operatorRouter = express.Router()

operatorRouter.post('/', createOperator)
operatorRouter.get('/', getOperators)
operatorRouter.get('/:operatorId/enabled-games', getOperatorEnabledGames)
operatorRouter.get('/:id', getOperatorById)
operatorRouter.put('/:id', updateOperator)
operatorRouter.delete('/:id', deleteOperator)

export default operatorRouter
