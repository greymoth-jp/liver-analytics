export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db/client";
import { agencies, livers } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { LiversClient } from "@/components/dashboard/LiversClient";

export const metadata: Metadata = { title: "ライバー管理" };

export default async function LiversPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;

  const db = getDb();
  let liversList: (typeof livers.$inferSelect)[] = [];
  let agencyId = "";

  try {
    const [agency] = await db
      .select()
      .from(agencies)
      .where(eq(agencies.userId, session.user.id))
      .limit(1);

    if (agency) {
      agencyId = agency.id;
      liversList = await db
        .select()
        .from(livers)
        .where(eq(livers.agencyId, agency.id))
        .orderBy(livers.displayName);
    }
  } catch {
    // DB not configured
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">ライバー管理</h1>
          <p className="text-[var(--ink-muted)] text-sm mt-1">{liversList.length}名登録中</p>
        </div>
      </div>
      <LiversClient livers={liversList} agencyId={agencyId} />
    </div>
  );
}
