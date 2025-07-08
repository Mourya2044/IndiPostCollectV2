/* 
userID: String,
orderID: String,
items: copy of cart items,
totalPrice: Number,
status: String, // e.g., 'pending', 'completed', 'cancelled'
createdAt: Date,
updatedAt: Date
*/

import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  orderId: { type: String, required: true, unique: true },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Stamp", required: true },
      quantity: { type: Number, required: true, min: 1 }
    }
  ],
  totalPrice: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'completed', 'cancelled'], default: 'pending' }
}, { timestamps: true });

const Order = mongoose.model("Order", OrderSchema);
export default Order;
