// app/api/orders/[id]/progress/route.js
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { pusherServer, toPublicOrder } from "@/lib/pusher";

export async function POST(_req, { params }) {
  try {
    const id = params.id;

    // Load with table to validate + for emits
    const order = await prisma.order.findUnique({
      where: { id },
      include: { table: true },
    });
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Guard: only CONFIRMED → IN_PROGRESS
    if (order.status !== "CONFIRMED") {
      return NextResponse.json(
        { error: "Only CONFIRMED → IN_PROGRESS allowed" },
        { status: 409 }
      );
    }

    // Update + capture relations for emit
    const updated = await prisma.order.update({
      where: { id },
      data: { status: "IN_PROGRESS" },
      include: {
        table: { select: { number: true } },
        orderItems: { include: { menuItem: true } }
      }
    });

    await prisma.orderEvent.create({
      data: { orderId: id, status: "IN_PROGRESS", notes: "Kitchen started preparing" },
    });

    // Emits (best-effort)
    try {
      // Admin & table channels (private)
      /* await pusherServer.trigger("private-admin", "order.in_progress", {
        orderId: id,
        tableNumber: updated.table?.number,
      }); */
      await pusherServer.trigger("public-orders", "order.updated", toPublicOrder(order));
      await pusherServer.trigger(
        `private-table-${updated.tableId}`,
        "order.in_progress",
        { orderId: id }
      );

      // Public (PII-free) board
      await pusherServer.trigger(
        "public-orders",
        "order.updated",
        toPublicOrder(updated)
      );
    } catch (err) {
      console.error("Pusher emit failed (progress):", err);
    }

    return NextResponse.json({ ok: true, order: updated });
  } catch (e) {
    console.error("progress error", e);
    return NextResponse.json({ error: "Failed to start" }, { status: 500 });
  }
}