import express from "express";
import {
  RegisterUser,
  LoginUser,
} from '../../controller/admin/auth.controller.js'

const authRoute = express.Router();

authRoute.post("/register", RegisterUser);

authRoute.post("/login", LoginUser);

export default authRoute;