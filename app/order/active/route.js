import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { toPublicOrder } from "@/lib/pusher";

const ACTIVE = ["NEW", "CONFIRMED", "IN_PROGRESS", "READY"];

export async function GET() {
  try {
    const rows = await prisma.order.findMany({
      where: { status: { in: ACTIVE } },
      orderBy: { createdAt: "desc" },
      take: 200,
      include: { table: true, orderItems: true },
    });
    return NextResponse.json({ orders: rows.map(toPublicOrder) });
  } catch (e) {
    console.error("active orders error", e);
    return NextResponse.json({ orders: [] }, { status: 500 });
  }
}