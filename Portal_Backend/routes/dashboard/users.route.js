import { Router } from 'express'
import { getUser,getAllUsersController } from '../../controller/dashboard/users.controller.js'

const router = Router()

router.get('/', getUser)
router.get('/all-users',getAllUsersController)
export default router