import Order from "../models/order.model.js";

export const getOrdersbyID = async (req, res) => {
  try {
    const userId = req.params.userId;
    const orders = await Order.find({ userId })
      .sort({ createdAt: -1 })
      .populate("items.productId", "title description imageUrl price")

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error in getOrders controller:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}