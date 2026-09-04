import express from 'express'
import {
  createAdmin,
  getAdminById,
  getAdmins,
  loginAdmin,
  updateAdmin,
} from '../controllers/adminController.js'

const adminRouter = express.Router()

adminRouter.post('/login', loginAdmin)
adminRouter.post('/create-admin', createAdmin)
adminRouter.get('/', getAdmins)
adminRouter.get('/:id', getAdminById)
adminRouter.put('/:id', updateAdmin)

export default adminRouter
