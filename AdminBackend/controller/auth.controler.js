import { auth_validation } from "../validator/auth.validation.js";
import {
    Register_Service,
    Login_Service,
} from "../services/auth.service.js";

export const RegisterUser = async (req, res) => {
    try {
        const result = auth_validation.safeParse(req.body);
        if (!result.success) {
            throw new Error(
                result.error.issues[0].message
            );
        }

        const { name, email, password } = result.data;

        const user = await Register_Service({
            name,
            email,
            password,
        });

        res.status(201).json({
            message: "User created successfully",
            success: true,
            data: user,
        });
    } catch (error) {
        console.log(
            "RegisterUser controller error:",
            error.message
        );

        res.status(400).json({
            message: error.message,
            success: false,
        });
    }
};

export const LoginUser = async (req, res) => {
    try {
        const result = auth_validation.safeParse(req.body);

        if (!result.success) {
            throw new Error(
                result.error.issues[0].message
            );
        }

        const { email, password } = result.data;

        const user = await Login_Service({
            email,
            password,
        });

        res.status(200).json({
            message: "User login successful",
            success: true,
            data: user,
        });
    } catch (error) {
        console.log(
            "LoginUser controller error:",
            error.message
        );

        res.status(400).json({
            message: error.message,
            success: false,
        });
    }
};