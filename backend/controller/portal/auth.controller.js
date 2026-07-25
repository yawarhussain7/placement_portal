import { registerService, loginService, logoutService } from '../../services/portal/auth.service.js'

export const cookieOptions = {
    maxAge: 1 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: false,
    sameSite: 'lax'
};

export const registerController = async (req, res) => {
    try {
        const { fullName, email, password } = req.body

        if (!fullName || !email || !password) {
            return res.status(400).json({
                message: 'All fields are required'
            })
        }

        const user = await registerService({ fullName, email, password })
        const token = user.token
        res.cookie('token', token, cookieOptions)
        return res.status(201).json({
            message: 'User successfully created....',
            success: true,
            data: user
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message || 'Registration issue',
            success: false
        })
    }
}

export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({
                message: 'All fields are required'
            })
        }

        const user = await loginService({ email, password })
        const token = user.token

        res.cookie('token', token, cookieOptions)
        return res.status(200).json({
            message: 'User successfully login....',
            success: true,
            data: user
        })

    } catch (error) {
        console.log(`Login Errror ${error}`)
        return res.status(500).json({
            message: error.message || 'Login issue',
            success: false
        })
    }
}

export const logoutController = async (req, res) => {
    try {
        const result = logoutService()
        console.log('Logging out user, clearing cookie...')
        res.clearCookie("token", {
            ...cookieOptions,
            expires: new Date(0)
        })
        console.log('Cookie cleared successfully')
        return res.status(200).json({
            message: 'Logout successfully',
            success: true,
            data: result
        })
    } catch (error) {
        console.error('Logout error:', error)
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

