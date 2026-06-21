import { Router } from 'express'
import { submitController } from '../../controller/newPlacement/placement_submit.controller.js'
import upload from '../../middleware/upload.middleware.js'

const router = Router()

router.post(
    '/submit-application',
    upload.fields([
        { name: 'resume', maxCount: 1 },
        { name: 'photoId', maxCount: 1 },
        { name: 'studentId', maxCount: 1 },
        { name: 'transcript', maxCount: 1 },
        { name: 'certificates', maxCount: 1 },
        { name: 'additional', maxCount: 1 }
    ]),
    submitController
)

export default router