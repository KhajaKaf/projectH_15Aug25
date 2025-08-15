import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { toPublicOrder } from "@/lib/pusher";

const ACTIVE = ["NEW", "CONFIRMED", "IN_PROGRESS", "READY"];

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      where: { status: { in: ACTIVE } },
      orderBy: { createdAt: "desc" },
      include: {
        table: { select: { number: true } },
        orderItems: {
          include: {
            menuItem: { select: { name: true } },
          },
        },
      },
    });

    // Map to PII-free public shape with names
    const publicOrders = orders.map(toPublicOrder);
    return NextResponse.json({ orders: publicOrders });
  } catch (e) {
    console.error("active orders error", e);
    return NextResponse.json(
      { error: "Failed to fetch active orders" },
      { status: 500 }
    );
  }
}