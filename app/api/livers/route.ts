import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db/client";
import { agencies, livers } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body?.displayName || !body?.agencyId) {
    return NextResponse.json({ error: "displayName and agencyId are required" }, { status: 400 });
  }

  const db = getDb();

  // Verify user owns this agency
  const [agency] = await db
    .select()
    .from(agencies)
    .where(eq(agencies.id, body.agencyId))
    .limit(1);

  if (!agency || agency.userId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const liver = await db.insert(livers).values({
    id: randomUUID(),
    agencyId: body.agencyId,
    displayName: body.displayName,
    realName: body.realName || null,
    showroomId: body.showroomId || null,
    seventeenLiveId: body.seventeenLiveId || null,
    realityId: body.realityId || null,
    payoutRatePct: body.payoutRatePct ?? 50,
  }).returning();

  return NextResponse.json({ liver: liver[0] });
}
