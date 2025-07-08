import dotenv from 'dotenv';
dotenv.config();
import Stripe from "stripe"
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async (req, res) => {
  const { cartItems } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: cartItems.map(item => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
          },
          unit_amount: item.price * 100, 
        },
        quantity: item.quantity,
      })),
      success_url: `http://localhost:5173/payment-success`,
      cancel_url: `http://localhost:5173/payment-failed`,
    });

    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error('Stripe Error:', error);
    res.status(500).json({ error: error.message });
  }
};
