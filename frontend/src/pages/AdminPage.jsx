import React, { useState } from 'react';
import { Package, Calendar, TrendingUp, DollarSign, Truck } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StampsManagement from '@/components/admin/StampsManagement';
import EventManagement from '@/components/admin/EventManagement';
import OrdersManagement from '@/components/admin/OrdersManagement';
import AnalyticsDashboard from '@/components/admin/AnalyticsDashboard';

const AdminPage = () => {
  const [stats, setStats] = useState({
    totalItems: 0,
    totalEvents: 0,
    totalOrders: 0,
    revenue: 0
  });

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* ── Header ── */}
        <div className="border-b border-border pb-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-IPCsecondary mb-2">Control Panel</p>
          <h1 className="text-3xl font-light text-foreground">Admin Dashboard</h1>
        </div>

        {/* ── Stats Cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-border">
          <div className="bg-background p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Total Items</p>
              <Package className="w-4 h-4 text-IPCprimary" />
            </div>
            <p className="text-3xl font-light text-foreground">{stats.totalItems}</p>
          </div>
          <div className="bg-background p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Total Events</p>
              <Calendar className="w-4 h-4 text-IPCprimary" />
            </div>
            <p className="text-3xl font-light text-foreground">{stats.totalEvents}</p>
          </div>
          <div className="bg-background p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Total Orders</p>
              <TrendingUp className="w-4 h-4 text-IPCprimary" />
            </div>
            <p className="text-3xl font-light text-foreground">{stats.totalOrders}</p>
          </div>
          <div className="bg-background p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Revenue</p>
              <DollarSign className="w-4 h-4 text-IPCprimary" />
            </div>
            <p className="text-3xl font-light text-foreground">₹{Number(stats.revenue || 0).toLocaleString('en-IN')}</p>
          </div>
        </div>

        {/* ── Main Content ── */}
        <Tabs defaultValue="items" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 border border-border bg-muted/20 p-1">
            <TabsTrigger value="items" className="rounded-none uppercase tracking-widest text-xs font-semibold data-[state=active]:bg-IPCprimary data-[state=active]:text-white data-[state=active]:shadow-none transition-colors">
              Items Management
            </TabsTrigger>
            <TabsTrigger value="events" className="rounded-none uppercase tracking-widest text-xs font-semibold data-[state=active]:bg-IPCprimary data-[state=active]:text-white data-[state=active]:shadow-none transition-colors">
              Events Management
            </TabsTrigger>
            <TabsTrigger value="orders" className="rounded-none uppercase tracking-widest text-xs font-semibold data-[state=active]:bg-IPCprimary data-[state=active]:text-white data-[state=active]:shadow-none transition-colors">
              Orders & Dispatch
            </TabsTrigger>
            <TabsTrigger value="analytics" className="rounded-none uppercase tracking-widest text-xs font-semibold data-[state=active]:bg-IPCprimary data-[state=active]:text-white data-[state=active]:shadow-none transition-colors">
              Visual Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="items" className="border border-border bg-background p-6">
            <StampsManagement setStats={setStats} />
          </TabsContent>

          <TabsContent value="events" className="border border-border bg-background p-6">
            <EventManagement setStats={setStats} />
          </TabsContent>

          <TabsContent value="orders" className="border border-border bg-background p-6">
            <OrdersManagement setStats={setStats} />
          </TabsContent>

          <TabsContent value="analytics" className="border border-border bg-background p-6">
            <AnalyticsDashboard />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPage;