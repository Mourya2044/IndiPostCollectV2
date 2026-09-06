import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
    getStampReviews,
    addOrUpdateReview,
    deleteReview
} from "../controllers/review.controller.js";

const reviewRouter = express.Router();

reviewRouter.get("/stamp/:stampId", getStampReviews);
reviewRouter.post("/stamp/:stampId", protect, addOrUpdateReview);
reviewRouter.delete("/:reviewId", protect, deleteReview);

export default reviewRouter;
