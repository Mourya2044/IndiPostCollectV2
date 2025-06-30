import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
  loginUser,
  signUpUser,
  logoutUser,
  getUserInfo,
  checkAuth, 
  verifyEmail,
  updateProfilePic,
  resetPassword
} from "../controllers/auth.controller.js";

const authRouter = express.Router();

authRouter.post("/login", loginUser);
authRouter.post("/signup", signUpUser);
authRouter.get("/me", protect, getUserInfo);
authRouter.post("/logout", logoutUser);
authRouter.get("/checkauth",protect,checkAuth);
authRouter.post("/verify/:userId/:uniqueString",verifyEmail)
authRouter.patch("/profile-pic", protect, updateProfilePic);
authRouter.post("/forget-password", resetPassword);

export default authRouter;
