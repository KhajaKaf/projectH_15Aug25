// app/api/orders/[id]/mark-paid/route.js
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { pusherServer, toPublicOrder } from "@/lib/pusher";

export async function POST(_req, { params }) {
  const id = params?.id;
  if (!id) return NextResponse.json({ error: "Missing order id" }, { status: 400 });

  try {
    // Load current order state for guards
    const existing = await prisma.order.findUnique({
      where: { id },
      //include: { table: true },
      include: { table: true, orderItems: true },
    });
    if (!existing) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Allow mark-paid from READY / DELIVERED / PAYMENT_PENDING
    if (!["READY", "DELIVERED", "PAYMENT_PENDING"].includes(existing.status)) {
      return NextResponse.json(
        { error: "Order not eligible for Mark as Paid" },
        { status: 409 }
      );
    }

    // Transaction: set order PAID, add event, free table
    const updated = await prisma.$transaction(async (tx) => {
      const paidOrder = await tx.order.update({
        where: { id },
        data: { status: "PAID" },
        include: { table: true, orderItems: true }, // include relations for emits
      });

      await tx.orderEvent.create({
        data: {
          orderId: id,
          status: "PAID",
          notes: "Payment confirmed by manager",
        },
      });

      // Free the table
      await tx.table.update({
        where: { id: paidOrder.tableId },
        data: { status: "AVAILABLE", currentOrderId: null },
      });

      return paidOrder;
    });

    // Real-time emits (best-effort)
    try {
      // Admin lane
      /* await pusherServer.trigger("private-admin", "order.paid", {
        orderId: id,
        tableNumber: updated.table?.number,
      }); */
      await pusherServer.trigger("public-orders", "order.updated", toPublicOrder(order));
      // Table lane
      await pusherServer.trigger(
        `private-table-${updated.tableId}`,
        "order.updated",
        { id: updated.id, status: updated.status }
      );

      // Public board (PII-free). Still emit order.updated;
      // the board will remove non-active statuses on receipt.
      await pusherServer.trigger(
        "public-orders",
        "order.updated",
        toPublicOrder(updated)
      );
    } catch (e) {
      console.error("Pusher emit failed (mark-paid):", e);
    }

    return NextResponse.json({ ok: true, orderId: updated.id, status: updated.status });
  } catch (e) {
    console.error("mark-paid error", e);
    return NextResponse.json({ error: "Failed to mark paid" }, { status: 500 });
  }
}