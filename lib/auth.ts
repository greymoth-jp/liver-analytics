import { betterAuth } from "better-auth";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { magicLink } from "better-auth/plugins";
import { Resend } from "resend";
import { getDb } from "./db/client";

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    console.warn(
      `[auth] ${key} is not set — provider will be unavailable until configured`
    );
    return "";
  }
  return value;
}

function optionalEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    console.warn(`[auth] ${key} is not set — provider will be unavailable`);
    return "";
  }
  return value;
}

export const auth = betterAuth({
  secret: requireEnv("BETTER_AUTH_SECRET"),
  baseURL: process.env.BETTER_AUTH_URL ?? "http://localhost:3040",
  database: drizzleAdapter(getDb(), { provider: "sqlite" }),
  session: {
    expiresIn: 60 * 60 * 24 * 30,
    updateAge: 60 * 60 * 24 * 7,
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5,
    },
  },
  advanced: {
    useSecureCookies: process.env.NODE_ENV === "production",
    defaultCookieAttributes: {
      sameSite: "lax",
      httpOnly: true,
      path: "/",
    },
  },
  emailAndPassword: {
    enabled: false,
  },
  plugins: [
    magicLink({
      sendMagicLink: async ({ email, url }) => {
        const apiKey = requireEnv("RESEND_API_KEY");
        const resend = new Resend(apiKey);
        await resend.emails.send({
          from: "LiverAnalytics <noreply@liver-analytics.jp>",
          to: email,
          subject: "LiverAnalytics へのサインインリンク",
          html: `<div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:40px 20px;">
            <h2 style="color:#0f172a;margin-bottom:8px;">LiverAnalytics</h2>
            <p style="color:#475569;margin-bottom:24px;">以下のボタンからサインインしてください。このリンクは10分間有効です。</p>
            <a href="${url}" style="display:inline-block;background:#6366f1;color:#fff;text-decoration:none;padding:12px 28px;border-radius:8px;font-weight:600;">サインイン</a>
            <p style="color:#94a3b8;font-size:12px;margin-top:32px;">心当たりがない場合はこのメールを無視してください。</p>
          </div>`,
        });
      },
    }),
  ],
  socialProviders: {
    ...(process.env.APPLE_CLIENT_ID
      ? {
          apple: {
            clientId: optionalEnv("APPLE_CLIENT_ID"),
            teamId: optionalEnv("APPLE_TEAM_ID"),
            keyId: optionalEnv("APPLE_KEY_ID"),
            privateKey: optionalEnv("APPLE_PRIVATE_KEY"),
          },
        }
      : {}),
    github: {
      clientId: requireEnv("GITHUB_CLIENT_ID"),
      clientSecret: requireEnv("GITHUB_CLIENT_SECRET"),
    },
    google: {
      clientId: requireEnv("GOOGLE_CLIENT_ID"),
      clientSecret: requireEnv("GOOGLE_CLIENT_SECRET"),
    },
    discord: {
      clientId: process.env.DISCORD_CLIENT_ID ?? "",
      clientSecret: process.env.DISCORD_CLIENT_SECRET ?? "",
    },
  },
});
