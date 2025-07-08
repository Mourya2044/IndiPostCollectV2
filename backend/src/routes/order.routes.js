import express from "express";
import {
//   createOrder,
  getOrdersbyID,
//   getOrderById,
//   updateOrderStatus,
//   deleteOrder,
} from "../controllers/order.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const orderRouter = express.Router();

// orderRouter.post("/", createOrder);
orderRouter.get("/user/:userId", protect, getOrdersbyID);
// orderRouter.get("/:id", getOrderById);
// orderRouter.patch("/:id/status", updateOrderStatus);
// orderRouter.delete("/:id", deleteOrder);

export default orderRouter;
