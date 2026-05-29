import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { generateRevenueForecast } from "@/lib/ai";
import { getDb } from "@/lib/db/client";
import { revenues, livers, kpiSnapshots } from "@/lib/db/schema";
import { eq, and, gte, desc } from "drizzle-orm";
import { randomUUID } from "crypto";

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { liverId } = await request.json().catch(() => ({}));
  if (!liverId) {
    return NextResponse.json({ error: "liverId required" }, { status: 400 });
  }

  const db = getDb();

  const [liver] = await db
    .select()
    .from(livers)
    .where(eq(livers.id, liverId))
    .limit(1);

  if (!liver) {
    return NextResponse.json({ error: "Liver not found" }, { status: 404 });
  }

  // Get last 3 months revenue
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

  const revenueRows = await db
    .select()
    .from(revenues)
    .where(and(eq(revenues.liverId, liverId), gte(revenues.streamDate, threeMonthsAgo)))
    .orderBy(desc(revenues.streamDate));

  // Aggregate by month
  const monthlyMap = new Map<string, number>();
  for (const r of revenueRows) {
    const key = `${r.streamDate.getFullYear()}-${r.streamDate.getMonth()}`;
    monthlyMap.set(key, (monthlyMap.get(key) ?? 0) + r.netYen);
  }
  const last3MonthsRevenue = Array.from(monthlyMap.values()).slice(-3);

  const avgStreamMinutes =
    revenueRows.filter((r) => r.streamDurationMin).reduce((s, r) => s + (r.streamDurationMin ?? 0), 0) /
    Math.max(revenueRows.filter((r) => r.streamDurationMin).length, 1);

  const avgViewerPeak =
    revenueRows.filter((r) => r.viewerPeak).reduce((s, r) => s + (r.viewerPeak ?? 0), 0) /
    Math.max(revenueRows.filter((r) => r.viewerPeak).length, 1);

  const result = await generateRevenueForecast({
    liverId,
    liverName: liver.displayName,
    platform: liver.showroomId ? "SHOWROOM" : liver.seventeenLiveId ? "17LIVE" : "REALITY",
    last3MonthsRevenue,
    avgStreamMinutes: Math.round(avgStreamMinutes),
    avgViewerPeak: Math.round(avgViewerPeak),
  });

  // Save to kpi_snapshots
  const now = new Date();
  await db
    .insert(kpiSnapshots)
    .values({
      id: randomUUID(),
      liverId,
      agencyId: liver.agencyId,
      periodYear: now.getFullYear(),
      periodMonth: now.getMonth() + 1,
      totalStreams: revenueRows.length,
      totalStreamMinutes: Math.round(avgStreamMinutes * revenueRows.length),
      totalGrossYen: revenueRows.reduce((s, r) => s + r.grossYen, 0),
      totalNetYen: revenueRows.reduce((s, r) => s + r.netYen, 0),
      avgViewerPeak,
      totalNewFollowers: revenueRows.reduce((s, r) => s + (r.newFollowers ?? 0), 0),
      aiRevenueforecastYen: result.forecastYen,
      aiInsight: result.insight,
    })
    .onConflictDoNothing();

  return NextResponse.json(result);
}
