// app/api/tables/lookup/route.js
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const code = (searchParams.get("code") || "").trim().toUpperCase();
  if (!code) return NextResponse.json({ error: "Missing code" }, { status: 400 });

  // match either number (T01) or qrCode (QR_T01_2024)
  const table = await prisma.table.findFirst({
    where: {
      OR: [{ number: code }, { qrCode: code }],
    },
    select: { id: true, number: true, qrCode: true, status: true, currentOrderId: true },
  });

  if (!table) return NextResponse.json({ error: "Table not found" }, { status: 404 });
  return NextResponse.json({ table });
}