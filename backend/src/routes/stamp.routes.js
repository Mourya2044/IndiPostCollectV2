import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
  createStamp,
  deleteStamp,
  getAllStamps,
  getStampFilterMeta,
  getStampById,
  updateStamp,
} from "../controllers/stamp.controller.js";

const stampRouter = express.Router();

stampRouter.post("/new", protect, createStamp);
stampRouter.patch("/:id", protect, updateStamp);
stampRouter.delete("/:id", protect, deleteStamp);

stampRouter.get("/meta/filters", getStampFilterMeta);
stampRouter.get("/", getAllStamps);
stampRouter.get("/:id", getStampById);


export default stampRouter;