import express from 'express'
import {registerController,loginController,logoutController} from '../controller/portal/auth.controller.js'
import {authMiddleware} from '../middleware/auth.middleware.js'

const route = express.Router()
route.post('/register',registerController)
route.post('/login',loginController)
route.post('/logout',logoutController)

// * Admin
import {RegisterAdminController,LoginAdminController} from '../controller/admin/auth.controller.js'
route.post('/admin-register',RegisterAdminController)
route.post('/admin-login',LoginAdminController)


export default route
