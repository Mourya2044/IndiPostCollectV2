import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
  loginUser,
  signUpUser,
  logoutUser,
  getUserInfo,
  checkAuth, 
  verifyEmail,
  updateProfilePic
} from "../controllers/auth.controller.js";

const authRouter = express.Router();

authRouter.post("/login", loginUser);
authRouter.post("/signup", signUpUser);
authRouter.get("/me", protect, getUserInfo);
authRouter.post("/logout", logoutUser);
authRouter.get("/checkauth",protect,checkAuth);
authRouter.get("/verify/:userId/:uniqueString",verifyEmail)
authRouter.patch("/profile-pic", protect, updateProfilePic);

export default authRouter;
