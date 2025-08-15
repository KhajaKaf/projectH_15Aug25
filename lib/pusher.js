// lib/pusher.js
import Pusher from "pusher";

// --- Server (Node) instance
export const pusherServer = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
  useTLS: true,
});

// --- Channel names
export const CHANNELS = {
  ADMIN: "private-admin",
  PUBLIC_ORDERS: "public-orders",
  TABLE_PREFIX: "private-table-", // + tableId
};

// --- Event names
export const EVENTS = {
  ORDER_CREATED: "order.created",
  ORDER_UPDATED: "order.updated",
  ORDER_STATUS_UPDATED: "order-status-updated", // private admin convenience
};

// --- Public, PII-safe formatter
export function toPublicOrder(o) {
  const names = (o.orderItems || [])
    .map((it) => it?.menuItem?.name)
    .filter(Boolean);

  return {
    id: o.id,
    tableNumber: o.table?.number ?? o.tableNumber,
    status: o.status,
    total: o.total,
    createdAt: o.createdAt,
    itemsCount: o.orderItems?.length ?? 0,
    itemNames: names, // <-- new
  };
}

// --- Emit helpers
export async function emitPublicOrder(event, orderOrPojo) {
  const payload =
    orderOrPojo?.table || orderOrPojo?.orderItems
      ? toPublicOrder(orderOrPojo)
      : orderOrPojo; // already trimmed
  try {
    await pusherServer.trigger(CHANNELS.PUBLIC_ORDERS, event, payload);
  } catch (e) {
    console.error("Pusher public emit failed:", e);
  }
}

export async function emitAdmin(event, payload) {
  try {
    await pusherServer.trigger(CHANNELS.ADMIN, event, payload);
  } catch (e) {
    console.error("Pusher admin emit failed:", e);
  }
}

export async function emitTable(tableId, event, payload) {
  try {
    await pusherServer.trigger(`${CHANNELS.TABLE_PREFIX}${tableId}`, event, payload);
  } catch (e) {
    console.error("Pusher table emit failed:", e);
  }
}

// --- (Optional) Convenience: fetch an order WITH relations, then emit
// Use this if you don't already have `table` and `orderItems` in hand.
export async function fetchOrderWithRelations(prisma, orderId) {
  return prisma.order.findUnique({
    where: { id: orderId },
    include: { table: true, orderItems: true },
  });
}

// --- Browser-side factory (lazy)
export const pusherClient = typeof window !== "undefined" ? require("pusher-js") : null;

export const getPusherClient = () => {
  if (typeof window === "undefined") return null;
  const PusherJS = require("pusher-js");
  return new PusherJS(process.env.NEXT_PUBLIC_PUSHER_KEY, {
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
    // This matches your existing auth route pattern for private channels
    channelAuthorization: {
      endpoint: "/api/pusher/auth",
      transport: "ajax",
    },
    forceTLS: true,
    // optional niceties
    disableStats: true,
    enabledTransports: ["ws", "wss"],
  });
};