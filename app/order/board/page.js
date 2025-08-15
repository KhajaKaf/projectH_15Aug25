'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { getPusherClient } from '@/lib/pusher';

// Only show these in the public board
const ACTIVE = new Set(['NEW','CONFIRMED','IN_PROGRESS','READY']);

function groupByStatus(list) {
  const groups = { NEW: [], CONFIRMED: [], IN_PROGRESS: [], READY: [] };
  for (const o of list) {
    if (ACTIVE.has(o.status)) groups[o.status].push(o);
  }
  return groups;
}

export default function PublicOrdersBoard() {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);

  const grouped = useMemo(() => groupByStatus(orders), [orders]);

  const loadInitial = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/orders/active', { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to load active orders');
      const data = await res.json();
      setOrders(data.orders || []);
    } catch (e) {
      console.error(e);
      toast.error('Could not load active orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitial();

    // Live updates via Pusher
    const client = getPusherClient?.();
    if (!client) return;

    const ch = client.subscribe('public-orders');

    const onCreated = (o) => {
      // o is already PII-free: {id, tableNumber, status, total, createdAt, itemsCount}
      if (!ACTIVE.has(o.status)) return;
      setOrders((prev) => {
        // avoid dupes
        if (prev.some((x) => x.id === o.id)) return prev.map(x => x.id === o.id ? o : x);
        return [o, ...prev];
      });
    };

    const onUpdated = (o) => {
      setOrders((prev) => {
        const next = prev.map((x) => (x.id === o.id ? o : x));
        // If the update moved it out of ACTIVE, drop it from the board
        return ACTIVE.has(o.status) ? next : next.filter((x) => x.id !== o.id);
      });
    };

    ch.bind('order.created', onCreated);
    ch.bind('order.updated', onUpdated);

    return () => {
      try {
        ch.unbind('order.created', onCreated);
        ch.unbind('order.updated', onUpdated);
        client.unsubscribe('public-orders');
        client.disconnect();
      } catch {}
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 pt-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-100">Live Orders</h1>
          <Button
            size="sm"
            onClick={loadInitial}
            className="bg-amber-500 hover:bg-amber-600 text-slate-900"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>

        {loading ? (
          <div className="text-slate-400">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {['NEW','CONFIRMED','IN_PROGRESS','READY'].map((col) => (
              <Card key={col} className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-slate-100 flex items-center justify-between">
                    {col.replace('_',' ')}
                    <Badge variant="outline" className="border-amber-500 text-amber-400">
                      {grouped[col].length}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {grouped[col].length === 0 ? (
                    <p className="text-slate-500 text-sm">No orders</p>
                  ) : (
                    grouped[col].map((o) => (
                      <div key={o.id} className="bg-slate-700/40 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <div className="text-slate-200 font-medium">
                            Table {o.tableNumber}
                          </div>
                          <div className="text-amber-400 font-semibold">
                            #{o.id.slice(-4).toUpperCase()}
                          </div>
                        </div>
                          <div className="text-xs text-slate-400 mt-1">
                            {o.itemNames?.length
                              ? (() => {
                                  const first = o.itemNames.slice(0, 3).join(", ");
                                  const more = o.itemNames.length - 3;
                                  return `${first}${more > 0 ? ` +${more} more` : ""} • ₹${Number(o.total ?? 0).toFixed(0)}`;
                                })()
                              : `${o.itemsCount} item${o.itemsCount === 1 ? "" : "s"} • ₹${Number(o.total ?? 0).toFixed(0)}`
                            }
                          </div>
                        <div className="text-[11px] text-slate-500">
                          {new Date(o.createdAt).toLocaleTimeString()}
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}