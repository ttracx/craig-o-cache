import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Get analytics for a store
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const storeId = searchParams.get("storeId");
  const period = searchParams.get("period") || "24h";

  if (!storeId) {
    return NextResponse.json({ error: "storeId required" }, { status: 400 });
  }

  try {
    // Calculate time range
    const now = new Date();
    let startTime: Date;
    switch (period) {
      case "1h":
        startTime = new Date(now.getTime() - 60 * 60 * 1000);
        break;
      case "24h":
        startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case "7d":
        startTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "30d":
        startTime = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    }

    // Get analytics records
    const analytics = await prisma.cacheAnalytics.findMany({
      where: {
        storeId,
        timestamp: { gte: startTime },
      },
      orderBy: { timestamp: "asc" },
    });

    // Get current store stats
    const store = await prisma.cacheStore.findUnique({
      where: { id: storeId },
      include: {
        cacheKeys: {
          select: { hits: true, misses: true, sizeBytes: true, expiresAt: true },
        },
      },
    });

    if (!store) {
      return NextResponse.json({ error: "Store not found" }, { status: 404 });
    }

    const currentStats = {
      totalKeys: store.cacheKeys.length,
      totalHits: store.cacheKeys.reduce((sum, k) => sum + k.hits, 0),
      totalMisses: store.cacheKeys.reduce((sum, k) => sum + k.misses, 0),
      memoryUsed: store.cacheKeys.reduce((sum, k) => sum + k.sizeBytes, 0),
      maxMemoryMB: store.maxMemoryMB,
      expiringIn1h: store.cacheKeys.filter(
        (k) => k.expiresAt && k.expiresAt < new Date(Date.now() + 60 * 60 * 1000)
      ).length,
    };

    const hitRate =
      currentStats.totalHits + currentStats.totalMisses > 0
        ? (currentStats.totalHits / (currentStats.totalHits + currentStats.totalMisses)) * 100
        : 0;

    return NextResponse.json({
      analytics,
      current: {
        ...currentStats,
        hitRate: Math.round(hitRate * 100) / 100,
        memoryUsagePercent:
          Math.round((currentStats.memoryUsed / (store.maxMemoryMB * 1024 * 1024)) * 10000) / 100,
      },
    });
  } catch (error) {
    console.error("Analytics GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST - Record analytics snapshot
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { storeId } = body;

    if (!storeId) {
      return NextResponse.json({ error: "storeId required" }, { status: 400 });
    }

    // Get current stats
    const store = await prisma.cacheStore.findUnique({
      where: { id: storeId },
      include: {
        cacheKeys: {
          select: { hits: true, misses: true, sizeBytes: true },
        },
      },
    });

    if (!store) {
      return NextResponse.json({ error: "Store not found" }, { status: 404 });
    }

    const totalHits = store.cacheKeys.reduce((sum, k) => sum + k.hits, 0);
    const totalMisses = store.cacheKeys.reduce((sum, k) => sum + k.misses, 0);
    const memoryUsed = store.cacheKeys.reduce((sum, k) => sum + k.sizeBytes, 0);
    const hitRate = totalHits + totalMisses > 0 ? (totalHits / (totalHits + totalMisses)) * 100 : 0;

    const analytics = await prisma.cacheAnalytics.create({
      data: {
        storeId,
        totalKeys: store.cacheKeys.length,
        totalHits,
        totalMisses,
        memoryUsedBytes: BigInt(memoryUsed),
        hitRate,
      },
    });

    return NextResponse.json({ success: true, analytics });
  } catch (error) {
    console.error("Analytics POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
