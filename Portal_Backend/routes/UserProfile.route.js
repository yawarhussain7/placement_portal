import express from 'express'
import { getProfile, updateProfile } from '../controller/userController/profile.controller.js'
import upload from '../middleware/profile.middleware.js'

const UserProfile_Route = express.Router()

UserProfile_Route.get('/profile', getProfile)
UserProfile_Route.put('/profile-update/:id',
    upload.single('avatar'),
    updateProfile
)

export default UserProfile_Route;
