import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

const connectDB = async () => {
  const uri = (process.env.MONGO_URI || process.env.MONGODB_URI || '').trim()

  if (!uri) {
    console.error(
      'MongoDB connection failed: MONGO_URI is not set. Add it in Render → Environment.'
    )
    process.exit(1)
  }

  try {
    await mongoose.connect(uri)
    console.log('MongoDB connected')
  } catch (error) {
    if (error.code === 8000 || error.codeName === 'AtlasError') {
      console.error(
        'MongoDB authentication failed. Check Atlas database user/password in MONGO_URI, URL-encode special characters in the password, and confirm the user exists on the correct cluster.'
      )
    } else {
      console.error('MongoDB connection error:', error.message)
    }
    process.exit(1)
  }
}

export default connectDB