import {
    registerUserService, LoginUserService
} from '../../service/auth/auth.service.js'
export const registerController = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const result = await registerUserService({ username, email, password });

      
        res.cookie('auth_token', result.token, {
            httpOnly: true,
            secure: false, // set to true in production with HTTPS
            sameSite: 'lax',
            path: '/',
            maxAge: 24 * 60 * 60 * 1000 
        })

        return res.status(201).json({
            message: "User registered successfully",
            success: true,
            data: result
        });

    } catch (error) {
        console.error("REGISTER CONTROLLER ERROR:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const LoginController = async (req, res) => {
    try {
        const result = await LoginUserService(req.body)

        // Set JWT as HTTP-only cookie
        res.cookie('auth_token', result.token, {
            httpOnly: true,
            secure: false, // set to true in production with HTTPS
            sameSite: 'lax',
            path: '/',
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        })

        return res.status(200).json({
            message: 'User login successfully',
            success: true,
            data: result
        })
    } catch (error) {
        return res.status(400).json({
            message: 'Invalid email or password',
            success: false
        })
    }
}

// Logout — clear the auth cookie
export const LogoutController = async (req, res) => {
    res.clearCookie('auth_token', {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        path: '/'
    })
    return res.status(200).json({
        message: 'Logged out successfully',
        success: true
    })
}
