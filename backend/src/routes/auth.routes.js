import express from "express";
import {protect} from "../middlewares/auth.middleware.js"
import { loginUser, signupUser, logoutUser , getUserInfo} from "../controllers/auth.controller.js";

const authRouter = express.Router();

authRouter.post("/login", loginUser);
authRouter.post("/signup", signupUser);
authRouter.get("/get",protect,getUserInfo);
authRouter.post("/logout", logoutUser);

export default authRouter;