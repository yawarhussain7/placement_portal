import jwt from 'jsonwebtoken';

// Helper function to extract token from request
const extractToken = (req) => {
    let token = req.cookies?.token
    return token
}

export const verifyToken = (req, res, next) => {
    try {
        const token = extractToken(req)

        if (!token) {
            return res.status(401).json({ message: 'Authentication required', success: false })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        next()
    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token', success: false })
    }
}

