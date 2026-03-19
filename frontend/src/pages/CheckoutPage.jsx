import { axiosInstance } from '@/lib/axios';
import {
    EmbeddedCheckoutProvider,
    EmbeddedCheckout
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CheckoutPage = () => {
    const fetchClientSecret = async () => {
        try {
            const response = await axiosInstance.post("/stripe/create-checkout-session");
            console.log("Response from create-checkout-session:", response.data);

            // console.log("Client Secret:", response.data.client_secret);

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