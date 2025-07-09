import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { setupEvent, registerEvent } from "../controllers/event.controller.js";

const eventRouter = express.Router();

eventRouter.post("/setup", protect, setupEvent);
eventRouter.post("/register", protect, registerEvent);

export default eventRouter;