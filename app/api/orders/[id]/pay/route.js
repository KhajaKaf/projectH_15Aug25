// app/api/orders/[id]/pay/route.js
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { pusherServer, toPublicOrder } from "@/lib/pusher";

export async function POST(_req, { params }) {
  const id = params?.id;
  if (!id) return NextResponse.json({ error: "Missing order id" }, { status: 400 });

  try {
    // Load order for guard checks
    const existing = await prisma.order.findUnique({
      where: { id },
      include: { table: true },
    });
    if (!existing) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Hard stops
    if (existing.status === "PAID") {
      return NextResponse.json({ error: "Order already paid" }, { status: 409 });
    }

    // Idempotency: if already in PAYMENT_PENDING, just return payload again
    if (existing.status === "PAYMENT_PENDING") {
      const qrPayload = process.env.PAY_QR_VALUE || "PAY_QR_NOT_SET";
      return NextResponse.json({ ok: true, order: existing, qrPayload });
    }

    // Policy: allow entering payment after READY or DELIVERED
    if (!["READY", "DELIVERED"].includes(existing.status)) {
      return NextResponse.json(
        { error: "Can enter payment only after READY/DELIVERED" },
        { status: 409 }
      );
    }

    // Transition & lock the table
    const updated = await prisma.$transaction(async (tx) => {
      const u = await tx.order.update({
        where: { id },
        data: { status: "PAYMENT_PENDING" },
        include: { table: true, orderItems: true }, // include for emit
      });

      await tx.table.update({
        where: { id: u.tableId },
        data: { status: "LOCKED_FOR_BILLING", currentOrderId: u.id },
      });

      await tx.orderEvent.create({
        data: {
          orderId: id,
          status: "PAYMENT_PENDING",
          notes: "Payment initiated (static QR)",
        },
      });

      return u;
    });

    // Emits (best-effort)
    try {
      /* await pusherServer.trigger("private-admin", "order.payment_pending", {
        orderId: id,
        tableNumber: updated.table?.number,
      }); */
      await pusherServer.trigger("public-orders", "order.updated", toPublicOrder(order));

      await pusherServer.trigger(
        `private-table-${updated.tableId}`,
        "order.updated",
        { id: updated.id, status: updated.status }
      );

      // Public board (PII-free)
      await pusherServer.trigger(
        "public-orders",
        "order.updated",
        toPublicOrder(updated)
      );
    } catch (e) {
      console.error("Pusher emit failed (pay):", e);
    }

    const qrPayload = process.env.PAY_QR_VALUE || "PAY_QR_NOT_SET";
    return NextResponse.json({ ok: true, order: updated, qrPayload });
  } catch (e) {
    console.error("pay error", e);
    return NextResponse.json({ error: "Failed to enter payment" }, { status: 500 });
  }
}