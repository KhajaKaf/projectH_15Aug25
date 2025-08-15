// app/api/orders/[id]/ready/route.js
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { pusherServer, toPublicOrder } from "@/lib/pusher";

export async function POST(_req, { params }) {
  try {
    const id = params.id;

    // Load for validation + emits
    const order = await prisma.order.findUnique({
      where: { id },
      include: { table: true },
    });
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Guard: only IN_PROGRESS → READY
    if (order.status !== "IN_PROGRESS") {
      return NextResponse.json(
        { error: "Only IN_PROGRESS → READY allowed" },
        { status: 409 }
      );
    }

    // Update and include relations for emit
    const updated = await prisma.order.update({
      where: { id: params.id },
      data: { status: 'READY' },
      include: {
        table: { select: { number: true } },
        orderItems: { include: { menuItem: true } }
      }
    });

    await prisma.orderEvent.create({
      data: { orderId: id, status: "READY", notes: "Order ready to serve" },
    });

    // Emits (best-effort)
    try {
      /* await pusherServer.trigger("private-admin", "order.ready", {
        orderId: id,
        tableNumber: updated.table?.number,
      }); */
      await pusherServer.trigger("public-orders", "order.updated", toPublicOrder(order));
      await pusherServer.trigger(
        `private-table-${updated.tableId}`,
        "order.ready",
        { orderId: id }
      );

      // Public board update (PII-free)
      await pusherServer.trigger(
        "public-orders",
        "order.updated",
        toPublicOrder(updated)
      );
    } catch (err) {
      console.error("Pusher emit failed (ready):", err);
    }

    return NextResponse.json({ ok: true, order: updated });
  } catch (e) {
    console.error("ready error", e);
    return NextResponse.json({ error: "Failed to mark ready" }, { status: 500 });
  }
}