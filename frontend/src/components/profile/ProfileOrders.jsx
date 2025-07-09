import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Package } from "lucide-react";
import { useState, useEffect } from "react";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { axiosInstance } from "@/lib/axios";
import { Link } from "react-router-dom";
import { ScrollArea } from "../ui/scroll-area";

const ProfileOrders = ({ userId }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUserOrders = async (userId) => {
    if (!userId) {
      return [];
    }
    try {
      const response = await axiosInstance.get(`/orders/user/${userId}`);

      return response.data;
    } catch (error) {
      console.error('Error fetching user orders:', error);
      return [];
    }
  };

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        const ordersData = await fetchUserOrders(userId);
        setOrders(ordersData);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [userId]);

  const getStatusVariant = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'default';
      case 'shipped':
        return 'secondary';
      case 'pending':
        return 'outline';
      case 'cancelled':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getOrderSummary = (items) => {
    if (items.length === 1) {
      return `${items[0].productId.title} (x${items[0].quantity})`;
    }
    return `${items.length} items`;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Package className="w-5 h-5 mr-2" />
            Recent Orders
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading orders...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Package className="w-5 h-5 mr-2" />
          Recent Orders
        </CardTitle>
      </CardHeader>
      <CardContent>
        {orders.length === 0 ? (
          <div className="text-center py-8">
            <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No orders found</p>
          </div>
        ) : (
          <ScrollArea className="max-h-80 space-y-4 overflow-y-auto">
            {orders.map((order, index) => (
              <Link key={order._id} to={`/return?session_id=${order.orderId}`} >
                <div className="cursor-pointer p-2 hover:bg-muted rounded-sm">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-medium">{getOrderSummary(order.items)}</h3>
                      <p className="text-sm text-muted-foreground">Order #{order.orderId.slice(-8)}</p>
                      <div className="mt-1">
                        {order.items.map((item, itemIndex) => (
                          <div key={item._id} className="text-xs text-muted-foreground">
                            {item?.productId.title} × {item?.quantity}
                            {itemIndex < order.items?.length - 1 && ", "}
                          </div>
                        ))}
                      </div>
                    </div>
                    <Badge variant={getStatusVariant(order.status)}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center text-sm text-muted-foreground mt-2">
                    <span>{formatDate(order.createdAt)}</span>
                    <span className="font-medium text-foreground">₹{order.totalPrice}</span>
                  </div>
                  {index < orders.length - 1 && <Separator className="mt-4" />}
                </div>
              </Link>
            ))}
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfileOrders;