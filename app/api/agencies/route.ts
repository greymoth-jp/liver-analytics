import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db/client";
import { agencies, userSettings } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body?.name) {
    return NextResponse.json({ error: "name is required" }, { status: 400 });
  }

  const db = getDb();

  // Upsert userSettings if not exists
  const existing = await db
    .select()
    .from(userSettings)
    .where(eq(userSettings.userId, session.user.id))
    .limit(1);

  if (existing.length === 0) {
    await db.insert(userSettings).values({
      id: randomUUID(),
      userId: session.user.id,
    });
  }

  const agency = await db
    .insert(agencies)
    .values({
      id: randomUUID(),
      userId: session.user.id,
      name: body.name,
      contactEmail: body.contactEmail || null,
    })
    .returning();

  return NextResponse.json({ agency: agency[0] });
}

export async function PUT(request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body?.name || !body?.agencyId) {
    return NextResponse.json({ error: "name and agencyId required" }, { status: 400 });
  }

  const db = getDb();

  // Verify ownership
  const [a] = await db
    .select()
    .from(agencies)
    .where(eq(agencies.id, body.agencyId))
    .limit(1);

  if (!a || a.userId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await db
    .update(agencies)
    .set({
      name: body.name,
      contactEmail: body.contactEmail || null,
      updatedAt: new Date(),
    })
    .where(eq(agencies.id, body.agencyId));

  return NextResponse.json({ success: true });
}
