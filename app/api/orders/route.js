import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { pusherServer, toPublicOrder } from "@/lib/pusher";
import { emitAdmin, emitTable, emitPublicOrder, EVENTS } from "@/lib/pusher";

const ACTIVE_STATUSES = [
  "NEW",
  "CONFIRMED",
  "IN_PROGRESS",
  "READY",
  "DELIVERED",
  "PAYMENT_PENDING",
];

// Strict input validation
const OrderItemSchema = z.object({
  menuItemId: z.string().optional(),   // allow either id or name
  name: z.string().optional(),
  quantity: z.number().int().positive(),
});

const CreateOrderSchema = z.object({
  tableId: z.string().min(1, "tableId required"),
  customerPhone: z.string().min(8).max(20).optional(),
  items: z.array(OrderItemSchema).min(1, "at least 1 item required"),
});

export async function POST(request) {
  try {
    // Enforce JSON content-type early (defensive)
    const contentType = request.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      return NextResponse.json({ error: "Invalid content-type" }, { status: 415 });
    }

    const body = await request.json();
    const parsed = CreateOrderSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid payload", issues: parsed.error.issues },
        { status: 400 }
      );
    }

    const { tableId, customerPhone, items } = parsed.data;

    // Transactional create
    const { order } = await prisma.$transaction(async (tx) => {
      const table = await tx.table.findUnique({
        where: { id: String(tableId) },
      });
      if (!table) {
        const e = new Error("TABLE_NOT_FOUND");
        throw e;
      }

      // Prevent multiple active orders for same table
      const open = await tx.order.findFirst({
        where: { tableId: String(tableId), status: { in: ACTIVE_STATUSES } },
        select: { id: true, status: true },
      });
      if (open) {
        const err = new Error("TABLE_LOCKED");
        err.meta = open;
        throw err;
      }

      // Build items and totals
      let subtotal = 0;
      const orderItemsCreate = [];

      for (const it of items) {
        if (!it?.quantity || it.quantity <= 0) {
          const e = new Error("INVALID_ITEM");
          e.meta = { reason: "bad_quantity" };
          throw e;
        }

        let menuItem = null;

        if (it?.menuItemId) {
          menuItem = await tx.menuItem.findUnique({
            where: { id: String(it.menuItemId) },
          });
        } else if (it?.name) {
          menuItem = await tx.menuItem.findFirst({
            where: { name: it.name },
          });
        }

        if (!menuItem) {
          const e = new Error("MENU_ITEM_NOT_FOUND");
          e.meta = { id: it?.menuItemId, name: it?.name };
          throw e;
        }

        if (!menuItem.isAvailable) {
          const e = new Error("MENU_ITEM_UNAVAILABLE");
          e.meta = { name: menuItem.name };
          throw e;
        }

        const line = menuItem.price * it.quantity;
        subtotal += line;

        orderItemsCreate.push({
          menuItemId: menuItem.id,
          quantity: it.quantity,
          unitPrice: menuItem.price,
          totalPrice: line,
        });
      }

      const tax = Math.round(subtotal * 0.05);
      const total = subtotal + tax;

      // Allocate sequential token per day
      const now = new Date();
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

      const { _max } = await tx.order.aggregate({
        _max: { tokenNumber: true },
        where: { createdAt: { gte: startOfDay, lt: endOfDay } },
      });
      const nextToken = (_max?.tokenNumber ?? 0) + 1;

      // Create order
      const createdOrder = await tx.order.create({
        data: {
          tableId: String(tableId),
          customerPhone: customerPhone || null,
          subtotal,
          tax,
          total,
          status: "NEW",
          tokenNumber: nextToken,
          orderItems: { create: orderItemsCreate },
        },
        include: {
          table: { select: { number: true } },
          orderItems: { include: { menuItem: true } },
        },
      });

      await tx.orderEvent.create({
        data: { orderId: createdOrder.id, status: "NEW", notes: "Order placed by customer" },
      });

      // Occupy table
      await tx.table.update({
        where: { id: String(tableId) },
        data: { status: "OCCUPIED", currentOrderId: createdOrder.id },
      });

      return { order: createdOrder };
    });

    // Public channel (optional)
    try {
      await pusherServer.trigger("public-orders", "order.created", toPublicOrder(order));
    } catch (e) {
      console.error("Pusher public trigger failed:", e);
    }

    // Realtime fanout (admin, table, public)
    try {
      await Promise.all([
        emitAdmin(EVENTS.ORDER_CREATED, {
          orderId: order.id,
          tableNumber: order.table.number,
          items: order.orderItems,
          total: order.total,
          tokenNumber: order.tokenNumber,
          customerPhone: order.customerPhone,
          timestamp: order.createdAt,
        }),
        emitTable(order.tableId, EVENTS.ORDER_CREATED, {
          orderId: order.id,
          status: order.status,
          total: order.total,
          tokenNumber: order.tokenNumber,
          estimatedTime: order.estimatedTime ?? null,
        }),
        emitPublicOrder(EVENTS.ORDER_CREATED, order),
      ]);
    } catch (e) {
      console.error("Pusher notification failed:", e);
    }

    return NextResponse.json(
      {
        orderId: order.id,
        status: order.status,
        total: order.total,
        subtotal: order.subtotal,
        tax: order.tax,
        tokenNumber: order.tokenNumber,
        estimatedTime: order.estimatedTime,
        tableNumber: order.table.number,
        items: order.orderItems,
      },
      { status: 201 }
    );
  } catch (error) {
    switch (error?.message) {
      case "TABLE_NOT_FOUND":
        return NextResponse.json({ error: "Table not found" }, { status: 404 });
      case "TABLE_LOCKED":
        return NextResponse.json(
          { error: "This table is currently occupied. Please choose another table." },
          { status: 409 }
        );
      case "INVALID_ITEM":
        return NextResponse.json({ error: "One or more items are invalid" }, { status: 400 });
      case "MENU_ITEM_NOT_FOUND":
        return NextResponse.json({ error: "A menu item was not found" }, { status: 404 });
      case "MENU_ITEM_UNAVAILABLE":
        return NextResponse.json({ error: "An item is unavailable" }, { status: 400 });
      default:
        console.error("Create order error:", error);
        return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
    }
  }
}

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
      include: {
        table: true,
        orderItems: { include: { menuItem: true } },
      },
    });
    return NextResponse.json({ orders });
  } catch (error) {
    console.error("Get orders error:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}