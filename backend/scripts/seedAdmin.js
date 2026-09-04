import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import Admin from '../model/admin.js'

dotenv.config()

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)

    const existingAdmin = await Admin.findOne({ email: 'gamotech@gmail.com' })
    if (existingAdmin) {
      console.log('Admin already exists:', existingAdmin.email)
      process.exit(0)
    }

    const hashedPassword = await bcrypt.hash('Gamotech@2026', 10)

    const admin = await Admin.create({
      name: 'gamotech admin',
      email: 'gamotech@gmail.com',
      phone: '0000000000',
      password: hashedPassword,
    })

    console.log('Admin seeded successfully:', admin.email)
    process.exit(0)
  } catch (error) {
    console.error('Seed failed:', error.message)
    process.exit(1)
  }
}

seedAdmin()
