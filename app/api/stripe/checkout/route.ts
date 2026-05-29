import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { createCheckoutSession } from "@/lib/stripe";
import { getDb } from "@/lib/db/client";
import { userSettings } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { priceId } = await request.json().catch(() => ({}));
  if (!priceId) {
    return NextResponse.json({ error: "priceId is required" }, { status: 400 });
  }

  const db = getDb();
  const [settings] = await db
    .select()
    .from(userSettings)
    .where(eq(userSettings.userId, session.user.id))
    .limit(1);

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3040";

  const checkoutSession = await createCheckoutSession({
    customerId: settings?.stripeCustomerId ?? undefined,
    email: session.user.email,
    priceId,
    successUrl: `${appUrl}/settings?checkout=success`,
    cancelUrl: `${appUrl}/pricing`,
  });

  return NextResponse.json({ url: checkoutSession.url });
}
