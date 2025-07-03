import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
  addToCart,
  clearCart,
  getCart,
  removeFromCart,
} from "../controllers/cart.controller.js";

const cartRouter = express.Router();

cartRouter.post("/add", protect, addToCart);
cartRouter.post("/remove", protect, removeFromCart);
cartRouter.post("/clear", protect, clearCart);
cartRouter.get("/", protect, getCart);

export default cartRouter;