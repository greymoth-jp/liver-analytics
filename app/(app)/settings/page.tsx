export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db/client";
import { agencies, userSettings } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { SettingsClient } from "@/components/dashboard/SettingsClient";

export const metadata: Metadata = { title: "設定" };

export default async function SettingsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;

  const db = getDb();
  let agency: { id: string; name: string } | null = null;
  let settings: { plan: string; stripeCustomerId: string | null } | null = null;

  try {
    const [a] = await db
      .select({ id: agencies.id, name: agencies.name })
      .from(agencies)
      .where(eq(agencies.userId, session.user.id))
      .limit(1);
    agency = a ?? null;

    const [s] = await db
      .select({ plan: userSettings.plan, stripeCustomerId: userSettings.stripeCustomerId })
      .from(userSettings)
      .where(eq(userSettings.userId, session.user.id))
      .limit(1);
    settings = s ?? null;
  } catch {
    // DB not configured
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">設定</h1>
      <SettingsClient
        user={session.user}
        agency={agency}
        plan={settings?.plan ?? "free"}
        hasStripe={!!settings?.stripeCustomerId}
      />
    </div>
  );
}
