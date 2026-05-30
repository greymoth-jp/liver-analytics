export const dynamic = "force-dynamic";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db/client";
import { agencies, livers, revenues, kpiSnapshots } from "@/lib/db/schema";
import { eq, desc, and, gte, sql } from "drizzle-orm";
import { DashboardClient } from "@/components/dashboard/DashboardClient";

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;

  const db = getDb();
  const now = new Date();
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  // get agencies for this user
  let userAgencies: { id: string; name: string }[] = [];
  let totalLivers = 0;
  let thisMonthRevenue = 0;
  let lastMonthRevenue = 0;
  let topLivers: { name: string; revenue: number; platform: string }[] = [];
  let revenueChart: { month: string; total: number }[] = [];

  try {
    userAgencies = await db
      .select({ id: agencies.id, name: agencies.name })
      .from(agencies)
      .where(eq(agencies.userId, session.user.id))
      .limit(10);

    if (userAgencies.length > 0) {
      const agencyIds = userAgencies.map((a) => a.id);

      totalLivers = (
        await db
          .select({ count: sql<number>`count(*)` })
          .from(livers)
          .where(eq(livers.agencyId, agencyIds[0]))
      )[0]?.count ?? 0;

      const thisMonthRows = await db
        .select({ total: sql<number>`sum(${revenues.netYen})` })
        .from(revenues)
        .where(
          and(
            eq(revenues.agencyId, agencyIds[0]),
            gte(revenues.streamDate, thisMonthStart)
          )
        );
      thisMonthRevenue = thisMonthRows[0]?.total ?? 0;

      const lastMonthRows = await db
        .select({ total: sql<number>`sum(${revenues.netYen})` })
        .from(revenues)
        .where(
          and(
            eq(revenues.agencyId, agencyIds[0]),
            gte(revenues.streamDate, lastMonthStart),
            sql`${revenues.streamDate} < ${thisMonthStart.getTime() / 1000}`
          )
        );
      lastMonthRevenue = lastMonthRows[0]?.total ?? 0;
    }
  } catch {
    // DB not configured yet — show empty state
  }

  const growthRate =
    lastMonthRevenue > 0
      ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
      : 0;

  return (
    <DashboardClient
      agencyName={userAgencies[0]?.name ?? "事務所未設定"}
      totalLivers={totalLivers}
      thisMonthRevenue={thisMonthRevenue}
      lastMonthRevenue={lastMonthRevenue}
      growthRate={growthRate}
      topLivers={topLivers}
      revenueChart={revenueChart}
      hasAgency={userAgencies.length > 0}
    />
  );
}
