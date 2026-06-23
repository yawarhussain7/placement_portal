import express from "express";
import {
  RegisterUser,
  LoginUser,
} from "../controller/auth.controler.js";

const authRoute = express.Router();

authRoute.post("/signup", RegisterUser);

authRoute.post("/signin", LoginUser);

export default authRoute;