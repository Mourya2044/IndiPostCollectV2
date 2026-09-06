import express from "express";
import {
  getOrdersbyID,
  getOrderById,
  updateOrderStatus,
  getAllOrdersAdmin,
  updateFulfillment,
  getOrderAnalyticsAdmin,
  resendOrderEmail,
} from "../controllers/order.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const orderRouter = express.Router();

orderRouter.get("/admin/all", protect, getAllOrdersAdmin);
orderRouter.get("/admin/analytics", protect, getOrderAnalyticsAdmin);
orderRouter.patch("/admin/:id/fulfillment", protect, updateFulfillment);
orderRouter.post("/:id/resend-email", protect, resendOrderEmail);
orderRouter.get("/user/:userId", protect, getOrdersbyID);
orderRouter.get("/:id", protect, getOrderById);
orderRouter.patch("/:id/status", protect, updateOrderStatus);

export default orderRouter;
