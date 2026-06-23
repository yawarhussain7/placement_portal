import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import { GenerateToken } from "../utils/generate_token.js";
import AppError from "../errors/auth.erros.js";

// REGISTER
const Register_Service = async ({ name, email, password }) => {
  try {
    const normalizeEmail = email.toLowerCase().trim();

    const existUser = await User.findOne({ email: normalizeEmail });
    if (existUser) {
      throw new AppError("User already exists", 409);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email: normalizeEmail,
      password: hashedPassword,
    });

    const token = GenerateToken(user._id);

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      token,
    };
  } catch (error) {
    console.log("register service error : " + error.message);
    throw error;
  }
};

// LOGIN
const Login_Service = async ({ email, password }) => {
  try {
    const normalizeEmail = email.toLowerCase().trim();

    const user = await User.findOne({ email: normalizeEmail });
    if (!user) {
      throw new AppError("Invalid email or password", 401);
    }

    const match_password = await bcrypt.compare(password, user.password);
    if (!match_password) {
      throw new AppError("Invalid email or password", 401);
    }

    const token = GenerateToken(user._id);

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      token,
    };
  } catch (error) {
    console.log("Login service error: " + error.message);
    throw error;
  }
};

export {
  Register_Service,
  Login_Service,
};