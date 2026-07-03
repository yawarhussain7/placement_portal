import { submitPlacementApplication } from '../../service/newPlacement/placement_submit.service.js'

export const submitController = async (req, res) => {
    try {
        // Handle multer errors from previous middleware
        if (req.multerError) {
            return res.status(400).send({
                message: req.multerError.message || 'File upload error',
                success: false,
            })
        }

        // Parse flat prefixed form data: p_ for personal, c_ for course, r_ for preference
        const personalData = {}
        const courseData = {}
        const preferenceData = {}

        Object.keys(req.body).forEach(key => {
            if (key.startsWith('p_')) {
                const field = key.slice(2) // remove 'p_' prefix
                personalData[field] = req.body[key]
            } else if (key.startsWith('c_')) {
                const field = key.slice(2) // remove 'c_' prefix
                courseData[field] = req.body[key]
            } else if (key.startsWith('r_')) {
                const field = key.slice(2) // remove 'r_' prefix
                if (field === 'days') {
                    // Parse JSON stringified array
                    try {
                        preferenceData.days = JSON.parse(req.body[key])
                    } catch {
                        preferenceData.days = [req.body[key]]
                    }
                } else {
                    preferenceData[field] = req.body[key]
                }
            }
        })

        // Ensure days is always an array
        if (preferenceData.days && !Array.isArray(preferenceData.days)) {
            preferenceData.days = [preferenceData.days]
        }

        // Validate required fields exist
        if (!personalData.fullName || !personalData.email) {
            return res.status(400).send({
                message: 'Personal details (name and email) are required',
                success: false,
            })
        }

        if (!courseData.course || !courseData.institution) {
            return res.status(400).send({
                message: 'Course details are required',
                success: false,
            })
        }

        if (!preferenceData.industry || !preferenceData.location) {
            return res.status(400).send({
                message: 'Placement preferences (industry and location) are required',
                success: false,
            })
        }

        const userId = req.user?.id || req.user?._id
        if (!userId) {
            return res.status(401).send({
                message: 'Authentication required to submit placement application',
                success: false
            })
        }

        const result = await submitPlacementApplication(userId, personalData, courseData, preferenceData, req.files)

        res.status(201).send({
            message: 'Placement application submitted successfully',
            success: true,
            data: result
        })

    } catch (error) {
        console.error('Placement submit error:', error.message)

        // Handle Mongoose validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(e => e.message)
            return res.status(400).send({
                message: messages.join('. '),
                success: false,
            })
        }

        // Handle duplicate key errors (if any remain)
        if (error.code === 11000) {
            return res.status(400).send({
                message: 'A duplicate entry was found. Please use a different email or reference.',
                success: false,
            })
        }

        res.status(400).send({
            message: error.message || 'Submission error. Please check all fields and try again.',
            success: false,
        })
    }
}
