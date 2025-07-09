import Stripe from 'stripe';
import Stamp from '../models/stamp.model.js';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
import Order from '../models/order.model.js';

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
            images: item.stamp.imagesUrl,
          },
          unit_amount: item.stamp.price * 100,
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      return_url: `${process.env.NODE_ENV === 'development' ? "http://localhost:5173" : "https://indi-post-collect-v2.vercel.app"}/return?session_id={CHECKOUT_SESSION_ID}`,
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

  if (order.status === 'pending' && session.status === 'complete') {
    order.status = session.status;
    await order.save();
  }

  res.send({
    status: session.status,
    customer_email: session.customer_details.email,
    session: session,
  });
};
