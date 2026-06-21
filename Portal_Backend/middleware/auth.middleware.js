import jwt from 'jsonwebtoken'


export const verifyToken = (req, res, next) => {
    try {
        
        let token = req.cookies?.auth_token

        if (!token) {
            const authHeader = req.headers.authorization
            if (authHeader && authHeader.startsWith('Bearer ')) {
                token = authHeader.split(' ')[1]
            }
        }

        if (!token) {
            return res.status(401).json({ message: 'Authentication required', success: false })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded // { id, username, iat, exp }
        next()
    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token', success: false })
    }
}


export const optionalAuth = (req, res, next) => {
    try {
        let token = req.cookies?.auth_token
        if (!token) {
            const authHeader = req.headers.authorization
            if (authHeader && authHeader.startsWith('Bearer ')) {
                token = authHeader.split(' ')[1]
            }
        }
        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            req.user = decoded
        }
    } catch {
        // Ignore invalid token
    }
    next()
}