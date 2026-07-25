import express from 'express'
import { getProfileController, updateProfileController } from '../../controller/portal/profile.controller.js'
import { authMiddleware } from '../../middleware/auth.middleware.js'
import { uploadAvatar } from '../../middleware/upload.middleware.js'

const route = express.Router()

// Profile routes
route.get('/profile', authMiddleware, getProfileController)
route.put('/profile', authMiddleware, uploadAvatar, updateProfileController)

export default route
