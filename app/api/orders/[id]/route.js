// app/api/orders/[id]/route.js
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_req, { params }) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: {
        table: true,
        orderItems: { include: { menuItem: true } },
      },
    });
    if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ order });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 });
  }
}