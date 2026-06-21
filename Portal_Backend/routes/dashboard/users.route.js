import { Router } from 'express'
import { getUsers } from '../../controller/dashboard/users.controller.js'

const router = Router()

router.get('/', getUsers)

export default router