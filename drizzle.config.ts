import { loadEnvConfig } from "@next/env";
import type { Config } from "drizzle-kit";

loadEnvConfig(process.cwd());

if (!process.env.TURSO_DATABASE_URL) {
  throw new Error("TURSO_DATABASE_URL not loaded from .env.local");
}

export default {
  schema: "./lib/db/schema.ts",
  out: "./migrations",
  dialect: "turso",
  dbCredentials: {
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  },
} satisfies Config;
