// app/api/orders/[id]/confirm/route.js
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { pusherServer, toPublicOrder } from "@/lib/pusher";

/**
 * Transition order NEW -> CONFIRMED (optionally set ETA)
 * Body: { etaMinutes?: number }
 */
export async function POST(req, { params }) {
  const orderId = params?.id;
  if (!orderId) {
    return NextResponse.json({ error: "Missing order id" }, { status: 400 });
  }

  try {
    const { etaMinutes } = await safeJson(req);

    // 1) Load current order (with relations for emits later)
    const existing = await prisma.order.findUnique({
      where: { id: orderId },
      include: { table: true, orderItems: true },
    });

    if (!existing) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Guard: only allow NEW -> CONFIRMED
    if (existing.status !== "NEW") {
      return NextResponse.json(
        {
          error: `Invalid transition: cannot confirm order in status "${existing.status}".`,
        },
        { status: 409 }
      );
    }

    // 2) Update -> CONFIRMED
    const order = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: "CONFIRMED",
        estimatedTime:
          typeof etaMinutes === "number"
            ? Math.max(0, Math.floor(etaMinutes))
            : null,
      },
      include: {
        table: { select: { number: true } },
        orderItems: { include: { menuItem: true } 
      }, // 
  },
    });

    // 3) Append order event (audit trail)
    await prisma.orderEvent.create({
      data: {
        orderId: order.id,
        status: "CONFIRMED",
        notes:
          typeof etaMinutes === "number"
            ? `Manager confirmed. ETA ${etaMinutes} min.`
            : "Manager confirmed.",
      },
    });

    // 4) Real-time emits (best-effort)
    try {
      // Admin stream (your existing dashboard)
      /* await pusherServer.trigger("private-admin", "order-status-updated", {
        id: order.id,
        status: order.status,
        tableNumber: order.table?.number,
        eta: order.estimatedTime,
      }); */

      await pusherServer.trigger("public-orders", "order.updated", toPublicOrder(order));

      // Table-specific stream (so guest at that table sees it immediately)
      await pusherServer.trigger(
        `private-table-${order.tableId}`,
        "order.updated",
        {
          id: order.id,
          status: order.status,
          estimatedTime: order.estimatedTime,
        }
      );

      // Public board (PII-free)
      await pusherServer.trigger(
        "public-orders",
        "order.updated",
        toPublicOrder(order)
      );
    } catch (e) {
      // Non-blocking
      console.error("Pusher emit failed (confirm):", e);
    }

    return NextResponse.json({
      ok: true,
      orderId: order.id,
      status: order.status,
      estimatedTime: order.estimatedTime,
    });
  } catch (err) {
    console.error("Confirm route error:", err);
    return NextResponse.json(
      { error: "Failed to confirm order" },
      { status: 500 }
    );
  }
}

/** Safely parse JSON body; returns {} on empty */
async function safeJson(req) {
  try {
    if (!req.body) return {};
    return await req.json();
  } catch {
    return {};
  }
}