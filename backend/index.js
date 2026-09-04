import cors from 'cors'
import express from 'express'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
import reportRouter from './routes/reportRoute.js'
import adminRouter from './routes/adminRoute.js'
import gameRouter from './routes/gameRoute.js'
import operatorRouter from './routes/operatorRoute.js'

dotenv.config()

const app = express()

connectDB()

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
  })
)
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello World')
})

app.use('/api/v1/games', gameRouter)
app.use('/api/v1/operators', operatorRouter)
app.use('/api/v1', reportRouter)
app.use('/api/v1', adminRouter)

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`)
})
