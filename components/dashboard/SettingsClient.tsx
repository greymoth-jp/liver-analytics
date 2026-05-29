"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  name: string;
  email: string;
}

interface Agency {
  id: string;
  name: string;
}

interface Props {
  user: User;
  agency: Agency | null;
  plan: string;
  hasStripe: boolean;
}

export function SettingsClient({ user, agency, plan, hasStripe }: Props) {
  const router = useRouter();
  const [agencyName, setAgencyName] = useState(agency?.name ?? "");
  const [contactEmail, setContactEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [savingPortal, setSavingPortal] = useState(false);
  const [msg, setMsg] = useState("");

  async function handleSaveAgency(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMsg("");
    try {
      const res = await fetch("/api/agencies", {
        method: agency ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: agencyName, contactEmail, agencyId: agency?.id }),
      });
      if (res.ok) {
        setMsg("保存しました");
        router.refresh();
      } else {
        setMsg("保存に失敗しました");
      }
    } finally {
      setSaving(false);
    }
  }

  async function handlePortal() {
    setSavingPortal(true);
    const res = await fetch("/api/stripe/portal", { method: "POST" });
    if (res.ok) {
      const { url } = await res.json();
      window.location.href = url;
    }
    setSavingPortal(false);
  }

  async function handleUpgrade() {
    const priceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_MONTHLY ?? "";
    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ priceId }),
    });
    if (res.ok) {
      const { url } = await res.json();
      window.location.href = url;
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Account */}
      <div className="rounded-2xl border border-[var(--hairline)] bg-[var(--surface-1)] p-6">
        <h2 className="font-semibold mb-4">アカウント</h2>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between py-2 border-b border-[var(--hairline)]">
            <span className="text-[var(--ink-muted)]">名前</span>
            <span>{user.name}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-[var(--ink-muted)]">メール</span>
            <span className="font-[var(--font-mono)] text-sm">{user.email}</span>
          </div>
        </div>
      </div>

      {/* Agency */}
      <div className="rounded-2xl border border-[var(--hairline)] bg-[var(--surface-1)] p-6">
        <h2 className="font-semibold mb-4">事務所情報</h2>
        <form onSubmit={handleSaveAgency} className="space-y-4">
          <div>
            <label className="text-sm text-[var(--ink-muted)] block mb-1.5">事務所名 *</label>
            <input
              required
              value={agencyName}
              onChange={(e) => setAgencyName(e.target.value)}
              className="w-full rounded-xl border border-[var(--hairline-mid)] bg-[var(--surface-2)] text-[var(--ink)] px-4 py-2.5 text-sm outline-none focus:border-[var(--focus-primary)] transition-all"
              placeholder="株式会社○○エンタテインメント"
            />
          </div>
          <div>
            <label className="text-sm text-[var(--ink-muted)] block mb-1.5">連絡先メール</label>
            <input
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              className="w-full rounded-xl border border-[var(--hairline-mid)] bg-[var(--surface-2)] text-[var(--ink)] px-4 py-2.5 text-sm outline-none focus:border-[var(--focus-primary)] transition-all"
              placeholder="admin@agency.jp"
            />
          </div>
          {msg && (
            <p className="text-sm text-[var(--accent-green)]">{msg}</p>
          )}
          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-[var(--focus-primary)] hover:bg-[var(--focus-secondary)] disabled:opacity-50 text-white text-sm font-medium px-6 py-2.5 transition-colors"
          >
            {saving ? "保存中..." : "保存する"}
          </button>
        </form>
      </div>

      {/* Billing */}
      <div className="rounded-2xl border border-[var(--hairline)] bg-[var(--surface-1)] p-6">
        <h2 className="font-semibold mb-4">プラン・課金</h2>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-[var(--ink-muted)]">現在のプラン</p>
            <p className="font-semibold capitalize mt-1">
              {plan === "pro" ? "プロフェッショナル" : plan === "lifetime" ? "ライフタイム" : "スタータープラン（無料トライアル）"}
            </p>
          </div>
          {plan === "free" ? (
            <button
              onClick={handleUpgrade}
              className="rounded-xl bg-[var(--focus-primary)] hover:bg-[var(--focus-secondary)] text-white text-sm font-medium px-5 py-2.5 transition-colors"
            >
              アップグレード
            </button>
          ) : hasStripe ? (
            <button
              onClick={handlePortal}
              disabled={savingPortal}
              className="rounded-xl border border-[var(--hairline-mid)] hover:bg-[var(--surface-2)] text-[var(--ink-muted)] text-sm px-5 py-2.5 transition-colors"
            >
              {savingPortal ? "..." : "プラン管理"}
            </button>
          ) : null}
        </div>
        <p className="text-xs text-[var(--ink-subtle)]">
          課金・解約はStripeカスタマーポータルで管理します。
        </p>
      </div>
    </div>
  );
}
