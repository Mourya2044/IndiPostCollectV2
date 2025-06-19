import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
  createStamp,
  deleteStamp,
  getAllStamps,
  getStampById,
  updateStamp,
} from "../controllers/stamp.controller.js";

const stampRouter = express.Router();

stampRouter.use(protect);

stampRouter.post("/new", protect, createStamp);
stampRouter.patch("/:id", protect, updateStamp);
stampRouter.delete("/:id", protect, deleteStamp);

stampRouter.get("/", getAllStamps);
stampRouter.get("/:id", getStampById);


export default stampRouter;