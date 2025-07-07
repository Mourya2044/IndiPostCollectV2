import { Button } from '@/components/ui/button';
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { axiosInstance } from '@/lib/axios.js';
import { useAuthStore } from '@/store/useAuthStore.js'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner';
import { Tag, Minus, Plus } from 'lucide-react';

const CartPage = () => {
  const { user } = useAuthStore();
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  const fetchCart = async () => {
    try {
      const response = await axiosInstance.get('/cart');
      setCartItems(response.data.cart);
      setTotalPrice(response.data.totalPrice);
    } catch (error) {
      console.error("Error fetching cart:", error);
      toast.error("Failed to fetch cart. Please try again later.");
    }
  }

  const handleAddToCart = async (stampId, quantity) => {
    try {
      await axiosInstance.post('/cart/add', { stampId, quantity });
      fetchCart();
      toast.success("Added to cart successfully!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add to cart. Please try again later.");
    }
  }

  const handleRemoveFromCart = async (stampId, quantity = 0) => {
    try {
      await axiosInstance.post('/cart/remove', { stampId, quantity });
      fetchCart();
      toast.success("Removed from cart successfully!");
    } catch (error) {
      console.error("Error removing from cart:", error);
      toast.error("Failed to remove from cart. Please try again later.");
    }
  }

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <div className="container flex flex-col mx-auto p-4">
      <h1 className='text-3xl font-bold mb-6'>Your Cart</h1>

      <div className="flex-1">
        {cartItems.map(item => (
          <Card key={item.stamp._id} className='border p-4 mb-4'>
            <CardContent className="flex">
              {item.stamp.imageUrl ? (
                <img
                  src={item.stamp.imageUrl}
                  alt={item.stamp.title}
                  className="w-24 h-24 object-cover mr-4 rounded-lg"
                  loading="lazy"
                />
              ) : (
                <div className="w-24 h-24 rounded-lg object-cover mr-4 flex items-center justify-center bg-gray-200">
                  <div className="text-center text-gray-500">
                    <Tag className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No Image</p>
                  </div>
                </div>
              )}
              <div className="flex-1">
                <CardTitle>{item.stamp.title}</CardTitle>
                <CardDescription className="text-sm text-gray-600 mb-2">
                  {item.stamp.description}
                </CardDescription>
                <p className="text-lg font-semibold">Price: ₹{item.stamp.price.toFixed(2)}</p>
              </div>
              <div className="flex-1 flex flex-col justify-around">
                <span className="flex text-gray-600">
                  <h3 className="mr-1">Quantity:</h3>
                  <div className="flex items-center">
                    <Button variant="outline" className="cursor-pointer size-3" onClick={() => handleRemoveFromCart(item.stamp._id, 1)}>
                      <Minus className="size-3" />
                    </Button>
                    <span className="mx-2">{item.quantity}</span>
                    <Button variant="outline" className="cursor-pointer size-3" onClick={() => handleAddToCart(item.stamp._id, 1)}>
                      <Plus className="size-3" />
                    </Button>
                  </div>
                </span>
                <p className="text-sm text-gray-600">Total: ₹{(item.stamp.price * item.quantity).toFixed(2)}</p>
              </div>
                <div className="my-auto">
                  <Button variant="destructive" onClick={() => handleRemoveFromCart(item.stamp._id, item.quantity)}>
                    Remove
                  </Button>
                </div>
            </CardContent>
          </Card>
        ))}
      </div>


      <div className="flex-1">
        <h2 className='text-2xl font-bold mb-4'>Cart Summary</h2>
        <p>Total Items: {cartItems.length}</p>
        {/* Add more summary details as needed */}
        <button
          className='bg-blue-500 text-white px-4 py-2 rounded mt-4'
          onClick={() => toast.success("Checkout feature coming soon!")}
        >
          Proceed to Checkout
        </button>
        <p className='text-lg mt-4'>Total Price: ₹{totalPrice.toFixed(2)}</p>
      </div>
    </div>
  );
}

export default CartPage