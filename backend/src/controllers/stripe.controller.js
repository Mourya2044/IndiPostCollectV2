import Stripe from 'stripe';
import Stamp from '../models/stamp.model.js';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async (req, res) => {
  const user = req.user;
  const cartItems = await Promise.all(
    user.cart.map(async item => {
      const stamp = await Stamp.findById(item.productId);
      return { stamp, quantity: item.quantity };
    })
  );

  // console.log("Cart Items:", cartItems);
  

  // if (!cartItems || cartItems.length === 0) {
  //   return res.status(400).json({ error: "Empty cart not allowed" });
  // }

  try {
    // const session = await stripe.checkout.sessions.create({
    //   payment_method_types: ['card'],
    //   line_items: cartItems.map(item => ({
    //     price_data: {
    //       currency: 'inr',
    //       product_data: { name: item.name },
    //       unit_amount: item.price * 100,
    //     },
    //     quantity: item.quantity,
    //   })),
    //   mode: 'payment',
    //   success_url: 'http://localhost:5173/payment-success',
    //   cancel_url: 'http://localhost:5173/payment-failed',
    // });
    // res.status(200).json({ url: session.url });
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

    res.status(200).send(session);
  } catch (err) {
    console.error("Stripe session error:", err);
    res.status(500).json({ details: err.message });
  }
};


export const sessionStatus = async (req, res) => {
  const session = await stripe.checkout.sessions.retrieve(req.query.session_id);

  res.send({
    status: session.status,
    customer_email: session.customer_details.email
  });
};
