import React, { useState, useEffect } from 'react';
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  Search,
  Save,
  Loader,
  Copy,
  ExternalLink,
  ChevronDown,
  Filter,
  Check,
  AlertCircle,
  Mail
} from 'lucide-react';
import { axiosInstance } from '@/lib/axios';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

const FULFILLMENT_OPTIONS = [
  { value: 'unfulfilled', label: 'Unfulfilled' },
  { value: 'processing', label: 'Processing' },
  { value: 'dispatched', label: 'Dispatched (In Transit)' },
  { value: 'delivered', label: 'Delivered' },
];

const CARRIERS = [
  "India Post Speed Post",
  "India Post Registered Post",
  "Blue Dart",
  "DTDC Express",
  "DHL International"
];

const OrdersManagement = ({ setStats }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const [sendingEmailKey, setSendingEmailKey] = useState(null);

  // Form state for inline edits per order
  const [draftFulfillments, setDraftFulfillments] = useState({});

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/orders/admin/all');
      const fetchedOrders = res.data.orders || [];
      setOrders(fetchedOrders);

      // Initialize draft fulfillment and status state for all orders
      const drafts = {};
      fetchedOrders.forEach((o) => {
        drafts[o._id] = {
          fulfillmentStatus: o.fulfillmentStatus || 'unfulfilled',
          status: o.status || 'pending',
          trackingNumber: o.trackingNumber || '',
          carrier: o.carrier || 'India Post Speed Post'
        };
      });
      setDraftFulfillments(drafts);

      // Update parent AdminPage stats if provided
      if (setStats && res.data.stats) {
        setStats((prev) => ({
          ...prev,
          totalOrders: res.data.stats.totalOrders,
          revenue: res.data.stats.revenue
        }));
      }
    } catch (err) {
      console.error('Error fetching admin orders:', err);
      toast.error(err.response?.data?.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleFieldChange = (orderId, field, value) => {
    setDraftFulfillments((prev) => ({
      ...prev,
      [orderId]: {
        ...prev[orderId],
        [field]: value
      }
    }));
  };

  const handleSaveFulfillment = async (orderId) => {
    const draft = draftFulfillments[orderId];
    if (!draft) return;

    setUpdatingId(orderId);
    try {
      await axiosInstance.patch(`/orders/admin/${orderId}/fulfillment`, draft);
      toast.success('Fulfillment & Tracking updated successfully');
      // Update local order object
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, ...draft } : o))
      );
    } catch (err) {
      console.error('Error updating fulfillment:', err);
      toast.error(err.response?.data?.message || 'Failed to update fulfillment');
    } finally {
      setUpdatingId(null);
    }
  };

  const copyToClipboard = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast.success('Tracking number copied to clipboard');
  };

  const handleSendEmail = async (orderId, type) => {
    const key = `${orderId}-${type}`;
    setSendingEmailKey(key);
    try {
      const res = await axiosInstance.post(`/orders/${orderId}/resend-email`, { type });
      toast.success(res.data.message || `Customer email (${type}) sent successfully`);
    } catch (err) {
      console.error('Error sending order email:', err);
      toast.error(err.response?.data?.message || 'Failed to dispatch email');
    } finally {
      setSendingEmailKey(null);
    }
  };

  // Filter orders
  const filteredOrders = orders.filter((o) => {
    // Status filter
    if (statusFilter !== 'all') {
      if (['complete', 'pending', 'cancelled'].includes(statusFilter)) {
        if (o.status !== statusFilter) return false;
      } else {
        if ((o.fulfillmentStatus || 'unfulfilled') !== statusFilter) return false;
      }
    }

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchId = (o.orderId || o._id).toLowerCase().includes(q);
      const matchCustomer = o.userId?.fullName?.toLowerCase().includes(q);
      const matchEmail = o.userId?.email?.toLowerCase().includes(q);
      const matchTracking = o.trackingNumber?.toLowerCase().includes(q);
      if (!matchId && !matchCustomer && !matchEmail && !matchTracking) return false;
    }

    return true;
  });

  // Calculate quick metrics
  const unfulfilledCount = orders.filter(
    (o) => o.status === 'complete' && (!o.fulfillmentStatus || o.fulfillmentStatus === 'unfulfilled')
  ).length;
  const inTransitCount = orders.filter((o) => o.fulfillmentStatus === 'dispatched').length;
  const deliveredCount = orders.filter((o) => o.fulfillmentStatus === 'delivered').length;

  if (loading && orders.length === 0) {
    return (
      <div className="p-16 flex flex-col items-center justify-center gap-3">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-IPCprimary border-t-transparent"></div>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          Loading Order Registry…
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Metric Cards Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-border border border-border">
        <div className="bg-background p-4 flex flex-col gap-1">
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Total Orders</span>
          <span className="text-2xl font-light text-foreground">{orders.length}</span>
        </div>
        <div className="bg-background p-4 flex flex-col gap-1">
          <span className="text-[10px] font-bold uppercase tracking-widest text-amber-600">Pending Dispatch</span>
          <span className="text-2xl font-light text-amber-600">{unfulfilledCount}</span>
        </div>
        <div className="bg-background p-4 flex flex-col gap-1">
          <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600">In Transit (Speed Post)</span>
          <span className="text-2xl font-light text-blue-600">{inTransitCount}</span>
        </div>
        <div className="bg-background p-4 flex flex-col gap-1">
          <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">Delivered</span>
          <span className="text-2xl font-light text-emerald-600">{deliveredCount}</span>
        </div>
      </div>

      {/* Toolbar & Filter Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Filter Pills */}
        <div className="flex flex-wrap gap-1 border border-border p-1 bg-muted/20">
          {[
            { id: 'all', label: 'All Orders' },
            { id: 'complete', label: 'Paid' },
            { id: 'unfulfilled', label: 'Unfulfilled' },
            { id: 'dispatched', label: 'Dispatched' },
            { id: 'delivered', label: 'Delivered' },
            { id: 'pending', label: 'Pending Payment' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                statusFilter === tab.id
                  ? 'bg-foreground text-background shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <input
            type="search"
            placeholder="Search ID, customer, tracking…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-3 pr-8 py-2 text-xs bg-background border border-border focus:border-IPCprimary outline-none"
          />
          <Search className="h-3.5 w-3.5 text-muted-foreground absolute right-2.5 top-3" />
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="border border-border border-dashed p-16 text-center space-y-3">
          <Package className="h-8 w-8 text-muted-foreground/30 mx-auto" />
          <p className="text-sm font-semibold text-foreground">No orders match this filter</p>
          <p className="text-xs text-muted-foreground">Try adjusting your search criteria or filter status.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const draft = draftFulfillments[order._id] || {
              fulfillmentStatus: order.fulfillmentStatus || 'unfulfilled',
              trackingNumber: order.trackingNumber || '',
              carrier: order.carrier || 'India Post Speed Post'
            };
            const isSaving = updatingId === order._id;

            return (
              <div
                key={order._id}
                className="border border-border bg-background transition-all hover:border-IPCprimary/40 space-y-4 p-5"
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-mono text-xs font-bold text-foreground">
                      #{order.orderId || order._id.slice(-8).toUpperCase()}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${
                        order.status === 'complete'
                          ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                          : order.status === 'cancelled'
                          ? 'border-red-200 bg-red-50 text-red-700'
                          : 'border-amber-200 bg-amber-50 text-amber-700'
                      }`}
                    >
                      Payment: {order.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-IPCprimary">
                      ₹{order.totalPrice?.toFixed(2)}
                    </span>
                    <Link
                      to={`/order/${order._id}`}
                      className="p-1.5 border border-border text-muted-foreground hover:text-IPCprimary hover:border-IPCprimary transition-colors cursor-pointer"
                      title="View Customer Order Details"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>

                {/* Main Content: Customer & Line Items & Fulfillment Form */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs">
                  {/* Customer Info */}
                  <div className="space-y-1.5 bg-muted/10 border border-border p-3.5">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-1">
                      Customer & Shipping Address
                    </span>
                    <p className="font-semibold text-foreground">{order.userId?.fullName || 'Collector'}</p>
                    <p className="text-muted-foreground">{order.userId?.email}</p>
                    {order.userId?.address?.locality ? (
                      <p className="text-muted-foreground pt-1 leading-relaxed">
                        {order.userId.address.locality}, {order.userId.address.city}, {order.userId.address.state} - {order.userId.address.pin}
                      </p>
                    ) : (
                      <p className="text-muted-foreground italic pt-1">No shipping address recorded</p>
                    )}
                  </div>

                  {/* Items Ordered */}
                  <div className="space-y-2 bg-muted/10 border border-border p-3.5">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-1">
                      Items Ordered ({order.items?.length || 0})
                    </span>
                    <div className="space-y-2 max-h-32 overflow-y-auto pr-1">
                      {order.items?.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between gap-2 border-b border-border/50 pb-1.5 last:border-0 last:pb-0">
                          <span className="font-medium text-foreground truncate flex-1">
                            {item.productId?.title || 'Rare Stamp'}
                          </span>
                          <span className="text-muted-foreground font-mono shrink-0">
                            x{item.quantity} (₹{item.productId?.price || 0})
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Fulfillment Dispatch Controls */}
                  <div className="space-y-3 bg-muted/20 border border-border p-3.5">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-IPCprimary block mb-1">
                      Dispatch & Tracking Controls
                    </span>

                    {/* Fulfillment Status Select & 1-Click Stepper */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[9px] uppercase font-bold text-muted-foreground">Fulfillment Status</label>
                        <span className="text-[9px] text-IPCprimary font-mono font-bold uppercase">{draft.fulfillmentStatus}</span>
                      </div>

                      {/* 1-Click Stepper Bar */}
                      <div className="grid grid-cols-3 gap-1 mb-2">
                        {[
                          { val: 'processing', label: 'Processing' },
                          { val: 'dispatched', label: 'Dispatched' },
                          { val: 'delivered', label: 'Delivered' }
                        ].map(step => (
                          <button
                            key={step.val}
                            type="button"
                            onClick={() => handleFieldChange(order._id, 'fulfillmentStatus', step.val)}
                            className={`py-1 text-[9px] font-bold uppercase tracking-wider border transition-all cursor-pointer ${
                              draft.fulfillmentStatus === step.val
                                ? 'bg-IPCprimary text-white border-IPCprimary shadow-xs'
                                : 'bg-background text-muted-foreground border-border hover:border-IPCprimary/60'
                            }`}
                          >
                            {step.label}
                          </button>
                        ))}
                      </div>

                      <select
                        value={draft.fulfillmentStatus}
                        onChange={(e) => handleFieldChange(order._id, 'fulfillmentStatus', e.target.value)}
                        className="w-full text-xs p-2 bg-background border border-border focus:border-IPCprimary outline-none"
                      >
                        {FULFILLMENT_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>

                      {/* Order Status Select */}
                      <div>
                        <label className="text-[9px] uppercase font-bold text-muted-foreground block mb-1">Order / Payment Status</label>
                        <select
                          value={draft.status || order.status}
                          onChange={(e) => handleFieldChange(order._id, 'status', e.target.value)}
                          className="w-full text-xs p-2 bg-background border border-border focus:border-IPCprimary outline-none font-medium"
                        >
                          <option value="pending">Pending Payment</option>
                          <option value="complete">Complete / Paid</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>

                      {/* Carrier Select */}
                      <div>
                        <label className="text-[9px] uppercase font-bold text-muted-foreground block mb-1">Carrier</label>
                        <select
                          value={draft.carrier}
                          onChange={(e) => handleFieldChange(order._id, 'carrier', e.target.value)}
                          className="w-full text-xs p-2 bg-background border border-border focus:border-IPCprimary outline-none"
                        >
                          {CARRIERS.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Tracking Number Input */}
                      <div>
                        <label className="text-[9px] uppercase font-bold text-muted-foreground block mb-1">Tracking Number / Consignment</label>
                        <div className="flex items-center gap-1.5">
                          <input
                            type="text"
                            placeholder="e.g. EB984719283IN"
                            value={draft.trackingNumber}
                            onChange={(e) => handleFieldChange(order._id, 'trackingNumber', e.target.value)}
                            className="flex-1 text-xs p-2 bg-background border border-border focus:border-IPCprimary outline-none font-mono"
                          />
                          {draft.trackingNumber && (
                            <button
                              type="button"
                              onClick={() => copyToClipboard(draft.trackingNumber)}
                              className="p-2 border border-border text-muted-foreground hover:text-foreground cursor-pointer"
                              title="Copy tracking number"
                            >
                              <Copy className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Save Button & Direct Email Dispatch */}
                      <div className="pt-1 flex flex-col gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleSaveFulfillment(order._id)}
                          disabled={isSaving}
                          className="w-full py-2 bg-IPCprimary text-white text-[10px] font-bold uppercase tracking-widest hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                        >
                          {isSaving ? <Loader className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                          {isSaving ? 'Updating…' : 'Save Status & Notify'}
                        </button>

                        <div className="grid grid-cols-2 gap-1.5 pt-0.5">
                          <button
                            type="button"
                            onClick={() => handleSendEmail(order._id, 'confirmation')}
                            disabled={sendingEmailKey === `${order._id}-confirmation`}
                            className="py-1.5 px-2 border border-border text-[9px] font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground hover:border-IPCprimary flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50 transition-colors"
                            title="Send order receipt / confirmation email to customer"
                          >
                            {sendingEmailKey === `${order._id}-confirmation` ? (
                              <Loader className="h-3 w-3 animate-spin" />
                            ) : (
                              <Mail className="h-3 w-3" />
                            )}
                            Receipt
                          </button>

                          <button
                            type="button"
                            onClick={() => handleSendEmail(order._id, 'processing')}
                            disabled={sendingEmailKey === `${order._id}-processing`}
                            className="py-1.5 px-2 border border-border text-[9px] font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground hover:border-IPCprimary flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50 transition-colors"
                            title="Send packaging / curation status update email"
                          >
                            {sendingEmailKey === `${order._id}-processing` ? (
                              <Loader className="h-3 w-3 animate-spin" />
                            ) : (
                              <Package className="h-3 w-3" />
                            )}
                            Curation
                          </button>

                          <button
                            type="button"
                            onClick={() => handleSendEmail(order._id, 'dispatch')}
                            disabled={sendingEmailKey === `${order._id}-dispatch`}
                            className="py-1.5 px-2 border border-border text-[9px] font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground hover:border-IPCprimary flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50 transition-colors"
                            title="Send dispatch notification email with tracking info"
                          >
                            {sendingEmailKey === `${order._id}-dispatch` ? (
                              <Loader className="h-3 w-3 animate-spin" />
                            ) : (
                              <Truck className="h-3 w-3" />
                            )}
                            Dispatch
                          </button>

                          <button
                            type="button"
                            onClick={() => handleSendEmail(order._id, 'delivered')}
                            disabled={sendingEmailKey === `${order._id}-delivered`}
                            className="py-1.5 px-2 border border-border text-[9px] font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground hover:border-IPCprimary flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50 transition-colors"
                            title="Send delivery completed notification email"
                          >
                            {sendingEmailKey === `${order._id}-delivered` ? (
                              <Loader className="h-3 w-3 animate-spin" />
                            ) : (
                              <CheckCircle2 className="h-3 w-3" />
                            )}
                            Delivered
                          </button>
                        </div>
                      </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OrdersManagement;
