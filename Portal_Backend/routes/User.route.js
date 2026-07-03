import express from 'express'
import { LoginController, registerController, LogoutController } from '../controller/auth/auth.controller.js'

const AuthRoute = express.Router()

AuthRoute.post('/register', registerController)
AuthRoute.post('/login', LoginController)
AuthRoute.post('/logout', LogoutController)



export default AuthRoute;
