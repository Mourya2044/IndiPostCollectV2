import React, { useState, useEffect } from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import {
  TrendingUp,
  DollarSign,
  Package,
  Users,
  Truck,
  RefreshCw,
  Layers
} from 'lucide-react';
import { axiosInstance } from '@/lib/axios';
import { toast } from 'sonner';

const STATUS_COLORS = {
  Delivered: '#10B981', // emerald
  Dispatched: '#3B82F6', // blue
  Processing: '#F59E0B', // amber
  Unfulfilled: '#6B7280' // neutral gray
};

const CustomTooltip = ({ active, payload, label, prefix = '', suffix = '' }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border border-border p-3 shadow-lg text-xs space-y-1 font-mono">
        <p className="font-bold text-foreground mb-1">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color || entry.stroke }}>
            <span className="font-semibold">{entry.name}: </span>
            {prefix}{Number(entry.value).toLocaleString('en-IN')}{suffix}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const AnalyticsDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/orders/admin/analytics');
      setData(res.data);
    } catch (err) {
      console.error('Failed to load analytics:', err);
      toast.error(err.response?.data?.message || 'Failed to load visual analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading && !data) {
    return (
      <div className="p-16 flex flex-col items-center justify-center gap-3">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-IPCprimary border-t-transparent"></div>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          Aggregating Bureau Telemetry…
        </p>
      </div>
    );
  }

  const { summary = {}, monthlyTrends = [], topCategories = [], fulfillmentDistribution = [] } = data || {};

  return (
    <div className="space-y-8">
      {/* ── Top Header & Refresh ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h2 className="text-xl font-light text-foreground">Philatelic Bureau Analytics</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Real-time telemetry across revenue velocity, collection categories, and order fulfillment.
          </p>
        </div>
        <button
          onClick={fetchAnalytics}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-border text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:border-IPCprimary hover:text-IPCprimary transition-all cursor-pointer"
        >
          <RefreshCw className="h-3.5 w-3.5" /> Refresh Data
        </button>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border border border-border">
        {/* Total Realized Revenue */}
        <div className="bg-background p-5 flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Settled Revenue</span>
            <DollarSign className="w-4 h-4 text-IPCprimary" />
          </div>
          <div>
            <p className="text-3xl font-light text-foreground font-mono">
              ₹{Number(summary.totalRevenue || 0).toLocaleString('en-IN')}
            </p>
            <p className="text-[10px] text-muted-foreground mt-1">
              AOV: ₹{summary.averageOrderValue || 0} / completed dispatch
            </p>
          </div>
        </div>

        {/* Sales Volume */}
        <div className="bg-background p-5 flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Stamps Transacted</span>
            <Package className="w-4 h-4 text-IPCprimary" />
          </div>
          <div>
            <p className="text-3xl font-light text-foreground font-mono">{summary.totalUnitsSold || 0}</p>
            <p className="text-[10px] text-muted-foreground mt-1">
              Across {summary.completedOrders || 0} fulfilled orders
            </p>
          </div>
        </div>

        {/* Active Collectors */}
        <div className="bg-background p-5 flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Active Buyers</span>
            <Users className="w-4 h-4 text-IPCprimary" />
          </div>
          <div>
            <p className="text-3xl font-light text-foreground font-mono">{summary.activeCollectors || 0}</p>
            <p className="text-[10px] text-muted-foreground mt-1">
              Out of {summary.totalCollectors || 0} registered collectors
            </p>
          </div>
        </div>

        {/* Fulfillment Rate */}
        <div className="bg-background p-5 flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Order Completion</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <p className="text-3xl font-light text-foreground font-mono">{summary.completionRate || 0}%</p>
            <p className="text-[10px] text-muted-foreground mt-1">
              {summary.totalOrders || 0} lifetime registered orders
            </p>
          </div>
        </div>
      </div>

      {/* ── Charts Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Chart 1: Monthly Revenue Velocity */}
        <div className="border border-border bg-background p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-foreground">Monthly Revenue Velocity</h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">Realized billing per calendar month (₹)</p>
            </div>
            <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 border border-border text-IPCprimary">
              Trend
            </span>
          </div>
          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#244855" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#244855" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} stroke="currentColor" opacity={0.5} />
                <YAxis tick={{ fontSize: 10 }} stroke="currentColor" opacity={0.5} />
                <Tooltip content={<CustomTooltip prefix="₹" />} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  name="Revenue"
                  stroke="#244855"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#revenueGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Monthly Sales Volume */}
        <div className="border border-border bg-background p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-foreground">Order Volume vs Units Sold</h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">Transaction count and physical stamps dispatched</p>
            </div>
            <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 border border-border text-IPCprimary">
              Volume
            </span>
          </div>
          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} stroke="currentColor" opacity={0.5} />
                <YAxis tick={{ fontSize: 10 }} stroke="currentColor" opacity={0.5} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
                <Bar dataKey="orders" name="Orders Placed" fill="#874F41" />
                <Bar dataKey="units" name="Stamps Dispatched" fill="#244855" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Top-Selling Thematic Categories */}
        <div className="border border-border bg-background p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-foreground">Top Philatelic Themes</h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">Quantity sold by commemorative and definitive theme</p>
            </div>
            <Layers className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="h-64 w-full pt-2">
            {topCategories.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-muted-foreground">
                No categorical sales logged yet.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={topCategories}
                  layout="vertical"
                  margin={{ top: 10, right: 20, left: 40, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
                  <XAxis type="number" tick={{ fontSize: 10 }} stroke="currentColor" opacity={0.5} />
                  <YAxis
                    dataKey="category"
                    type="category"
                    tick={{ fontSize: 10 }}
                    stroke="currentColor"
                    opacity={0.7}
                    width={80}
                  />
                  <Tooltip content={<CustomTooltip suffix=" stamps" />} />
                  <Bar dataKey="count" name="Stamps Sold" fill="#244855" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Chart 4: Fulfillment Status Distribution */}
        <div className="border border-border bg-background p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-foreground">Fulfillment Status Breakdown</h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">Current packaging, dispatch, and delivery state</p>
            </div>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="h-64 w-full pt-2 flex flex-col sm:flex-row items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={fulfillmentDistribution}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                >
                  {fulfillmentDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.name] || '#9CA3AF'} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip suffix=" orders" />} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AnalyticsDashboard;
