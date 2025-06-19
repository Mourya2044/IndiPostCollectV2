import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
  loginUser,
  signUpUser,
  logoutUser,
  getUserInfo,
  checkAuth
} from "../controllers/auth.controller.js";

const authRouter = express.Router();

authRouter.post("/login", loginUser);
authRouter.post("/signup", signUpUser);
authRouter.get("/me", protect, getUserInfo);
authRouter.post("/logout", logoutUser);
authRouter.get("/checkauth",protect,checkAuth);

export default authRouter;
