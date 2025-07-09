import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { axiosInstance } from "@/lib/axios.js";
import { useAuthStore } from "@/store/useAuthStore.js";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Tag, Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import StripeCheckout from "react-stripe-checkout";

const CartPage = () => {
  const { user } = useAuthStore();
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  const fetchCart = async () => {
    try {
      const response = await axiosInstance.get("/cart");
      setCartItems(response.data.cart);
      setTotalPrice(response.data.totalPrice);
    } catch (error) {
      console.error("Error fetching cart:", error);
      toast.error("Failed to fetch cart. Please try again later.");
    }
  };

  const handleAddToCart = async (stampId, quantity) => {
    try {
      await axiosInstance.post("/cart/add", { stampId, quantity });
      fetchCart();
      toast.success("Added to cart successfully!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add to cart. Please try again later.");
    }
  };

  const handleRemoveFromCart = async (stampId, quantity = 0) => {
    if (cartItems.length === 0) {
      toast.error("Cart is empty. Add items before checkout.");
      return;
    }

    try {
      await axiosInstance.post("/cart/remove", { stampId, quantity });
      fetchCart();
      toast.success("Removed from cart successfully!");
    } catch (error) {
      console.error("Error removing from cart:", error);
      toast.error("Failed to remove from cart. Please try again later.");
    }
  };

  const handleCheckout = async () => {
    try {
      for(const item of cartItems) {
        if (item.quantity <= 0) {
          toast.error("Invalid item quantity.");
          return;
        }
      }
      const res = await axiosInstance.post("/stripe/create-checkout-session", {
        cartItems: cartItems.map(item => ({
          name: item.stamp.title,
          price: item.stamp.price,
          quantity: item.quantity
        })),
      });

      if (res.data.url) {
        window.location.href = res.data.url; // Redirect to Stripe Checkout
      } else {
        toast.error("Failed to get checkout URL.");
      }
    } catch (err) {
      console.error("Checkout failed:", err);
      toast.error("Checkout failed.");
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="text-center py-12">
          <ShoppingCart className="h-24 w-24 mx-auto mb-4 text-gray-400" />
          <h1 className="text-3xl font-bold mb-2">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-6">Add some stamps to get started!</p>
          <Link to="/marketplace">
            <Button className="px-6 py-3">Browse Stamps</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Shopping Cart</h1>
        <p className="text-gray-600">{cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in your cart</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <Card key={item.stamp._id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex gap-4">
                  {/* Image */}
                  <div className="flex-shrink-0">
                    {item.stamp.imageUrl ? (
                      <img
                        src={item.stamp.imageUrl}
                        alt={item.stamp.title}
                        className="w-32 h-32 object-cover rounded-lg border"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-32 h-32 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
                        <div className="text-center text-gray-400">
                          <Tag className="h-8 w-8 mx-auto mb-2" />
                          <p className="text-xs">No Image</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Item Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-xl font-semibold truncate">{item.stamp.title}</h3>
                        <p className="text-gray-600 text-sm mt-1 line-clamp-2">{item.stamp.description}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveFromCart(item.stamp._id, item.quantity)}
                        className="ml-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <div className="text-lg font-bold">
                        ₹{item.stamp.price.toFixed(2)}
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-600 mr-2">Qty:</span>
                        <div className="flex items-center border rounded-md">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-gray-100"
                            onClick={() => handleRemoveFromCart(item.stamp._id, 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="px-3 py-1 text-sm font-medium min-w-[40px] text-center">
                            {item.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-gray-100"
                            onClick={() => handleAddToCart(item.stamp._id, 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>

                      <div className="text-lg font-bold">
                        ₹{(item.stamp.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="text-xl">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <span>Items ({cartItems.length})</span>
                <span>₹{totalPrice.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span>Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
              
              <div className="border-t pt-4">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>₹{totalPrice.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="space-y-3 mt-6">
                <Link to="/checkout" className="block">
                  <Button className="w-full py-3 text-base font-medium">
                    Proceed to Checkout
                  </Button>
                </Link>
                
                <Link to="/marketplace" className="block">
                  <Button variant="outline" className="w-full py-3 text-base">
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CartPage;