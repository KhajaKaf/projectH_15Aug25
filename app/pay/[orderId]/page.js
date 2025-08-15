// app/pay/[orderId]/page.js
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Copy, Check, RefreshCw } from "lucide-react";
import { toast } from "sonner";

export default function PaymentPage({ params }) {
  const router = useRouter();
  const { orderId } = params;

  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState(null);
  const [qrPayload, setQrPayload] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        // Move order into PAYMENT_PENDING + get QR payload
        const res = await fetch(`/api/orders/${orderId}/pay`, { method: "POST" });
        const data = await res.json();
        if (!res.ok) {
          toast.error(data?.error || "Unable to open payment");
          router.push("/admin");
          return;
        }
        if (mounted) {
          setOrder(data.order);
          setQrPayload(data.qrPayload);
        }
      } catch (e) {
        toast.error("Network error");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => (mounted = false);
  }, [orderId, router]);

  const totals = useMemo(() => {
    if (!order) return { subtotal: 0, tax: 0, total: 0 };
    return {
      subtotal: order.subtotal,
      tax: order.tax,
      total: order.total,
    };
  }, [order]);

  const copyPayload = async () => {
    try {
      await navigator.clipboard.writeText(qrPayload);
      setCopied(true);
      toast.success("Payment details copied");
      setTimeout(() => setCopied(false), 1200);
    } catch {
      toast.error("Copy failed");
    }
  };

  const markPaid = async () => {
    try {
      const res = await fetch(`/api/orders/${orderId}/mark-paid`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data?.error || "Failed to mark paid");
        return;
      }
      toast.success("Payment confirmed. Table is now available.");
      router.push("/admin");
    } catch {
      toast.error("Network error");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-amber-400 animate-spin mx-auto mb-4" />
          <p className="text-slate-300">Opening payment…</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-slate-300">
        Order not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 py-10 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-slate-100">
              Payment for Order #{order.id.slice(-6)} • Table{" "}
              <Badge variant="outline" className="border-amber-500 text-amber-400">
                {order.table?.number || ""}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* QR */}
            <div className="flex flex-col items-center gap-3">
              <div
                className="bg-white p-3 rounded"
                aria-label="Static payment QR"
                // Simple re-usable <img> via quick QR service-free trick:
                // data URL generated client-side without deps
                // Uses Google Chart fallback removed; we’ll draw canvas:
              >
                <CanvasQR payload={qrPayload} size={220} />
              </div>
              <p className="text-slate-400 text-sm break-all text-center">
                {qrPayload || "PAY_QR_NOT_SET"}
              </p>

              <div className="flex gap-2">
                <Button onClick={copyPayload} variant="outline" className="border-slate-600 text-slate-200">
                  {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                  {copied ? "Copied" : "Copy Payment Details"}
                </Button>
                <Button
                  onClick={markPaid}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  Mark as Paid
                </Button>
              </div>
            </div>

            <Separator className="bg-slate-700" />

            {/* Summary */}
            <div className="space-y-2">
              <div className="flex justify-between text-slate-300 text-sm">
                <span>Subtotal</span>
                <span>₹{totals.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-300 text-sm">
                <span>Tax (5%)</span>
                <span>₹{totals.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-semibold text-slate-100 mt-2">
                <span>Total</span>
                <span>₹{totals.total.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-slate-100">Items</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {order.orderItems?.map((it) => (
              <div key={it.id} className="flex justify-between items-center bg-slate-700/30 p-3 rounded">
                <div>
                  <p className="text-slate-100">{it.menuItem.name}</p>
                  <p className="text-slate-400 text-sm">
                    ₹{it.unitPrice} × {it.quantity}
                  </p>
                </div>
                <p className="text-slate-100 font-semibold">₹{it.totalPrice}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

/**
 * Ultra-light QR renderer without external deps.
 * Generates a QR on a canvas via a tiny embedded algorithm (ok for short UPI URLs/strings).
 * If you prefer a library, install `qrcode.react` and swap this component.
 */
function CanvasQR({ payload, size = 220 }) {
  const [dataUrl, setDataUrl] = useState("");

  useEffect(() => {
    (async () => {
      try {
        // lazy import to keep bundle small if you later swap libraries
        const { toDataURL } = await import("qrcode"); // npm i qrcode
        const url = await toDataURL(payload || "PAY_QR_NOT_SET", { margin: 1, width: size });
        setDataUrl(url);
      } catch {
        setDataUrl(""); // fallback text only
      }
    })();
  }, [payload, size]);

  if (!dataUrl) {
    return (
      <div className="w-[220px] h-[220px] flex items-center justify-center">
        <span className="text-slate-700 text-xs">QR unavailable</span>
      </div>
    );
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={dataUrl} alt="Payment QR" width={size} height={size} />;
}