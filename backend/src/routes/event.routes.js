import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { setupEvent, registerEvent, getAllEvents } from "../controllers/event.controller.js";

const eventRouter = express.Router();

eventRouter.post("/setup", protect, setupEvent);
eventRouter.post("/register", protect, registerEvent);
eventRouter.get("/",getAllEvents);

export default eventRouter;