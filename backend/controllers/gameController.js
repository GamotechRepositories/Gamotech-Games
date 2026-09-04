import Game from '../model/games.js'

const handleError = (res, error, statusCode = 500) => {
  const code = error.code === 11000 ? 409 : statusCode
  res.status(code).json({
    success: false,
    message: error.message,
  })
}

export const createGame = async (req, res) => {
  try {
    const game = await Game.create(req.body)
    res.status(201).json({
      success: true,
      message: 'Game created successfully',
      game,
    })
  } catch (error) {
    handleError(res, error, 400)
  }
}

export const getGames = async (req, res) => {
  try {
    const filter = {}
    if (req.query.status) filter.status = req.query.status
    if (req.query.category) filter.category = req.query.category

    const games = await Game.find(filter).sort({ sortOrder: 1, createdAt: -1 })
    res.status(200).json({
      success: true,
      count: games.length,
      games,
    })
  } catch (error) {
    handleError(res, error)
  }
}

export const getGameById = async (req, res) => {
  try {
    const game = await Game.findById(req.params.id)
    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Game not found',
      })
    }

    res.status(200).json({
      success: true,
      game,
    })
  } catch (error) {
    handleError(res, error, 400)
  }
}

export const updateGame = async (req, res) => {
  try {
    const game = await Game.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Game not found',
      })
    }

    res.status(200).json({
      success: true,
      message: 'Game updated successfully',
      game,
    })
  } catch (error) {
    handleError(res, error, 400)
  }
}

export const deleteGame = async (req, res) => {
  try {
    const game = await Game.findByIdAndDelete(req.params.id)
    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Game not found',
      })
    }

    res.status(200).json({
      success: true,
      message: 'Game deleted successfully',
    })
  } catch (error) {
    handleError(res, error, 400)
  }
}
