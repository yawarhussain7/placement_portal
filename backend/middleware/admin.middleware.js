import jwt from 'jsonwebtoken'
import AdminModel from '../Model/admin/admin.model.js'
export const AdminAuthMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies.token
        if (!token) {
            return res.status(401).json({
                message: 'Unauthorized - No token provided',
                success: false
            })
        }

        const decode = await jwt.verify(token, process.env.JWT_SECRET)
        const admin = await AdminModel.findById(decode.id).select('-password')
        if (!admin) {
            return res.status(401).json({
                message: 'Unauthorized - Admin not found',
                success: false
            })
        }

        req.admin = admin
        req.adminId = admin._id
        next()
    } catch (error) {
        return res.status(401).json({
            message: 'Unauthorized - Invalid token',
            success: false
        })
    }
}