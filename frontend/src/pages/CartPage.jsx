import { axiosInstance } from '@/lib/axios.js';
import { useAuthStore } from '@/store/useAuthStore.js'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner';

const CartPage = () => {
    const { user } = useAuthStore();
    const [cartItems, setCartItems] = useState([]);

    const fetchCart = async () => {
      try {
        const response = await axiosInstance.get('/cart');
        setCartItems(response.data.cart);
      } catch (error) {
        console.error("Error fetching cart:", error);
        toast.error("Failed to fetch cart. Please try again later.");
      }
    }

    useEffect(() => {
      fetchCart();
    }, []);

    // [{"stamp":{"condition":"Mint","availableQuantity":1,"_id":"68540d2d0a803be784691166","title":"B","country":"India","year":1918,"category":["Airmail"],"description":"Famous upside-down airplane stamp","imageUrl":"https://example.com/inverted-jenny.jpg","isForSale":true,"price":2500,"owner":"6853e69aa6eb27954f7de1eb","isMuseumPiece":false,"createdAt":"2025-06-19T13:14:21.820Z","updatedAt":"2025-06-19T13:14:21.820Z","__v":0},"quantity":1}]

  return (
    <div>
        {cartItems.map(item => (
          <div key={item.stamp._id}>
            <h3>{item.stamp.title}</h3>
            <p>Quantity: {item.quantity}</p>
          </div>
        ))}
    </div>
  );
}

export default CartPage