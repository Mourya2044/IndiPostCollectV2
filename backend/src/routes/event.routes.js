import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { setupEvent, registerEvent, getAllEvents, deleteEvent } from "../controllers/event.controller.js";

const eventRouter = express.Router();

eventRouter.post("/setup", protect, setupEvent);
eventRouter.post("/register", protect, registerEvent);
eventRouter.delete("/:eventId", protect, deleteEvent);

eventRouter.get("/",getAllEvents);

export default eventRouter;