import type { Metadata } from "next";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db/client";
import { agencies, livers, revenues } from "@/lib/db/schema";
import { eq, gte, and, sql } from "drizzle-orm";
import { PayoutsClient } from "@/components/dashboard/PayoutsClient";

export const metadata: Metadata = { title: "報酬計算" };

export default async function PayoutsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;

  const db = getDb();
  let payoutData: {
    liverId: string;
    liverName: string;
    payoutRatePct: number;
    totalNetYen: number;
    payoutAmountYen: number;
    agencyShareYen: number;
  }[] = [];

  try {
    const [agency] = await db
      .select()
      .from(agencies)
      .where(eq(agencies.userId, session.user.id))
      .limit(1);

    if (agency) {
      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

      const agencyLivers = await db
        .select()
        .from(livers)
        .where(and(eq(livers.agencyId, agency.id), eq(livers.status, "active")));

      for (const liver of agencyLivers) {
        const [rev] = await db
          .select({ total: sql<number>`coalesce(sum(${revenues.netYen}), 0)` })
          .from(revenues)
          .where(and(eq(revenues.liverId, liver.id), gte(revenues.streamDate, monthStart)));

        const totalNetYen = rev?.total ?? 0;
        const payoutAmountYen = (totalNetYen * liver.payoutRatePct) / 100;
        const agencyShareYen = totalNetYen - payoutAmountYen;

        payoutData.push({
          liverId: liver.id,
          liverName: liver.displayName,
          payoutRatePct: liver.payoutRatePct,
          totalNetYen,
          payoutAmountYen,
          agencyShareYen,
        });
      }
    }
  } catch {
    // DB not configured
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">報酬計算</h1>
        <p className="text-[var(--ink-muted)] text-sm mt-1">
          {new Date().toLocaleDateString("ja-JP", { year: "numeric", month: "long" })}の精算
        </p>
      </div>
      <PayoutsClient data={payoutData} />
    </div>
  );
}
