import { Package, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { axiosInstance } from "@/lib/axios";
import { Link } from "react-router-dom";

const ProfileOrders = ({ userId }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserOrders = async () => {
      if (!userId) return;
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/orders/user/${userId}`);
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching user orders:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserOrders();
  }, [userId]);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered': return 'bg-IPCprimary/10 text-IPCprimary border-IPCprimary/20';
      case 'shipped': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'pending': return 'bg-muted text-muted-foreground border-border';
      case 'cancelled': return 'bg-IPCsecondary/10 text-IPCsecondary border-IPCsecondary/20';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getOrderSummary = (items) => {
    if (items.length === 1) return `${items[0].productId.title} (x${items[0].quantity})`;
    return `${items.length} items`;
  };

  if (loading) {
    return (
      <div className="border border-border bg-background p-8 flex flex-col items-center justify-center gap-3">
        <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-IPCprimary"></div>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Loading Orders…</p>
      </div>
    );
  }

  return (
    <div className="border border-border bg-background flex flex-col max-h-[400px]">
      <div className="px-6 py-4 border-b border-border flex items-center gap-2 shrink-0">
        <Package className="h-4 w-4 text-IPCprimary" />
        <h2 className="text-sm font-semibold uppercase tracking-widest text-foreground">Recent Orders</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {orders.length === 0 ? (
          <div className="p-12 text-center text-sm text-muted-foreground">
            <Package className="h-8 w-8 text-muted-foreground/30 mx-auto mb-3" />
            No orders found.
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-border">
            {orders.map((order) => (
              <Link key={order._id} to={`/order/${order._id}`} className="group p-5 hover:bg-muted/30 transition-colors block">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-sm font-semibold text-foreground group-hover:text-IPCprimary transition-colors">{getOrderSummary(order.items)}</h3>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1">Order #{order.orderId.slice(-8)}</p>
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 border ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
                
                <div className="mt-3">
                  {order.items.map((item, itemIndex) => (
                    <div key={item._id} className="text-xs text-muted-foreground line-clamp-1">
                      {item?.productId.title} × {item?.quantity}
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center text-xs mt-4 pt-3 border-t border-border/50">
                  <span className="text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</span>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-foreground">₹{order.totalPrice.toFixed(2)}</span>
                    <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-IPCprimary transition-colors translate-x-0 group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileOrders;