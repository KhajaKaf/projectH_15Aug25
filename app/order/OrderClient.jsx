// app/order/OrderClient.jsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import dynamicImport from "next/dynamic";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  QrCode,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  Send,
  TableIcon,
  Clock,
  Phone,
  X,
  Camera,
} from "lucide-react";
import { toast } from "sonner";
import { menuItems } from "@/lib/mock";
import { useCart } from "@/providers/cart-provider";

// Starts/locks a table session on the server and returns DB table id + number
async function startTableSession(code) {
  const res = await fetch("/api/tables/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tableNumber: code }), // accepts table number OR QR code
  });
  const data = await res.json();
  if (!res.ok || !data?.tableId) {
    throw new Error(data?.error || "Invalid or unavailable table");
  }
  return { tableId: data.tableId, tableNumber: data.tableNumber };
}

const QrScanner = dynamicImport(
  () => import("@yudiel/react-qr-scanner").then((m) => m.QrScanner),
  { ssr: false }
);

export default function OrderClient({ initialTableId }) {
  const router = useRouter();
  const {
    tableNumber,
    setTableNumber,
    cart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    phone,
    setPhone,
    getTotals,
    itemCount,
  } = useCart();

  const [currentTable, setCurrentTable] = useState(null); // { id, number }
  const [manualTableNumber, setManualTableNumber] = useState("");
  const [activeCategory, setActiveCategory] = useState(
    Object.keys(menuItems)[0]
  );
  const [orderStatus, setOrderStatus] = useState(null);
  const [showScanner, setShowScanner] = useState(false);
  const [scanPaused, setScanPaused] = useState(false);

  const categories = useMemo(() => Object.keys(menuItems), []);

  // Map: menu name -> real Prisma id
  const [menuIdByName, setMenuIdByName] = useState({});

  // Load real menu from backend once to build the map
  // Build a name -> id map once from backend menu
    useEffect(() => {
      let cancelled = false;
      (async () => {
        try {
          const res = await fetch("/api/menu");
          if (!res.ok) return;
          const data = await res.json();
          const arr = data?.items || [];
          const map = {};
          for (const m of arr) {
            if (m?.name && m?.id) map[m.name] = m.id;
          }
          if (!cancelled) setMenuIdByName(map);
        } catch {
          // ignore; backend will fallback by name if needed
        }
      })();
      return () => { cancelled = true; };
    }, []);

  // If the page is opened with /order/[tableId or QR], start a table session (silent)
  useEffect(() => {
    if (!initialTableId) return;
    (async () => {
      try {
        const { tableId, tableNumber } = await startTableSession(initialTableId);
        setCurrentTable({ id: tableId, number: tableNumber });
        setTableNumber(tableNumber);
        // no toast and no navigation here — prevents double messages/bounce
      } catch (e) {
        toast.error(e.message || "Invalid or unavailable table");
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialTableId]);

  // Connect by text input or scanned QR (single toast + redirect to /menu)
  const connectByCode = async (raw) => {
    const code = (raw || "").trim();
    if (!code) return toast.error("Please enter a table number");
    try {
      const { tableId, tableNumber } = await startTableSession(code);
      setCurrentTable({ id: tableId, number: tableNumber });
      setTableNumber(tableNumber);
      setShowScanner(false);

      // Single toast only
      toast.success(`Connected to ${tableNumber}`);

      // Go to menu and replace history to avoid bouncing back here
      router.replace("/menu");
    } catch (e) {
      toast.error(e.message || "Invalid QR or table code. Please try again.");
    }
  };

  const handleTableSubmit = () => {
    const code = manualTableNumber.trim();
    if (!code) return toast.error("Please enter a table number");
    connectByCode(code);
  };

  const handleScan = (result) => {
    if (!result || scanPaused) return;
    const code = typeof result === "string" ? result.trim() : result?.text?.trim();
    if (!code) return;
    setScanPaused(true);
    connectByCode(code);
    setTimeout(() => setScanPaused(false), 1500);
  };
  const handleScanError = () => {};

  // Place order via backend (server does table lock + validations)
    const placeOrder = async () => {
    if (!currentTable?.id) return toast.error("Please select a table first");
    if (cart.length === 0) return toast.error("Your cart is empty");
    if (!phone.trim()) return toast.error("Please enter your phone number");

    // Prepare robust payload: try id, include name as fallback
    const itemsPayload = cart.map((item) => {
      const idFromMap = menuIdByName[item.name]; // if available
      return {
        menuItemId: idFromMap || item.menuItemId || undefined,
        name: item.name,
        quantity: item.quantity,
      };
    });

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tableId: currentTable.id,
          customerPhone: phone,
          items: itemsPayload,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        // friendlier messages
        if (res.status === 404 && /Menu item/i.test(data?.error || "")) {
          return toast.error("One or more menu items were not found. Please refresh the page and try again.");
        }
        if (res.status === 409) {
          return toast.error(data?.error || "This table is currently locked for another order.");
        }
        return toast.error(data?.error || "Failed to place order");
      }

      setOrderStatus("submitted");
      toast.success("Order placed!", {
        description: `Table ${data.tableNumber} • Token ${data.tokenNumber ?? "-"} • ₹${data.total?.toFixed?.(2) ?? ""}`,
      });

      setTimeout(() => setOrderStatus("confirmed"), 2500);
      clearCart();
    } catch (err) {
      console.error("placeOrder error:", err);
      toast.error("Something went wrong placing your order");
    }
  };

  // 1) No table yet → selection screen
  if (!currentTable) {
    return (
      <div className="min-h-screen pt-16">
        <div className="max-w-md mx-auto px-4 py-20">
          <Card className="bg-slate-800/80 border-slate-700">
            <CardHeader className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-amber-500/20 rounded-full flex items-center justify-center">
                <QrCode className="w-8 h-8 text-amber-400" />
              </div>
              <CardTitle className="text-slate-100">Table Selection</CardTitle>
              <p className="text-slate-400">
                Scan QR code or enter table number manually
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="text-center">
                <Button
                  onClick={() => setShowScanner(true)}
                  variant="outline"
                  className="w-full border-amber-500/40 text-amber-400 hover:text-amber-300 hover:border-amber-400"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Scan QR Code
                </Button>
              </div>

              <div className="text-center">
                <p className="text-sm text-slate-500 mb-4">
                  Or enter table code like{" "}
                  <span className="text-slate-300 font-mono">T01</span>
                </p>
                <div className="space-y-4">
                  <Input
                    placeholder="Enter table number (e.g., T01)"
                    value={manualTableNumber}
                    onChange={(e) => setManualTableNumber(e.target.value)}
                    className="bg-slate-700 border-slate-600 text-slate-100"
                  />
                  <Button
                    onClick={handleTableSubmit}
                    className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-900 font-semibold"
                  >
                    <TableIcon className="w-4 h-4 mr-2" />
                    Connect to Table
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {showScanner && (
            <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="relative w-full max-w-md rounded-xl overflow-hidden border border-slate-700 bg-slate-900">
                <div className="flex items-center justify-between p-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Camera className="w-4 h-4 text-amber-400" />
                    <span className="text-slate-200 text-sm">Scan the table QR</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowScanner(false)}
                    className="text-slate-300 hover:text-amber-400"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                <div className="p-3">
                  <QrScanner
                    constraints={{ facingMode: "environment" }}
                    onDecode={(text) => {
                      if (!text || scanPaused) return;
                      setScanPaused(true);
                      connectByCode(text.trim());
                      setTimeout(() => setScanPaused(false), 1500);
                    }}
                    onError={() => {}}
                  />
                </div>

                <div className="p-3 border-t border-slate-800 text-xs text-slate-500">
                  Tip: The QR text should equal a known code (e.g.{" "}
                  <code>QR_T01_2024</code> or <code>T01</code>).
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // 2) Order submitted/confirmed → status UI
  if (orderStatus) {
    return (
      <div className="min-h-screen pt-16">
        <div className="max-w-md mx-auto px-4 py-20">
          <Card className="bg-slate-800/80 border-slate-700 text-center">
            <CardContent className="p-8">
              <div className="w-20 h-20 mx-auto mb-6 bg-green-500/20 rounded-full flex items-center justify-center">
                {orderStatus === "submitted" ? (
                  <Clock className="w-10 h-10 text-green-400 animate-pulse" />
                ) : (
                  <Send className="w-10 h-10 text-green-400" />
                )}
              </div>

              <h2 className="text-2xl font-bold text-slate-100 mb-4">
                {orderStatus === "submitted"
                  ? "Order Submitted!"
                  : "Order Confirmed!"}
              </h2>

              <p className="text-slate-400 mb-6">
                {orderStatus === "submitted"
                  ? "Your order has been sent to the kitchen. Please wait for confirmation."
                  : "Your order has been confirmed and is being prepared. Estimated time: 20-25 minutes."}
              </p>

              <div className="bg-slate-900/50 rounded-lg p-4 mb-6">
                <p className="text-sm text-slate-500 mb-2">
                  Table: {currentTable.number}
                </p>
                <p className="text-sm text-slate-500">Phone: {phone}</p>
              </div>

              <Button
                onClick={() => {
                  setOrderStatus(null);
                  router.push("/");
                }}
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-900 font-semibold"
              >
                Order Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // 3) Main ordering UI
  const totals = getTotals();

  return (
    <div className="min-h-screen pt-16">
      {/* Table info bar */}
      <div className="bg-amber-500 text-slate-900 py-3">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <TableIcon className="w-5 h-5" />
            <span className="font-semibold">
              Connected to {currentTable.number}
            </span>
          </div>
          <Badge className="bg-slate-900 text-amber-400">{itemCount} items</Badge>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Menu */}
          <div className="lg:col-span-2">
            <div className="mb-8">
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={activeCategory === category ? "default" : "outline"}
                    onClick={() => setActiveCategory(category)}
                    size="sm"
                    className={`rounded-full transition-all duration-300 ${
                      activeCategory === category
                        ? "bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900"
                        : "border-slate-600 text-slate-300 hover:border-amber-500 hover:text-amber-400"
                    }`}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {menuItems[activeCategory]?.map((item) => (
                <Card
                  key={item.id}
                  className="bg-slate-800/80 border-slate-700 hover:border-amber-500/30 transition-all duration-300"
                >
                  <div className="flex">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-l-lg"
                    />
                    <div className="flex-1 p-4">
                      <h4 className="font-semibold text-slate-100 mb-1">
                        {item.name}
                      </h4>
                      <p className="text-lg font-bold text-amber-400 mb-2">
                        ₹{item.price}
                      </p>
                      <Button
                        size="sm"
                        onClick={() => addToCart(item)}
                        className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-900 font-semibold text-xs px-3 py-1 rounded-full"
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        Add
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Cart */}
          <div className="lg:col-span-1">
            <Card className="bg-slate-800/80 border-slate-700 sticky top-20">
              <CardHeader>
                <CardTitle className="flex items-center text-slate-100">
                  <ShoppingCart className="w-5 h-5 mr-2 text-amber-400" />
                  Your Order
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                {cart.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingCart className="w-12 h-12 mx-auto mb-4 text-slate-600" />
                    <p className="text-slate-500">Your cart is empty</p>
                    <p className="text-sm text-slate-600">Add items from the menu</p>
                  </div>
                ) : (
                  <>
                    <ScrollArea className="h-64">
                      <div className="space-y-3">
                        {cart.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center space-x-3 bg-slate-700/30 rounded-lg p-3"
                          >
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-12 h-12 object-cover rounded"
                            />
                            <div className="flex-1">
                              <h5 className="font-medium text-slate-100 text-sm">
                                {item.name}
                              </h5>
                              <p className="text-amber-400 font-semibold">
                                ₹{item.price}
                              </p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateQuantity(item.id, -1)}
                                className="w-6 h-6 p-0 border-slate-600"
                              >
                                <Minus className="w-3 h-3" />
                              </Button>
                              <span className="text-slate-100 w-6 text-center">
                                {item.quantity}
                              </span>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateQuantity(item.id, 1)}
                                className="w-6 h-6 p-0 border-slate-600"
                              >
                                <Plus className="w-3 h-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => removeFromCart(item.id)}
                                className="w-6 h-6 p-0 text-red-400 hover:text-red-300"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>

                    <Separator />
                    <Totals {...totals} />

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-400">
                        Phone Number for Updates
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <Input
                          placeholder="+91 9380005430"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="pl-10 bg-slate-700 border-slate-600 text-slate-100"
                        />
                      </div>
                    </div>

                    <Button
                      onClick={placeOrder}
                      className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-900 font-bold py-3 shadow-lg hover:shadow-xl transition-all duration-300"
                      disabled={!phone.trim()}
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Place Order • ₹{totals.total.toFixed(2)}
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function Totals({ subtotal, tax, total }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-slate-400">
        <span>Subtotal:</span>
        <span>₹{subtotal.toFixed(2)}</span>
      </div>
      <div className="flex justify-between text-slate-400">
        <span>Tax (5%):</span>
        <span>₹{tax.toFixed(2)}</span>
      </div>
      <Separator />
      <div className="flex justify-between text-lg font-bold text-amber-400">
        <span>Total:</span>
        <span>₹{total.toFixed(2)}</span>
      </div>
    </div>
  );
}