import express from 'express'
import {
  getEventsByGame,
  getEventsByOperator,
  getSessionById,
  getStatsByGame,
  getStatsByOperator,
  listSessions,
  trackSession,
} from '../controllers/sessionController.js'

const sessionRouter = express.Router()

sessionRouter.get('/track', trackSession)
sessionRouter.get('/stats/by-operator', getStatsByOperator)
sessionRouter.get('/stats/by-game', getStatsByGame)
sessionRouter.get('/events/by-operator', getEventsByOperator)
sessionRouter.get('/events/by-game', getEventsByGame)
sessionRouter.get('/', listSessions)
sessionRouter.get('/:sessionId', getSessionById)

export default sessionRouter
