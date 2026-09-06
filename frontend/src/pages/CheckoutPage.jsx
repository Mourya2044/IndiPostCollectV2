import { axiosInstance } from '@/lib/axios';
import {
    EmbeddedCheckoutProvider,
    EmbeddedCheckout
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

import { useSearchParams } from 'react-router-dom';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CheckoutPage = () => {
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get('orderId');

    const fetchClientSecret = async () => {
        try {
            let response;
            if (orderId) {
                // Paying for an existing unpaid order
                response = await axiosInstance.post("/stripe/pay-existing-order", { orderId });
            } else {
                // Normal checkout flow (clears cart)
                response = await axiosInstance.post("/stripe/create-checkout-session");
            }
            return response.data.client_secret;
        } catch (error) {
            console.error("Error fetching client secret:", error);
            throw new Error("Failed to fetch client secret");
        }
    };

    const options = { fetchClientSecret };

    if (!stripePromise) return <div>Loading Stripe...</div>;
    
    return (
        <div id="checkout" className='bg-white'>
            <EmbeddedCheckoutProvider
                stripe={stripePromise}
                options={options}
            >
                <EmbeddedCheckout />
            </EmbeddedCheckoutProvider>
        </div>
    )
}

export default CheckoutPage;