import { register_validation, login_validation } from "../../validator/auth.validation.js";
import {
    Register_Service,
    Login_Service,
} from "../../service/admin/auth.service.js";
import AppError from "../../errors/auth.errors.js";

// Helper function to set auth cookie
const setAuthCookie = (res, token) => {
    res.cookie("token", token, {
        httpOnly: true,
        secure: false, // set to true in production with HTTPS
        sameSite: "lax",
        maxAge: 1 * 24 * 60 * 60 * 1000
    })
}

export const RegisterUser = async (req, res) => {
    try {
        const result = register_validation.safeParse(req.body);
        if (!result.success) {
            throw new AppError(result.error.issues[0].message, 400);
        }

        const { name, email, password } = result.data;

        const user = await Register_Service({
            name,
            email,
            password,
        });

        setAuthCookie(res, user.token)

        res.status(201).json({
            message: "User created successfully",
            success: true,
            data: user,
        });
    } catch (error) {
        console.error("RegisterUser controller error:", error.message);

        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.message,
            success: false,
        });
    }
};

export const LoginUser = async (req, res) => {
    try {
        const result = login_validation.safeParse(req.body);
        if (!result.success) {
            throw new AppError(result.error.issues[0].message, 400);
        }
        const { email, password } = result.data;

        const user = await Login_Service({
            email,
            password,
        });

        setAuthCookie(res, user.token)
        
        res.status(200).json({
            message: "User login successful",
            success: true,
            data: user,
        });
    } catch (error) {
        console.error("LoginUser controller error:", error.message);

        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.message,
            success: false,
        });
    }
};
