"use client";

import { useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await authClient.signIn.magicLink({
        email,
        callbackURL: "/dashboard",
      });
      setSent(true);
    } catch {
      setError("メールの送信に失敗しました。再度お試しください。");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    await authClient.signIn.social({ provider: "google", callbackURL: "/dashboard" });
  }

  return (
    <div className="w-full max-w-md">
      <div className="rounded-2xl border border-[var(--hairline)] bg-[var(--surface-1)] p-8">
        <Link href="/" className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg bg-[var(--focus-primary)] flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path
                d="M3 14L7 8L10 11L13 6L15 9"
                stroke="white"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className="font-bold text-[var(--ink)] text-lg">LiverAnalytics</span>
        </Link>

        <h1 className="text-2xl font-bold mb-2">サインイン</h1>
        <p className="text-[var(--ink-muted)] text-sm mb-8">
          メールアドレスにサインインリンクを送信します
        </p>

        {sent ? (
          <div className="rounded-xl bg-[var(--surface-2)] border border-[var(--accent-green)]/30 p-6 text-center">
            <div className="text-3xl mb-3">📬</div>
            <p className="font-medium mb-1">メールを送信しました</p>
            <p className="text-[var(--ink-muted)] text-sm">
              {email} にサインインリンクを送りました。10分以内にご確認ください。
            </p>
          </div>
        ) : (
          <>
            <form onSubmit={handleMagicLink} className="space-y-4">
              <div>
                <label className="block text-sm text-[var(--ink-muted)] mb-1.5" htmlFor="email">
                  メールアドレス
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-[var(--hairline-mid)] bg-[var(--surface-2)] text-[var(--ink)] px-4 py-3 text-sm outline-none focus:border-[var(--focus-primary)] focus:ring-1 focus:ring-[var(--focus-glow)] transition-all placeholder:text-[var(--ink-subtle)]"
                  placeholder="agency@example.jp"
                />
              </div>
              {error && (
                <p className="text-[var(--accent-red)] text-sm">{error}</p>
              )}
              <button
                type="submit"
                disabled={loading || !email}
                className="w-full rounded-xl bg-[var(--focus-primary)] hover:bg-[var(--focus-secondary)] disabled:opacity-50 text-white font-semibold py-3 transition-colors"
              >
                {loading ? "送信中..." : "サインインリンクを送る"}
              </button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[var(--hairline)]" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-[var(--surface-1)] px-4 text-xs text-[var(--ink-subtle)]">または</span>
              </div>
            </div>

            <button
              onClick={handleGoogle}
              className="w-full rounded-xl border border-[var(--hairline-mid)] bg-[var(--surface-2)] hover:bg-[var(--surface-3)] text-[var(--ink)] font-medium py-3 flex items-center justify-center gap-3 transition-colors text-sm"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
                <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
              </svg>
              Googleでサインイン
            </button>
          </>
        )}
      </div>
      <p className="text-center text-xs text-[var(--ink-subtle)] mt-6">
        サインインすることで
        <Link href="/terms" className="underline hover:text-[var(--ink-muted)]">利用規約</Link>
        と
        <Link href="/privacy" className="underline hover:text-[var(--ink-muted)]">プライバシーポリシー</Link>
        に同意します。
      </p>
    </div>
  );
}
