import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher";

// Only active columns shown on the public board
const ACTIVE = new Set(["NEW", "CONFIRMED", "IN_PROGRESS", "READY"]);

export async function POST(_req, { params }) {
  const id = params.id;

  try {
    // Load order with table (we’ll need tableId to free it)
    const order = await prisma.order.findUnique({
      where: { id },
      include: { table: true },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Business rule: allow delete only when it's still NEW
    // (You can extend to allow CONFIRMED if you want)
    if (order.status !== "NEW") {
      return NextResponse.json(
        { error: "Only NEW orders can be deleted" },
        { status: 409 }
      );
    }

    // Delete in a transaction: payment → order (items/events are cascading in your schema)
    await prisma.$transaction(async (tx) => {
      // Clear currentOrder on the table if pointing to this order
      if (order.tableId) {
        await tx.table.update({
          where: { id: order.tableId },
          data: {
            // If this order was occupying the table, free it
            status: "AVAILABLE",
            currentOrderId: null,
          },
        });
      }

      // Delete payment if any
      await tx.payment.deleteMany({ where: { orderId: id } });

      // Finally delete the order (order_items, order_events are ON DELETE CASCADE)
      await tx.order.delete({ where: { id } });
    });

    // Emit to admin/table (informational)
    try {
      await pusherServer.trigger("private-admin", "order.deleted", { orderId: id });
      if (order.tableId) {
        await pusherServer.trigger(
          `private-table-${order.tableId}`,
          "order.deleted",
          { orderId: id }
        );
      }

      // IMPORTANT: Make the public board drop it.
      // The board listens to 'order.updated' and removes items not in ACTIVE.
      // Send a minimal payload with a non-active status.
      await pusherServer.trigger("public-orders", "order.updated", {
        id,
        status: "CANCELLED",
      });
    } catch (e) {
      console.error("pusher delete emit error", e);
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("delete order error", e);
    return NextResponse.json(
      { error: "Failed to delete order" },
      { status: 500 }
    );
  }
}