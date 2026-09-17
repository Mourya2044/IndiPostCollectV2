import React, { useEffect, useState } from "react";
import { axiosInstance } from "@/lib/axios.js";
import { toast } from "sonner";
import { Tag, Minus, Plus, ShoppingCart, Trash2, ArrowRight, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCart = async () => {
    try {
      const response = await axiosInstance.get("/cart");
      setCartItems(response.data.cart);
      setTotalPrice(response.data.totalPrice);
    } catch (error) {
      console.error("Error fetching cart:", error);
      toast.error("Failed to fetch cart. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = async (stampId, quantity) => {
    try {
      await axiosInstance.post("/cart/add", { stampId, quantity });
      fetchCart();
      toast.success("Cart updated");
    } catch (error) {
      toast.error("Failed to update cart.");
    }
  };

  const handleRemoveFromCart = async (stampId, quantity = 0) => {
    if (cartItems.length === 0) return;
    try {
      await axiosInstance.post("/cart/remove", { stampId, quantity });
      fetchCart();
      toast.success("Item removed");
    } catch (error) {
      toast.error("Failed to remove item.");
    }
  };



  useEffect(() => {
    fetchCart();
  }, []);

  if (isLoading) return <div className="min-h-screen bg-background" />;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full flex flex-col items-center text-center p-8 border border-border bg-muted/10">
          <ShoppingCart className="h-12 w-12 text-muted-foreground/50 mb-4" />
          <h1 className="text-2xl font-light text-foreground mb-2">Your Cart is Empty</h1>
          <p className="text-sm text-muted-foreground mb-6">Discover rare stamps and add them to your collection.</p>
          <Link
            to="/marketplace"
            className="inline-flex items-center gap-2 px-6 py-3 bg-IPCprimary text-white text-xs font-semibold uppercase tracking-widest hover:opacity-90 transition-opacity"
          >
            Browse Stamps <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-light text-foreground mb-2">Shopping Cart</h1>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {cartItems.length} Item{cartItems.length !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* ── Cart Items ── */}
          <div className="w-full lg:flex-1 border border-border bg-background divide-y divide-border">
            {cartItems.map((item, i) => (
              <div
                key={item.stamp._id}
                className="flex gap-4 p-4 animate-in slide-in-from-bottom-2 fade-in duration-500"
                style={{ animationDelay: `${i * 50}ms`, animationFillMode: 'both' }}
              >
                {/* Image */}
                <div className="w-24 h-24 shrink-0 bg-muted/20 border border-border flex items-center justify-center overflow-hidden">
                  {item.stamp.imageUrl ? (
                    <img src={item.stamp.imageUrl} alt={item.stamp.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <Tag className="h-6 w-6 text-muted-foreground/30" />
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between py-1 min-w-0">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h3 className="text-sm font-semibold text-foreground truncate">{item.stamp.title}</h3>
                      <p className="text-xs text-muted-foreground line-clamp-1 mt-1">{item.stamp.description}</p>
                    </div>
                    <p className="text-sm font-semibold text-foreground whitespace-nowrap">₹{item.stamp.price.toFixed(2)}</p>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    {/* Qty controls */}
                    <div className="flex items-center border border-border">
                      <button
                        onClick={() => handleRemoveFromCart(item.stamp._id, 1)}
                        disabled={item.quantity <= 1}
                        className="px-2 py-1 text-muted-foreground hover:bg-muted transition-colors disabled:opacity-30"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="px-3 py-1 text-xs font-medium border-x border-border min-w-[32px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleAddToCart(item.stamp._id, 1)}
                        className="px-2 py-1 text-muted-foreground hover:bg-muted transition-colors"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    
                    <button
                      onClick={() => handleRemoveFromCart(item.stamp._id, item.quantity)}
                      className="text-muted-foreground hover:text-IPCsecondary transition-colors text-xs flex items-center gap-1 uppercase tracking-widest font-semibold"
                    >
                      <Trash2 className="h-3 w-3" /> Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ── Order Summary ── */}
          <div className="w-full lg:w-80 border border-border bg-background p-6 sticky top-24">
            <h2 className="text-sm font-bold uppercase tracking-widest text-foreground mb-6">Order Summary</h2>
            
            <div className="space-y-4 text-sm mb-6">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>₹{totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span>
                <span className="text-IPCprimary font-semibold uppercase tracking-widest text-[10px] self-center">Free</span>
              </div>
              <div className="pt-4 border-t border-border flex justify-between font-semibold text-foreground text-base">
                <span>Total</span>
                <span>₹{totalPrice.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <Link
                to="/checkout"
                className="w-full flex items-center justify-center gap-2 py-3 bg-IPCprimary text-white text-xs font-semibold uppercase tracking-widest hover:opacity-90 transition-opacity"
              >
                Checkout <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                to="/marketplace"
                className="flex items-center justify-center py-3 border border-border text-foreground text-xs font-semibold uppercase tracking-widest hover:border-IPCprimary hover:text-IPCprimary transition-all"
              >
                Continue Shopping
              </Link>
            </div>

            {/* ── Demo Notice ── */}
            <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-200 text-xs rounded-sm space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-amber-950 dark:text-amber-300">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400 shrink-0" /> Project Demonstration
              </div>
              <p className="text-[11px] leading-relaxed text-amber-800 dark:text-amber-300/90 font-normal">
                Stamps listed are archival items for demonstration and <strong>not for real sale or delivery</strong>. Checkout uses mock sandbox payments.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;