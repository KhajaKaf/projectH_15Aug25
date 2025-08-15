'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Package, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

const STATUS_COLORS = {
  NEW: 'bg-blue-600',
  CONFIRMED: 'bg-emerald-600',
  IN_PROGRESS: 'bg-yellow-600',
  READY: 'bg-purple-600',
  DELIVERED: 'bg-slate-600',
  PAYMENT_PENDING: 'bg-amber-600',
  PAID: 'bg-emerald-700',
  CANCELLED: 'bg-red-600',
  REJECTED: 'bg-red-600',
};

export default function AdminPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/orders", {
          cache: 'no-store',
          credentials: 'include',
        });
        const data = await res.json();
        const activeOrders = (data.orders || []).filter((o) => o.status !== 'PAID');
        setOrders(activeOrders);
      } catch (err) {
        console.error("Failed to fetch orders", err);
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      let interval;
      (async () => {
        await fetchOrders();
        interval = setInterval(fetchOrders, 7000); // slightly lighter
      })();
      return () => interval && clearInterval(interval);
    }, []);

  const call = async (url, body) => {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: body ? JSON.stringify(body) : undefined,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || 'Action failed');
      toast.success('Updated');
      fetchOrders();
    } catch (e) {
      toast.error(e.message);
    }
  };

  const onConfirm = (id) => call(`/api/orders/${id}/confirm`, { etaMinutes: 25 });
  const onProgress = (id) => call(`/api/orders/${id}/progress`);
  const onReady    = (id) => call(`/api/orders/${id}/ready`);
  const onDeliver  = (id) => call(`/api/orders/${id}/deliver`);
  const onDelete = (id) => call(`/api/orders/${id}/delete`);
  const onPay      = (id) => {
    // navigate to payment page (that endpoint will set PAYMENT_PENDING + lock)
    window.location.href = `/pay/${id}`;
  };
  const onMarkPaid = (id) => call(`/api/orders/${id}/mark-paid`);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-200">
        <RefreshCw className="w-6 h-6 animate-spin mr-2" /> Loading…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 p-6 pt-24">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-100 mb-2">Admin</h1>
            <p className="text-slate-400">Manage orders & payment</p>
          </div>
          <Button
            onClick={() => {
              fetch('/api/auth/logout', { method: 'POST' })
                .then(() => {
                  window.location.href = '/admin/login';
                })
                .catch(() => {
                  window.location.href = '/admin/login';
                });
            }}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Sign Out
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Stat title="Total" value={orders.length} icon={<Package className="w-5 h-5" />} />
          <Stat title="New" value={orders.filter(o => o.status === 'NEW').length} />
          <Stat title="In Progress" value={orders.filter(o => o.status === 'IN_PROGRESS').length} />
          <Stat title="Ready" value={orders.filter(o => o.status === 'READY').length} />
        </div>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex items-center justify-between">
            <CardTitle className="text-slate-100">Recent Orders</CardTitle>
            <Button onClick={fetchOrders} size="sm" className="bg-amber-500 text-slate-900">
              <RefreshCw className="w-4 h-4 mr-2" /> Refresh
            </Button>
          </CardHeader>
          <CardContent>
            {loading ? (
            <div className="text-slate-400">Loading orders…</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-700 text-left text-slate-300">
                      <th className="py-2">Order</th>
                      <th className="py-2">Table</th>
                      <th className="py-2">Items</th>
                      <th className="py-2">Total</th>
                      <th className="py-2">Status</th>
                      <th className="py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((o) => (
                      <tr key={o.id} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                        <td className="py-3">
                          <span className="font-mono text-slate-200">#{o.id.slice(-6)}</span>
                        </td>
                        <td className="py-3">
                          <Badge variant="outline" className="border-amber-500 text-amber-400">
                            {o.table?.number || '-'}
                          </Badge>
                        </td>
                        <td className="py-3 text-slate-200">
                          {o.orderItems?.length || 0}
                        </td>
                        <td className="py-3 text-slate-100 font-semibold">
                          ₹{o.total?.toFixed?.(2) ?? '0.00'}
                        </td>
                        <td className="py-3">
                          <span className={`px-2 py-1 rounded text-white text-xs ${STATUS_COLORS[o.status] || 'bg-slate-600'}`}>
                            {o.status}
                          </span>
                        </td>
                        <td className="py-3">
                          <div className="flex flex-wrap gap-2">
                            {o.status === 'NEW' && (
                              <>
                              <Button size="sm" onClick={() => onConfirm(o.id)} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                                Confirm
                              </Button>
                              <Button size="sm" variant="destructive" onClick={() => onDelete(o.id)} className="bg-red-600 hover:bg-red-700 text-white">
                                 Delete
                              </Button>
                              </>
                            )}
                            {o.status === 'CONFIRMED' && (
                              <Button size="sm" onClick={() => onProgress(o.id)} className="bg-yellow-600 hover:bg-yellow-700 text-white">
                                Start
                              </Button>
                            )}
                            {o.status === 'IN_PROGRESS' && (
                              <Button size="sm" onClick={() => onReady(o.id)} className="bg-purple-600 hover:bg-purple-700 text-white">
                                Ready
                              </Button>
                            )}
                            {o.status === 'READY' && (
                              <>
                                <Button size="sm" onClick={() => onDeliver(o.id)} className="bg-slate-600 hover:bg-slate-700 text-white">
                                  Deliver
                                </Button>
                                <Button size="sm" onClick={() => onPay(o.id)} className="bg-amber-600 hover:bg-amber-700 text-white">
                                  Pay
                                </Button>
                              </>
                            )}
                            {o.status === 'DELIVERED' && (
                              <Button size="sm" onClick={() => onPay(o.id)} className="bg-amber-600 hover:bg-amber-700 text-white">
                                Pay
                              </Button>
                            )}
                            {o.status === 'PAYMENT_PENDING' && (
                              <Button size="sm" onClick={() => onMarkPaid(o.id)} className="bg-emerald-600 hover:bg-emerald-700 text-white inline-flex items-center">
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Mark Paid
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                    {orders.length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-10 text-center text-slate-400">
                          No orders yet
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
            </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Stat({ title, value, icon }) {
  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-400">{title}</p>
            <p className="text-2xl font-bold text-slate-100">{value}</p>
          </div>
          {icon || <Package className="w-5 h-5 text-amber-400" />}
        </div>
      </CardContent>
    </Card>
  );
}