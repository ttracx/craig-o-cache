import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - List all stores for user
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get("userId") || "demo-user";

  try {
    const stores = await prisma.cacheStore.findMany({
      where: { userId },
      include: {
        _count: { select: { cacheKeys: true } },
        cacheKeys: {
          select: { hits: true, misses: true, sizeBytes: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const storesWithStats = stores.map((store) => {
      const totalHits = store.cacheKeys.reduce((sum, k) => sum + k.hits, 0);
      const totalMisses = store.cacheKeys.reduce((sum, k) => sum + k.misses, 0);
      const memoryUsed = store.cacheKeys.reduce((sum, k) => sum + k.sizeBytes, 0);

      return {
        id: store.id,
        name: store.name,
        description: store.description,
        keyCount: store._count.cacheKeys,
        totalHits,
        totalMisses,
        hitRate: totalHits + totalMisses > 0 ? (totalHits / (totalHits + totalMisses)) * 100 : 0,
        memoryUsed,
        maxMemoryMB: store.maxMemoryMB,
        createdAt: store.createdAt,
      };
    });

    return NextResponse.json({ stores: storesWithStats });
  } catch (error) {
    console.error("Stores GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST - Create new store
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, maxMemoryMB = 100, userId = "demo-user" } = body;

    if (!name) {
      return NextResponse.json({ error: "name required" }, { status: 400 });
    }

    const store = await prisma.cacheStore.create({
      data: {
        name,
        description,
        maxMemoryMB,
        userId,
      },
    });

    return NextResponse.json({ success: true, store });
  } catch (error: unknown) {
    if (error && typeof error === "object" && "code" in error && error.code === "P2002") {
      return NextResponse.json({ error: "Store name already exists" }, { status: 409 });
    }
    console.error("Stores POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE - Delete store
export async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const storeId = searchParams.get("storeId");

  if (!storeId) {
    return NextResponse.json({ error: "storeId required" }, { status: 400 });
  }

  try {
    await prisma.cacheStore.delete({
      where: { id: storeId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Stores DELETE error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
