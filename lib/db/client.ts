import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

let _db: ReturnType<typeof drizzle<typeof schema>> | null = null;

function getDb() {
  if (_db) return _db;

  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url) {
    console.warn("[db] TURSO_DATABASE_URL is not set — DB calls will fail at runtime");
  }

  const client = createClient({
    url: url ?? "file:local.db",
    authToken: authToken ?? undefined,
  });

  _db = drizzle(client, { schema });
  return _db;
}

export { getDb };
