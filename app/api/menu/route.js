import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// prevent caching while you iterate
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { displayOrder: "asc" },
      include: {
        menuItems: {
          where: { isAvailable: true },
          orderBy: { name: "asc" },
          select: {
            id: true,
            name: true,
            price: true,
            image: true,
            description: true,
            isAvailable: true,
            categoryId: true,
          },
        },
      },
    });

    // Flatten items for consumers that only need id/name/price etc.
    const items = categories.flatMap((cat) =>
      cat.menuItems.map((mi) => ({
        ...mi,
        categoryName: cat.name,
      }))
    );

    return NextResponse.json({ categories, items });
  } catch (err) {
    console.error("GET /api/menu error:", err);
    return NextResponse.json(
      { error: "Failed to fetch menu" },
      { status: 500 }
    );
  }
}