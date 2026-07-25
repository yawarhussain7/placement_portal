import jwt from 'jsonwebtoken'
import studentModel from '../Model/portal/auth.model.js'


export const authMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies.token

        if (!token) {
            return res.status(401).json({
                message: 'Unauthorized - No token provided',
                success: false
            })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const user = await studentModel.findById(decoded.id).select('-password')

        if (!user) {
            return res.status(401).json({
                message: 'Unauthorized - User not found',
                success: false
            })
        }

        req.user = user
        req.userId = user._id
        next()
    } catch (error) {
        return res.status(401).json({
            message: 'Unauthorized - Invalid token',
            success: false
        })
    }
}
