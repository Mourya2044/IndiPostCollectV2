import Order from "../models/order.model.js";
import User from "../models/user.model.js";
import {
  sendDispatchNotificationEmail,
  sendOrderConfirmationEmail,
  sendOrderProcessingEmail,
  sendOrderDeliveredEmail,
  sendOrderCancelledEmail
} from "../lib/mailer.js";

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
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("items.productId", "title description imageUrl price year country category condition");
    
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized access to this order" });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error("Error in getOrderById controller:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id)
      .populate("userId", "fullName email")
      .populate("items.productId", "title price");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const orderUserString = order.userId?._id ? order.userId._id.toString() : order.userId?.toString();
    if (orderUserString !== req.user._id.toString() && req.user.type !== 'admin') {
      return res.status(403).json({ message: "Unauthorized access to this order" });
    }

    const prevStatus = order.status;
    order.status = status;
    await order.save();

    // Trigger transactional email if status changed
    const targetEmail = order.userId?.email || req.user.email;
    const fullName = order.userId?.fullName || req.user.fullName;

    if (targetEmail && prevStatus !== status) {
      if (status === 'cancelled') {
        sendOrderCancelledEmail({
          to: targetEmail,
          fullName,
          orderId: order._id.toString(),
          totalPrice: order.totalPrice
        }).catch(e => console.error("Async cancel email notification error:", e.message));
      } else if (status === 'complete' && !order.confirmationEmailSent) {
        order.confirmationEmailSent = true;
        await order.save();
        sendOrderConfirmationEmail({
          to: targetEmail,
          fullName,
          orderId: order._id.toString(),
          totalPrice: order.totalPrice,
          items: order.items || []
        }).catch(e => console.error("Async confirmation email error:", e.message));
      }
    }

    res.status(200).json(order);
  } catch (error) {
    console.error("Error in updateOrderStatus controller:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllOrdersAdmin = async (req, res) => {
  try {
    if (req.user.type !== 'admin') {
      return res.status(403).json({ message: "Admin access required" });
    }

    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate("userId", "fullName email address")
      .populate("items.productId", "title imageUrl price condition year");

    let revenue = 0;
    let pendingCount = 0;
    let completedCount = 0;

    orders.forEach(o => {
      if (o.status === 'complete') {
        revenue += o.totalPrice || 0;
        completedCount++;
      } else if (o.status === 'pending') {
        pendingCount++;
      }
    });

    res.status(200).json({
      orders,
      stats: {
        totalOrders: orders.length,
        revenue,
        completedCount,
        pendingCount
      }
    });
  } catch (error) {
    console.error("Error in getAllOrdersAdmin:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateFulfillment = async (req, res) => {
  try {
    if (req.user.type !== 'admin') {
      return res.status(403).json({ message: "Admin access required" });
    }

    const { fulfillmentStatus, trackingNumber, carrier, status } = req.body;
    const order = await Order.findById(req.params.id)
      .populate("userId", "fullName email address")
      .populate("items.productId", "title imageUrl price condition year");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const prevFulfillmentStatus = order.fulfillmentStatus;
    const prevStatus = order.status;

    if (fulfillmentStatus) {
      order.fulfillmentStatus = fulfillmentStatus;
      if (fulfillmentStatus === 'dispatched' && !order.dispatchDate) {
        order.dispatchDate = new Date();
      }
    }

    if (status && ['pending', 'complete', 'cancelled'].includes(status)) {
      order.status = status;
    }

    if (trackingNumber !== undefined) order.trackingNumber = trackingNumber.trim();
    if (carrier !== undefined) order.carrier = carrier.trim();

    await order.save();

    const targetEmail = order.userId?.email;
    const fullName = order.userId?.fullName;

    // Send email when fulfillmentStatus or order.status changes
    if (targetEmail) {
      if (fulfillmentStatus && fulfillmentStatus !== prevFulfillmentStatus) {
        if (fulfillmentStatus === 'processing') {
          sendOrderProcessingEmail({
            to: targetEmail,
            fullName,
            orderId: order._id.toString(),
            totalPrice: order.totalPrice,
            items: order.items || []
          }).catch(e => console.error("Async processing notification error:", e.message));
        } else if (fulfillmentStatus === 'dispatched') {
          sendDispatchNotificationEmail({
            to: targetEmail,
            fullName,
            orderId: order._id.toString(),
            carrier: order.carrier,
            trackingNumber: order.trackingNumber
          }).catch(e => console.error("Async dispatch notification error:", e.message));
        } else if (fulfillmentStatus === 'delivered') {
          sendOrderDeliveredEmail({
            to: targetEmail,
            fullName,
            orderId: order._id.toString(),
            carrier: order.carrier,
            trackingNumber: order.trackingNumber
          }).catch(e => console.error("Async delivery notification error:", e.message));
        }
      }

      if (status && status !== prevStatus) {
        if (status === 'cancelled') {
          sendOrderCancelledEmail({
            to: targetEmail,
            fullName,
            orderId: order._id.toString(),
            totalPrice: order.totalPrice
          }).catch(e => console.error("Async cancel notification error:", e.message));
        } else if (status === 'complete' && !order.confirmationEmailSent) {
          order.confirmationEmailSent = true;
          await order.save();
          sendOrderConfirmationEmail({
            to: targetEmail,
            fullName,
            orderId: order._id.toString(),
            totalPrice: order.totalPrice,
            items: order.items || []
          }).catch(e => console.error("Async confirmation notification error:", e.message));
        }
      }
    }

    res.status(200).json({
      message: "Order fulfillment updated successfully",
      order
    });
  } catch (error) {
    console.error("Error in updateFulfillment:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getOrderAnalyticsAdmin = async (req, res) => {
  try {
    if (req.user.type !== 'admin') {
      return res.status(403).json({ message: "Admin access required" });
    }

    const orders = await Order.find()
      .populate("items.productId", "title category price")
      .populate("userId", "fullName email createdAt");

    const totalUsers = await User.countDocuments();

    // 1. Monthly revenue and sales volume (last 6 months)
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const now = new Date();
    const monthlyMap = {};

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
      monthlyMap[key] = { month: key, revenue: 0, orders: 0, units: 0 };
    }

    let totalRevenue = 0;
    let completedOrders = 0;
    let totalUnitsSold = 0;
    const categoryStats = {};
    const fulfillmentCounts = {
      unfulfilled: 0,
      processing: 0,
      dispatched: 0,
      delivered: 0
    };
    const activeUserSet = new Set();

    orders.forEach((order) => {
      const d = new Date(order.createdAt);
      const key = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;

      const isComplete = order.status === 'complete';
      if (isComplete) {
        totalRevenue += order.totalPrice || 0;
        completedOrders++;
        if (order.userId?._id) activeUserSet.add(order.userId._id.toString());
      }

      // Fulfillment distribution
      const fStatus = order.fulfillmentStatus || 'unfulfilled';
      if (fulfillmentCounts[fStatus] !== undefined) {
        fulfillmentCounts[fStatus]++;
      } else {
        fulfillmentCounts.unfulfilled++;
      }

      // Items calculation
      (order.items || []).forEach((item) => {
        const qty = item.quantity || 1;
        if (isComplete) totalUnitsSold += qty;

        const cats = Array.isArray(item.productId?.category)
          ? item.productId.category
          : [item.productId?.category || 'General'];

        cats.forEach((c) => {
          if (!categoryStats[c]) categoryStats[c] = { category: c, count: 0, revenue: 0 };
          categoryStats[c].count += qty;
          if (isComplete) categoryStats[c].revenue += (item.productId?.price || 0) * qty;
        });
      });

      if (monthlyMap[key]) {
        monthlyMap[key].orders++;
        if (isComplete) {
          monthlyMap[key].revenue += order.totalPrice || 0;
          (order.items || []).forEach(it => {
            monthlyMap[key].units += it.quantity || 1;
          });
        }
      }
    });

    const monthlyTrends = Object.values(monthlyMap);
    const topCategories = Object.values(categoryStats)
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);

    const fulfillmentDistribution = [
      { name: 'Delivered', value: fulfillmentCounts.delivered },
      { name: 'Dispatched', value: fulfillmentCounts.dispatched },
      { name: 'Processing', value: fulfillmentCounts.processing },
      { name: 'Unfulfilled', value: fulfillmentCounts.unfulfilled }
    ];

    const aov = completedOrders > 0 ? (totalRevenue / completedOrders) : 0;
    const completionRate = orders.length > 0 ? Math.round((completedOrders / orders.length) * 100) : 0;

    res.status(200).json({
      summary: {
        totalOrders: orders.length,
        completedOrders,
        totalRevenue,
        averageOrderValue: Math.round(aov),
        totalUnitsSold,
        completionRate,
        activeCollectors: activeUserSet.size,
        totalCollectors: totalUsers
      },
      monthlyTrends,
      topCategories,
      fulfillmentDistribution
    });
  } catch (error) {
    console.error("Error in getOrderAnalyticsAdmin:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const resendOrderEmail = async (req, res) => {
  try {
    const { id } = req.params;
    const { type = 'confirmation' } = req.body;

    const order = await Order.findById(id)
      .populate("userId", "fullName email")
      .populate("items.productId", "title price");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const orderUserString = order.userId?._id ? order.userId._id.toString() : order.userId?.toString();
    if (req.user.type !== 'admin' && orderUserString !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized access to this order" });
    }

    const targetEmail = order.userId?.email || req.user.email;
    if (!targetEmail) {
      return res.status(400).json({ message: "No recipient email address associated with this order" });
    }

    const fullName = order.userId?.fullName || req.user.fullName;
    let result;

    if (type === 'dispatch' || type === 'dispatched') {
      result = await sendDispatchNotificationEmail({
        to: targetEmail,
        fullName,
        orderId: order._id.toString(),
        carrier: order.carrier,
        trackingNumber: order.trackingNumber
      });
    } else if (type === 'processing') {
      result = await sendOrderProcessingEmail({
        to: targetEmail,
        fullName,
        orderId: order._id.toString(),
        totalPrice: order.totalPrice,
        items: order.items || []
      });
    } else if (type === 'delivered') {
      result = await sendOrderDeliveredEmail({
        to: targetEmail,
        fullName,
        orderId: order._id.toString(),
        carrier: order.carrier,
        trackingNumber: order.trackingNumber
      });
    } else if (type === 'cancelled') {
      result = await sendOrderCancelledEmail({
        to: targetEmail,
        fullName,
        orderId: order._id.toString(),
        totalPrice: order.totalPrice
      });
    } else {
      result = await sendOrderConfirmationEmail({
        to: targetEmail,
        fullName,
        orderId: order._id.toString(),
        totalPrice: order.totalPrice,
        items: order.items || []
      });
    }

    if (result?.success) {
      return res.status(200).json({
        message: `Transactional email (${type}) sent successfully to ${targetEmail}`,
        recipient: targetEmail
      });
    } else {
      return res.status(500).json({
        message: `Failed to deliver email: ${result?.error || 'Unknown error'}`
      });
    }
  } catch (error) {
    console.error("Error in resendOrderEmail:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};