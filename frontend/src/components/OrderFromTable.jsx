import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';
import { QrCode, ShoppingCart, Plus, Minus, Trash2, Send, TableIcon, Clock, Phone } from 'lucide-react';
import { menuItems, mockTables } from '../mock';
import { toast } from 'sonner';

const OrderFromTable = () => {
  const { tableId } = useParams();
  const navigate = useNavigate();
  const [currentTable, setCurrentTable] = useState(null);
  const [manualTableNumber, setManualTableNumber] = useState('');
  const [activeCategory, setActiveCategory] = useState(Object.keys(menuItems)[0]);
  const [cart, setCart] = useState([]);
  const [customerPhone, setCustomerPhone] = useState('');
  const [orderStatus, setOrderStatus] = useState(null);

  const categories = Object.keys(menuItems);
  const didWelcome = useRef(false);

  useEffect(() => {
    if (tableId) {
      const table = mockTables.find(t => t.qrCode === tableId || t.number === tableId);
      if (table) {
        setCurrentTable(table);
        toast.success(`Welcome to ${table.number}!`, {
          id: 'welcome-toast',
          description: 'Browse our menu and place your order',
        });
      }
    }
  }, [tableId]);

  const handleTableSubmit = () => {
    if (!manualTableNumber.trim()) {
      toast.error("Please enter a table number");
      return;
    }
    
    const table = mockTables.find(t => 
      t.number.toLowerCase() === manualTableNumber.toLowerCase() ||
      t.number === manualTableNumber
    );
    
    if (table) {
      setCurrentTable(table);
      toast.success(`Connected to ${table.number}!`);
    } else {
      toast.error("Table not found. Please check the number and try again.");
    }
  };

  // inside a component
  const didInit = useRef(false);
    useEffect(() => {
      if (didInit.current) return; // prevents second dev mount from running logic
      didInit.current = true;

      // do one-time setup: subscribe, fetch, toast, etc.
      return () => {
        // clean up subscriptions/timers here
      };
  }, []);

  const addToCart = (item) => {
    setCart(prev => {
      const existingItem = prev.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prev.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    toast.success(`${item.name} added to cart!`);
  };

  const updateQuantity = (id, change) => {
    setCart(prev => 
      prev.map(item => {
        if (item.id === id) {
          const newQuantity = Math.max(0, item.quantity + change);
          return newQuantity === 0 ? null : { ...item, quantity: newQuantity };
        }
        return item;
      }).filter(Boolean)
    );
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
    toast.info("Item removed from cart");
  };

  const getCartTotal = () => {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.05; // 5% tax
    return { subtotal, tax, total: subtotal + tax };
  };

  const placeOrder = () => {
    if (!currentTable) {
      toast.error("Please select a table first");
      return;
    }
    
    if (cart.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    if (!customerPhone.trim()) {
      toast.error("Please enter your phone number");
      return;
    }

    const { subtotal, tax, total } = getCartTotal();
    const order = {
      id: `ORD${Date.now()}`,
      tableNumber: currentTable.number,
      items: cart,
      subtotal,
      tax,
      total,
      customerPhone,
      status: 'pending',
      timestamp: new Date().toISOString()
    };

    // Mock order placement
    setOrderStatus('submitted');
    toast.success("Order placed successfully!", {
      description: `Order #${order.id} sent to kitchen. You'll receive updates via SMS.`
    });

    // Simulate manager response after 3 seconds
    setTimeout(() => {
      setOrderStatus('confirmed');
      toast.success("Order confirmed by manager!", {
        description: "Estimated serving time: 20-25 minutes"
      });
    }, 3000);

    // Clear cart after placing order
    setCart([]);
  };

  const { subtotal, tax, total } = getCartTotal();

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
              <p className="text-slate-400">Scan QR code or enter table number manually</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <p className="text-sm text-slate-500 mb-4">
                  Scan the QR code on your table or enter table number below
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
        </div>
      </div>
    );
  }

  if (orderStatus) {
    return (
      <div className="min-h-screen pt-16">
        <div className="max-w-md mx-auto px-4 py-20">
          <Card className="bg-slate-800/80 border-slate-700 text-center">
            <CardContent className="p-8">
              <div className="w-20 h-20 mx-auto mb-6 bg-green-500/20 rounded-full flex items-center justify-center">
                {orderStatus === 'submitted' ? (
                  <Clock className="w-10 h-10 text-green-400 animate-pulse" />
                ) : (
                  <Send className="w-10 h-10 text-green-400" />
                )}
              </div>
              
              <h2 className="text-2xl font-bold text-slate-100 mb-4">
                {orderStatus === 'submitted' ? 'Order Submitted!' : 'Order Confirmed!'}
              </h2>
              
              <p className="text-slate-400 mb-6">
                {orderStatus === 'submitted' 
                  ? 'Your order has been sent to the kitchen. Please wait for confirmation.'
                  : 'Your order has been confirmed and is being prepared. Estimated time: 20-25 minutes.'
                }
              </p>

              <div className="bg-slate-900/50 rounded-lg p-4 mb-6">
                <p className="text-sm text-slate-500 mb-2">Table: {currentTable.number}</p>
                <p className="text-sm text-slate-500">Phone: {customerPhone}</p>
              </div>

              <Button
                onClick={() => {
                  setOrderStatus(null);
                  navigate('/');
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

  return (
    <div className="min-h-screen pt-16">
      {/* Table Info Bar */}
      <div className="bg-amber-500 text-slate-900 py-3">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <TableIcon className="w-5 h-5" />
            <span className="font-semibold">Connected to {currentTable.number}</span>
          </div>
          <Badge className="bg-slate-900 text-amber-400">
            {cart.reduce((sum, item) => sum + item.quantity, 0)} items
          </Badge>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Menu Section */}
          <div className="lg:col-span-2">
            {/* Category Navigation */}
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
                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900'
                        : 'border-slate-600 text-slate-300 hover:border-amber-500 hover:text-amber-400'
                    }`}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>

            {/* Menu Items */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {menuItems[activeCategory]?.map((item) => (
                <Card key={item.id} className="bg-slate-800/80 border-slate-700 hover:border-amber-500/30 transition-all duration-300">
                  <div className="flex">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-l-lg"
                    />
                    <div className="flex-1 p-4">
                      <h4 className="font-semibold text-slate-100 mb-1">{item.name}</h4>
                      <p className="text-lg font-bold text-amber-400 mb-2">₹{item.price}</p>
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

          {/* Cart Section */}
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
                          <div key={item.id} className="flex items-center space-x-3 bg-slate-700/30 rounded-lg p-3">
                            <img 
                              src={item.image} 
                              alt={item.name}
                              className="w-12 h-12 object-cover rounded"
                            />
                            <div className="flex-1">
                              <h5 className="font-medium text-slate-100 text-sm">{item.name}</h5>
                              <p className="text-amber-400 font-semibold">₹{item.price}</p>
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
                              <span className="text-slate-100 w-6 text-center">{item.quantity}</span>
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

                    {/* Totals */}
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

                    {/* Customer Phone */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-400">Phone Number for Updates</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <Input
                          placeholder="+91 9380005430"
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                          className="pl-10 bg-slate-700 border-slate-600 text-slate-100"
                        />
                      </div>
                    </div>

                    {/* Place Order Button */}
                    <Button
                      onClick={placeOrder}
                      className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-900 font-bold py-3 shadow-lg hover:shadow-xl transition-all duration-300"
                      disabled={!customerPhone.trim()}
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Place Order • ₹{total.toFixed(2)}
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
};

export default OrderFromTable;