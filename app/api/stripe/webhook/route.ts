import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { getDb } from "@/lib/db/client";
import { processedWebhooks, userSettings } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import type Stripe from "stripe";

export const runtime = "nodejs";

async function getOrCreateSettings(db: ReturnType<typeof getDb>, userId: string) {
  const [existing] = await db
    .select()
    .from(userSettings)
    .where(eq(userSettings.userId, userId))
    .limit(1);
  return existing;
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch {
    return NextResponse.json({ error: "Webhook signature verification failed" }, { status: 400 });
  }

  const db = getDb();

  // Idempotency: skip already-processed events
  try {
    await db.insert(processedWebhooks).values({
      id: `wh_${event.id}`,
      stripeEventId: event.id,
    });
  } catch {
    // Already processed (unique constraint)
    return NextResponse.json({ received: true, skipped: true });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.mode === "subscription" && session.customer && session.subscription) {
          // Find user by customer or metadata
          const customerId = String(session.customer);
          const [settings] = await db
            .select()
            .from(userSettings)
            .where(eq(userSettings.stripeCustomerId, customerId))
            .limit(1);
          if (settings) {
            await db
              .update(userSettings)
              .set({
                plan: "pro",
                subscriptionId: String(session.subscription),
                updatedAt: new Date(),
              })
              .where(eq(userSettings.id, settings.id));
          }
        }
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const customerId = String(sub.customer);
        const [settings] = await db
          .select()
          .from(userSettings)
          .where(eq(userSettings.stripeCustomerId, customerId))
          .limit(1);
        if (settings) {
          await db
            .update(userSettings)
            .set({ plan: "free", subscriptionId: null, updatedAt: new Date() })
            .where(eq(userSettings.id, settings.id));
        }
        break;
      }

      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        const customerId = String(sub.customer);
        const [settings] = await db
          .select()
          .from(userSettings)
          .where(eq(userSettings.stripeCustomerId, customerId))
          .limit(1);
        if (settings) {
          const plan = sub.status === "active" ? "pro" : "free";
          await db
            .update(userSettings)
            .set({ plan, updatedAt: new Date() })
            .where(eq(userSettings.id, settings.id));
        }
        break;
      }
    }
  } catch (err) {
    console.error("[stripe webhook] handler error:", err);
  }

  return NextResponse.json({ received: true });
}
