import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import Admin from '../model/admin.js'

const handleError = (res, error, statusCode = 500) => {
  const code = error.code === 11000 ? 409 : statusCode
  res.status(code).json({
    success: false,
    message: error.message,
  })
}

const formatAdmin = (admin) => ({
  _id: admin._id,
  name: admin.name,
  email: admin.email,
  phone: admin.phone,
  createdAt: admin.createdAt,
  updatedAt: admin.updatedAt,
})

export const createAdmin = async (req, res) => {
  const { name, email, phone, password } = req.body

  try {
    const hashedPassword = await bcrypt.hash(password, 10)
    const admin = await Admin.create({
      name,
      email,
      phone,
      password: hashedPassword,
    })

    res.status(201).json({
      success: true,
      message: 'Admin created successfully',
      admin: formatAdmin(admin),
    })
  } catch (error) {
    handleError(res, error, 400)
  }
}

export const loginAdmin = async (req, res) => {
  const { email, password } = req.body

  try {
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      })
    }

    const admin = await Admin.findOne({ email: email.toLowerCase() }).select('+password')
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      })
    }

    const isMatch = await bcrypt.compare(password, admin.password)
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      })
    }

    const token = jwt.sign(
      { id: admin._id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      admin: formatAdmin(admin),
    })
  } catch (error) {
    handleError(res, error, 400)
  }
}

export const getAdmins = async (req, res) => {
  try {
    const admins = await Admin.find().select('-password').sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      count: admins.length,
      admins: admins.map(formatAdmin),
    })
  } catch (error) {
    handleError(res, error)
  }
}

export const getAdminById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found',
      })
    }

    const admin = await Admin.findById(req.params.id).select('-password')

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found',
      })
    }

    res.status(200).json({
      success: true,
      admin: formatAdmin(admin),
    })
  } catch (error) {
    handleError(res, error, 400)
  }
}

export const updateAdmin = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found',
      })
    }

    const { password, ...updates } = req.body

    if (password) {
      updates.password = await bcrypt.hash(password, 10)
    }

    const admin = await Admin.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    }).select('-password')

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found',
      })
    }

    res.status(200).json({
      success: true,
      message: 'Admin updated successfully',
      admin: formatAdmin(admin),
    })
  } catch (error) {
    handleError(res, error, 400)
  }
}
