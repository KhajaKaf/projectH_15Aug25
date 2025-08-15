"use client";

// Minimal toast store for your Toaster component.
// Provides { toasts, toast(), dismiss() }.
// This is a lightweight drop-in to make builds pass.

import * as React from "react";

let id = 0;
const LIMIT = 5;

const StoreContext = React.createContext({
  toasts: [],
  toast: () => {},
  dismiss: () => {}
});

export function useToast() {
  return React.useContext(StoreContext);
}

export function ToastStoreProvider({ children }) {
  const [toasts, setToasts] = React.useState([]);

  const toast = React.useCallback(({ title, description, action, ...props }) => {
    const next = { id: ++id, title, description, action, ...props };
    setToasts((t) => [next, ...t].slice(0, LIMIT));
    return next.id;
  }, []);

  const dismiss = React.useCallback((toastId) => {
    setToasts((t) => t.filter((x) => x.id !== toastId));
  }, []);

  const value = React.useMemo(() => ({ toasts, toast, dismiss }), [toasts, toast, dismiss]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}