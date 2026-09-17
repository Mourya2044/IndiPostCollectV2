import Stripe from 'stripe';
import Stamp from '../models/stamp.model.js';
import Order from '../models/order.model.js';
import { sendOrderConfirmationEmail } from '../lib/mailer.js';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async (req, res) => {
  try {
    const user = req.user;
    const cartItems = await Promise.all(
      user.cart.map(async item => {
        const stamp = await Stamp.findById(item.productId);
        return { stamp, quantity: item.quantity };
      })
    );

    user.cart = [];
    await user.save();    

    const session = await stripe.checkout.sessions.create({
      ui_mode: 'embedded',
      line_items: cartItems.map(item => ({
        price_data: {
          currency: 'inr',
          product_data: {
            name: item.stamp.title,
            description: item.stamp.description,
            images: item.stamp.imageUrl ? [item.stamp.imageUrl] : [],
          },
          unit_amount: item.stamp.price * 100,
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      return_url: `${process.env.FRONTEND_URL}/return?session_id={CHECKOUT_SESSION_ID}`,
    });

    const newOrder = new Order({
      userId: user._id,
      orderId: session.id,
      items: cartItems.map(item => ({
        productId: item.stamp._id,
        quantity: item.quantity
      })),
      totalPrice: cartItems.reduce((total, item) => total + (item.stamp.price * item.quantity), 0),
      status: 'pending'
    });

    await newOrder.save();

    res.status(200).send({ client_secret: session.client_secret });
  } catch (err) {
    console.error("Stripe session error:", err);
    res.status(500).json({ details: err.message });
  }
};


export const sessionStatus = async (req, res) => {
  const session = await stripe.checkout.sessions.retrieve(req.query.session_id);

  const order = await Order.findOne({ orderId: session.id });
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  if (session.status === 'complete') {
    if (order.status !== 'complete') {
      order.status = 'complete';
    }

    if (!order.confirmationEmailSent) {
      try {
        const populated = await Order.findById(order._id)
          .populate('items.productId', 'title price')
          .populate('userId', 'fullName email');
        const targetEmail = populated?.userId?.email || session.customer_details?.email;
        if (targetEmail) {
          order.confirmationEmailSent = true;
          await order.save();

          await sendOrderConfirmationEmail({
            to: targetEmail,
            fullName: populated?.userId?.fullName || session.customer_details?.name,
            orderId: order._id.toString(),
            totalPrice: order.totalPrice,
            items: populated?.items || []
          });
        }
      } catch (mailErr) {
        console.error('Error sending order confirmation email:', mailErr.message);
      }
    } else {
      await order.save();
    }
  }

  res.send({
    status: session.status,
    customer_email: session.customer_details?.email || null,
    session: session,
  });
};

export const payExistingOrder = async (req, res) => {
  try {
    const { orderId } = req.body;
    const order = await Order.findById(orderId).populate("items.productId");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized access to this order" });
    }

    if (order.status !== 'pending') {
      return res.status(400).json({ message: `Cannot pay for order with status: ${order.status}` });
    }

    // Create a new Stripe session
    const session = await stripe.checkout.sessions.create({
      ui_mode: 'embedded',
      line_items: order.items.map(item => ({
        price_data: {
          currency: 'inr',
          product_data: {
            name: item.productId.title,
            description: item.productId.description,
            images: item.productId.imageUrl ? [item.productId.imageUrl] : [],
          },
          unit_amount: item.productId.price * 100,
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      return_url: `${process.env.FRONTEND_URL}/return?session_id={CHECKOUT_SESSION_ID}`,
    });

    // Update the order with the new Stripe session ID
    order.orderId = session.id;
    await order.save();

    res.status(200).send({ client_secret: session.client_secret });
  } catch (err) {
    console.error("Pay existing order error:", err);
    res.status(500).json({ details: err.message });
  }
};
