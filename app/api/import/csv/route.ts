import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db/client";
import { agencies, livers, revenues, importBatches } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { getPlatformParser } from "@/lib/import/parsers";
import { randomUUID } from "crypto";

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body || !body.platform || !Array.isArray(body.rows)) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { platform, rows, fileName } = body as {
    platform: string;
    rows: Record<string, string>[];
    fileName: string;
  };

  const db = getDb();

  // Get user's agency
  const [agency] = await db
    .select()
    .from(agencies)
    .where(eq(agencies.userId, session.user.id))
    .limit(1);

  if (!agency) {
    return NextResponse.json({ error: "事務所が未登録です。設定から事務所を登録してください。" }, { status: 400 });
  }

  // Parse CSV rows
  let parsed;
  try {
    parsed = getPlatformParser(platform)(rows);
  } catch {
    return NextResponse.json({ error: `Unknown platform: ${platform}` }, { status: 400 });
  }

  if (parsed.length === 0) {
    return NextResponse.json({ error: "パース結果が0件です。CSVフォーマットを確認してください。" }, { status: 400 });
  }

  // Create import batch
  const batchId = randomUUID();
  await db.insert(importBatches).values({
    id: batchId,
    agencyId: agency.id,
    platformSlug: platform,
    fileName: fileName ?? "unknown.csv",
    rowCount: parsed.length,
    status: "processing",
  });

  // Load all livers for this agency to match by name
  const agencyLivers = await db
    .select()
    .from(livers)
    .where(eq(livers.agencyId, agency.id));

  const liverMap = new Map<string, string>(); // displayName (lowercase) -> id
  for (const l of agencyLivers) {
    liverMap.set(l.displayName.toLowerCase(), l.id);
  }

  let insertedCount = 0;
  let skippedCount = 0;

  for (const row of parsed) {
    const nameKey = (row.rawDisplayName ?? "").toLowerCase();
    const liverId = liverMap.get(nameKey);

    if (!liverId) {
      skippedCount++;
      continue; // can't match, skip
    }

    await db.insert(revenues).values({
      id: randomUUID(),
      liverId,
      agencyId: agency.id,
      platformSlug: row.platformSlug,
      streamDate: row.streamDate,
      grossPoints: row.grossPoints,
      grossYen: row.grossYen,
      platformFeeYen: row.platformFeeYen,
      netYen: row.netYen,
      streamDurationMin: row.streamDurationMin,
      viewerPeak: row.viewerPeak,
      newFollowers: row.newFollowers,
      importBatchId: batchId,
    }).onConflictDoNothing();

    insertedCount++;
  }

  // Update batch status
  await db
    .update(importBatches)
    .set({ status: "done" })
    .where(eq(importBatches.id, batchId));

  return NextResponse.json({
    success: true,
    batchId,
    inserted: insertedCount,
    skipped: skippedCount,
    total: parsed.length,
  });
}
