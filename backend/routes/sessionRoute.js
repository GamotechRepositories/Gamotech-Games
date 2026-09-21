import express from 'express'
import {
  getSessionById,
  listSessions,
  trackSession,
} from '../controllers/sessionController.js'

const sessionRouter = express.Router()

sessionRouter.get('/track', trackSession)
sessionRouter.get('/', listSessions)
sessionRouter.get('/:sessionId', getSessionById)

export default sessionRouter
