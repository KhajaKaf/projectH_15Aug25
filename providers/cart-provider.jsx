"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);
const STORAGE_KEY = "kks_cart_v1";

export function CartProvider({ children }) {
  const [tableNumber, setTableNumber] = useState(null);
  const [cart, setCart] = useState([]); // [{id,name,price,image,quantity}]
  const [phone, setPhone] = useState("");

  // hydrate from localStorage
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (saved) {
        setTableNumber(saved.tableNumber ?? null);
        setCart(Array.isArray(saved.cart) ? saved.cart : []);
        setPhone(saved.phone ?? "");
      }
    } catch {}
  }, []);

  // persist
  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ tableNumber, cart, phone })
    );
  }, [tableNumber, cart, phone]);

  const addToCart = (item) => {
    setCart((prev) => {
      const i = prev.findIndex((x) => x.id === item.id);
      if (i >= 0) {
        const next = [...prev];
        next[i] = { ...next[i], quantity: next[i].quantity + 1 };
        return next;
        }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const updateQuantity = (id, change) => {
    setCart((prev) =>
      prev
        .map((it) => {
          if (it.id === id) {
            const q = Math.max(0, (it.quantity || 0) + change);
            return q === 0 ? null : { ...it, quantity: q };
          }
          return it;
        })
        .filter(Boolean)
    );
  };

  const removeFromCart = (id) => setCart((prev) => prev.filter((x) => x.id !== id));
  const clearCart = () => setCart([]);

  const getTotals = () => {
    const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
    const tax = subtotal * 0.05;
    return { subtotal, tax, total: subtotal + tax };
  };

  const itemCount = cart.reduce((s, i) => s + i.quantity, 0);

  const value = useMemo(
    () => ({
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
    }),
    [tableNumber, cart, phone, itemCount]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider />");
  return ctx;
}