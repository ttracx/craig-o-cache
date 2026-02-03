import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - List cache keys or get specific key
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const storeId = searchParams.get("storeId");
  const key = searchParams.get("key");
  const pattern = searchParams.get("pattern");

  try {
    if (key && storeId) {
      // Get specific key
      const cacheKey = await prisma.cacheKey.findUnique({
        where: { storeId_key: { storeId, key } },
      });

      if (!cacheKey) {
        // Track miss
        return NextResponse.json({ hit: false, value: null }, { status: 404 });
      }

      // Check expiration
      if (cacheKey.expiresAt && cacheKey.expiresAt < new Date()) {
        await prisma.cacheKey.delete({ where: { id: cacheKey.id } });
        return NextResponse.json({ hit: false, value: null, expired: true }, { status: 404 });
      }

      // Track hit and update lastAccessed
      await prisma.cacheKey.update({
        where: { id: cacheKey.id },
        data: { hits: { increment: 1 }, lastAccessed: new Date() },
      });

      return NextResponse.json({ hit: true, value: cacheKey.value, metadata: cacheKey.metadata });
    }

    // List keys in store
    if (storeId) {
      const where: { storeId: string; key?: { contains: string } } = { storeId };
      if (pattern) {
        where.key = { contains: pattern };
      }

      const keys = await prisma.cacheKey.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: 100,
      });

      return NextResponse.json({ keys });
    }

    return NextResponse.json({ error: "storeId required" }, { status: 400 });
  } catch (error) {
    console.error("Cache GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST - Set cache key
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { storeId, key, value, ttlSeconds, metadata } = body;

    if (!storeId || !key || value === undefined) {
      return NextResponse.json({ error: "storeId, key, and value required" }, { status: 400 });
    }

    const valueStr = typeof value === "string" ? value : JSON.stringify(value);
    const sizeBytes = Buffer.byteLength(valueStr, "utf8");
    const expiresAt = ttlSeconds ? new Date(Date.now() + ttlSeconds * 1000) : null;

    const cacheKey = await prisma.cacheKey.upsert({
      where: { storeId_key: { storeId, key } },
      create: {
        storeId,
        key,
        value: valueStr,
        ttlSeconds,
        expiresAt,
        sizeBytes,
        metadata,
      },
      update: {
        value: valueStr,
        ttlSeconds,
        expiresAt,
        sizeBytes,
        metadata,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, key: cacheKey.key, expiresAt });
  } catch (error) {
    console.error("Cache POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE - Delete cache key(s)
export async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const storeId = searchParams.get("storeId");
  const key = searchParams.get("key");
  const pattern = searchParams.get("pattern");
  const all = searchParams.get("all");

  try {
    if (!storeId) {
      return NextResponse.json({ error: "storeId required" }, { status: 400 });
    }

    if (key) {
      // Delete specific key
      await prisma.cacheKey.deleteMany({
        where: { storeId, key },
      });
      return NextResponse.json({ success: true, deleted: 1 });
    }

    if (pattern) {
      // Delete by pattern (invalidate)
      const result = await prisma.cacheKey.deleteMany({
        where: { storeId, key: { contains: pattern } },
      });
      return NextResponse.json({ success: true, deleted: result.count });
    }

    if (all === "true") {
      // Flush all keys in store
      const result = await prisma.cacheKey.deleteMany({
        where: { storeId },
      });
      return NextResponse.json({ success: true, deleted: result.count });
    }

    return NextResponse.json({ error: "key, pattern, or all=true required" }, { status: 400 });
  } catch (error) {
    console.error("Cache DELETE error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
