import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { axiosInstance } from "@/lib/axios";
import { ArrowLeft, Clock, MapPin, Package, AlertCircle, ArrowRight, XCircle, Printer, FileText, Truck, Copy, Mail, Loader } from "lucide-react";
import OrderInvoiceModal from "@/components/orders/OrderInvoiceModal";
import { toast } from "sonner";

const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  const handleSendEmail = async () => {
    setIsSendingEmail(true);
    try {
      const res = await axiosInstance.post(`/orders/${id}/resend-email`, {
        type: order.fulfillmentStatus === 'dispatched' ? 'dispatch' : 'confirmation'
      });
      toast.success(res.data.message || "Email notification sent to your inbox!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send email notification");
    } finally {
      setIsSendingEmail(false);
    }
  };

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axiosInstance.get(`/orders/${id}`);
        setOrder(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load order details");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  const handleCancelOrder = async () => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    
    setIsUpdating(true);
    try {
      const response = await axiosInstance.patch(`/orders/${id}/status`, { status: "cancelled" });
      setOrder(response.data);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to cancel order");
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-IPCprimary"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center bg-background p-6 text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h2 className="text-xl font-semibold mb-2">Order Not Found</h2>
        <p className="text-sm text-muted-foreground mb-6">{error}</p>
        <Link to="/profile" className="text-xs uppercase tracking-widest font-semibold text-IPCprimary hover:underline">
          Return to Profile
        </Link>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'complete': return 'text-green-600 bg-green-50 border-green-200';
      case 'pending': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'cancelled': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/profile')} className="p-2 border border-border hover:bg-muted transition-colors">
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div>
              <h1 className="text-2xl font-light text-foreground">Order Details</h1>
              <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold mt-1">ID: {order._id}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={handleSendEmail}
              disabled={isSendingEmail}
              className="inline-flex items-center gap-2 px-3.5 py-2 border border-border text-foreground text-xs font-semibold uppercase tracking-widest hover:border-IPCprimary hover:text-IPCprimary transition-all cursor-pointer disabled:opacity-50"
            >
              {isSendingEmail ? <Loader className="h-3.5 w-3.5 animate-spin" /> : <Mail className="h-3.5 w-3.5" />}
              {isSendingEmail ? "Sending…" : "Email Me Confirmation"}
            </button>
            <button
              type="button"
              onClick={() => setShowInvoice(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-IPCprimary text-white text-xs font-semibold uppercase tracking-widest hover:opacity-90 transition-opacity cursor-pointer"
            >
              <FileText className="h-3.5 w-3.5" />
              Download PDF Invoice
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* ── Items List ── */}
          <div className="lg:col-span-2 space-y-6">
            <div className="border border-border bg-background">
              <div className="px-6 py-4 border-b border-border">
                <h2 className="text-sm font-semibold uppercase tracking-widest text-foreground flex items-center gap-2">
                  <Package className="h-4 w-4 text-IPCprimary" /> Items Ordered
                </h2>
              </div>
              <div className="divide-y divide-border">
                {order.items.map((item, idx) => (
                  <div key={idx} className="p-6 flex gap-6 hover:bg-muted/20 transition-colors">
                    <div className="w-24 h-24 shrink-0 border border-border bg-muted overflow-hidden">
                      <img 
                        src={item.productId?.imageUrl || item.productId?.imagesUrl?.[0] || 'https://via.placeholder.com/150'} 
                        alt={item.productId?.title} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <div className="flex-1 flex justify-between gap-4">
                      <div>
                        <h3 className="text-base font-semibold text-foreground">{item.productId?.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{item.productId?.description}</p>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mt-4">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-base font-semibold text-foreground whitespace-nowrap">₹{(item.productId?.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

              {/* ── Summary & Actions ── */}
          <div className="lg:col-span-1 space-y-6">
            <div className="border border-border bg-background p-6">
              <h2 className="text-sm font-bold uppercase tracking-widest text-foreground mb-6">Order Summary</h2>
              
              <div className="space-y-4 text-sm mb-6 pb-6 border-b border-border">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Payment Status</span>
                  <span className={`px-2 py-1 text-[10px] uppercase tracking-widest font-bold border ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Date</span>
                  <span className="font-medium text-foreground">{new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              
              <div className="flex justify-between font-semibold text-foreground text-lg mb-6">
                <span>Total</span>
                <span>₹{order.totalPrice?.toFixed(2)}</span>
              </div>
              
              {order.status === 'pending' ? (
                <div className="space-y-3">
                  <Link
                    to={`/checkout?orderId=${order._id}`}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-IPCprimary text-white text-xs font-semibold uppercase tracking-widest hover:opacity-90 transition-opacity"
                  >
                    Pay Now <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                  <button
                    onClick={handleCancelOrder}
                    disabled={isUpdating}
                    className="w-full flex items-center justify-center gap-2 py-3 border border-red-200 text-red-600 bg-red-50 text-xs font-semibold uppercase tracking-widest hover:bg-red-100 transition-colors disabled:opacity-50"
                  >
                    <XCircle className="h-3.5 w-3.5" /> Cancel Order
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowInvoice(true)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 border border-border text-xs font-semibold uppercase tracking-widest text-muted-foreground hover:border-foreground hover:text-foreground transition-all cursor-pointer"
                  >
                    <FileText className="h-3.5 w-3.5" /> View Pro-Forma Invoice
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={() => setShowInvoice(true)}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-IPCprimary text-white text-xs font-semibold uppercase tracking-widest hover:opacity-90 transition-opacity cursor-pointer"
                  >
                    <FileText className="h-3.5 w-3.5" /> Official Invoice & PDF
                  </button>
                </div>
              )}
            </div>

            {/* ── Consignment & Dispatch Tracking ── */}
            <div className="border border-border bg-background p-6">
              <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-border">
                <h3 className="text-xs font-bold uppercase tracking-widest text-foreground flex items-center gap-2">
                  <Truck className="h-4 w-4 text-IPCprimary" /> Consignment Tracking
                </h3>
                <span className={`text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 border ${
                  order.fulfillmentStatus === 'delivered'
                    ? 'text-emerald-600 bg-emerald-500/10 border-emerald-500/30'
                    : order.fulfillmentStatus === 'dispatched'
                    ? 'text-sky-600 bg-sky-500/10 border-sky-500/30'
                    : order.fulfillmentStatus === 'processing'
                    ? 'text-amber-600 bg-amber-500/10 border-amber-500/30'
                    : 'text-muted-foreground bg-muted border-border'
                }`}>
                  {order.fulfillmentStatus || 'unfulfilled'}
                </span>
              </div>

              {/* Progress Milestones */}
              <div className="space-y-2 py-2">
                <div className="grid grid-cols-4 gap-1 text-center text-[9px] uppercase tracking-widest font-mono font-semibold">
                  <span className="text-foreground">Confirmed</span>
                  <span className={['processing', 'dispatched', 'delivered'].includes(order.fulfillmentStatus) ? 'text-foreground' : 'text-muted-foreground/40'}>Packing</span>
                  <span className={['dispatched', 'delivered'].includes(order.fulfillmentStatus) ? 'text-foreground' : 'text-muted-foreground/40'}>Dispatched</span>
                  <span className={order.fulfillmentStatus === 'delivered' ? 'text-emerald-600' : 'text-muted-foreground/40'}>Delivered</span>
                </div>
                <div className="grid grid-cols-4 gap-1 h-1.5 bg-muted">
                  <div className="bg-IPCprimary h-full"></div>
                  <div className={`h-full ${['processing', 'dispatched', 'delivered'].includes(order.fulfillmentStatus) ? 'bg-IPCprimary' : 'bg-transparent'}`}></div>
                  <div className={`h-full ${['dispatched', 'delivered'].includes(order.fulfillmentStatus) ? 'bg-IPCprimary' : 'bg-transparent'}`}></div>
                  <div className={`h-full ${order.fulfillmentStatus === 'delivered' ? 'bg-emerald-500' : 'bg-transparent'}`}></div>
                </div>
              </div>

              {/* Tracking & Carrier Info */}
              <div className="mt-4 pt-4 border-t border-border space-y-3 text-xs">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono block">Carrier / Courier</span>
                  <span className="font-medium text-foreground">{order.carrier || "India Post (Speed Post Philatelic Bureau)"}</span>
                </div>

                {order.trackingNumber ? (
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono block">Consignment Number</span>
                    <div className="flex items-center justify-between gap-2 mt-1 p-2 bg-muted/40 border border-border">
                      <span className="font-mono font-bold text-foreground text-xs">{order.trackingNumber}</span>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(order.trackingNumber);
                          toast.success("Consignment tracking number copied!");
                        }}
                        className="p-1 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                        title="Copy tracking number"
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-[11px] text-muted-foreground italic">
                    Consignment tracking number will be updated once dispatched from the philatelic bureau.
                  </p>
                )}

                {order.dispatchDate && (
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono block">Dispatched On</span>
                    <span className="font-medium text-foreground">{new Date(order.dispatchDate).toLocaleDateString(undefined, { dateStyle: 'medium' })}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Invoice / Dispatch Slip Modal */}
      <OrderInvoiceModal
        order={order}
        isOpen={showInvoice}
        onClose={() => setShowInvoice(false)}
      />
    </div>
  );
};

export default OrderDetailPage;
