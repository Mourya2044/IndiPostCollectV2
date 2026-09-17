import { axiosInstance } from '@/lib/axios';
import {
    EmbeddedCheckoutProvider,
    EmbeddedCheckout
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useSearchParams, Link } from 'react-router-dom';
import { AlertTriangle, ArrowLeft, ShieldAlert, CreditCard, Info } from 'lucide-react';

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

    if (!stripePromise) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-sm text-muted-foreground uppercase tracking-widest animate-pulse">
                    Loading Stripe Checkout…
                </div>
            </div>
        );
    }
    
    return (
        <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-6">
                
                {/* ── Top Bar ── */}
                <div className="flex items-center justify-between border-b border-border pb-4">
                    <Link
                        to="/cart"
                        className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground hover:text-IPCprimary transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" /> Back to Cart
                    </Link>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-[10px] font-bold tracking-widest uppercase rounded">
                        <ShieldAlert className="h-3 w-3" /> Test Sandbox Gateway
                    </span>
                </div>

                {/* ── Prominent Demonstration Notice Banner ── */}
                <div className="border-2 border-amber-500/40 bg-amber-500/10 rounded-lg p-5 sm:p-6 shadow-sm">
                    <div className="flex items-start gap-4">
                        <div className="p-2.5 bg-amber-500/20 rounded-full text-amber-600 dark:text-amber-400 shrink-0 mt-0.5">
                            <AlertTriangle className="h-6 w-6" />
                        </div>
                        <div className="space-y-2 flex-1">
                            <h2 className="text-base font-bold text-amber-900 dark:text-amber-200 tracking-wide uppercase">
                                Demonstration &amp; Portfolio Project Notice
                            </h2>
                            <p className="text-sm text-amber-800 dark:text-amber-300 leading-relaxed font-medium">
                                <strong>These stamps are NOT for sale and will NOT be physically delivered.</strong> IndiPostCollect is an academic and portfolio project dedicated to celebrating Indian philately. No real-world commercial transactions take place on this platform.
                            </p>
                            <div className="pt-2 border-t border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-amber-700 dark:text-amber-300">
                                <span className="flex items-center gap-1.5">
                                    <CreditCard className="h-3.5 w-3.5 shrink-0" />
                                    <strong>Do NOT enter real card details.</strong> Use Stripe test cards for testing.
                                </span>
                                <span className="inline-block bg-amber-500/20 px-2 py-0.5 rounded font-mono text-[11px]">
                                    Test Card: 4242 •••• •••• 4242
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Stripe Embedded Checkout ── */}
                <div id="checkout" className="border border-border bg-white rounded-lg shadow-sm overflow-hidden p-2 sm:p-4">
                    <EmbeddedCheckoutProvider
                        stripe={stripePromise}
                        options={options}
                    >
                        <EmbeddedCheckout />
                    </EmbeddedCheckoutProvider>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;