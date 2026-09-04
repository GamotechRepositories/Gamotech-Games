import express from 'express'
import {
  createGame,
  deleteGame,
  getGameById,
  getGames,
  updateGame,
} from '../controllers/gameController.js'

const gameRouter = express.Router()

gameRouter.post('/', createGame)
gameRouter.get('/', getGames)
gameRouter.get('/:id', getGameById)
gameRouter.put('/:id', updateGame)
gameRouter.delete('/:id', deleteGame)

export default gameRouter
