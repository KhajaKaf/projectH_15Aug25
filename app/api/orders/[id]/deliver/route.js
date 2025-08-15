// app/api/orders/[id]/deliver/route.js
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { pusherServer, toPublicOrder } from "@/lib/pusher";

export async function POST(_req, { params }) {
  const id = params?.id;
  if (!id) {
    return NextResponse.json({ error: "Missing order id" }, { status: 400 });
  }

  try {
    // 1) Load order (with relations for emits)
    const existing = await prisma.order.findUnique({
      where: { id },
      include: { table: true, orderItems: true },
    });
    if (!existing) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Guard: ONLY READY -> DELIVERED
    if (existing.status !== "READY") {
      return NextResponse.json(
        { error: "Only READY → DELIVERED allowed" },
        { status: 409 }
      );
    }

    // 2) Update status
    const order = await prisma.order.update({
      where: { id },
      data: { status: "DELIVERED" },
      include: {
        table: { select: { number: true } },
        orderItems: { include: { menuItem: true } }
      }
    });

    // 3) Audit trail
    await prisma.orderEvent.create({
      data: { orderId: id, status: "DELIVERED", notes: "Served to table" },
    });

    // 4) Real-time emits (best-effort)
    try {
      // Admin lane
      /* await pusherServer.trigger("private-admin", "order.delivered", {
        orderId: id,
        tableNumber: order.table?.number,
      }); */
      await pusherServer.trigger("public-orders", "order.updated", toPublicOrder(order));

      // Table lane
      await pusherServer.trigger(
        `private-table-${order.tableId}`,
        "order.updated",
        { id: order.id, status: order.status }
      );

      // Public board (PII-free)
      await pusherServer.trigger(
        "public-orders",
        "order.updated",
        toPublicOrder(order)
      );
    } catch (e) {
      console.error("Pusher emit failed (deliver):", e);
    }

    return NextResponse.json({ ok: true, orderId: order.id, status: order.status });
  } catch (e) {
    console.error("deliver error", e);
    return NextResponse.json({ error: "Failed to deliver" }, { status: 500 });
  }
}