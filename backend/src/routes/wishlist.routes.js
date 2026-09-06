import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
    getWishlist,
    toggleWishlist,
    removeFromWishlist
} from "../controllers/wishlist.controller.js";

const wishlistRouter = express.Router();

wishlistRouter.get("/", protect, getWishlist);
wishlistRouter.post("/toggle", protect, toggleWishlist);
wishlistRouter.delete("/:stampId", protect, removeFromWishlist);

export default wishlistRouter;
