"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Liver {
  id: string;
  displayName: string;
  realName: string | null;
  showroomId: string | null;
  seventeenLiveId: string | null;
  realityId: string | null;
  payoutRatePct: number;
  status: "active" | "inactive" | "graduated";
}

interface Props {
  livers: Liver[];
  agencyId: string;
}

const STATUS_LABEL: Record<string, string> = {
  active: "アクティブ",
  inactive: "休止中",
  graduated: "卒業",
};

const STATUS_COLOR: Record<string, string> = {
  active: "bg-[var(--accent-green)]/15 text-[var(--accent-green)]",
  inactive: "bg-[var(--accent-amber)]/15 text-[var(--accent-amber)]",
  graduated: "bg-[var(--ink-subtle)]/15 text-[var(--ink-subtle)]",
};

export function LiversClient({ livers, agencyId }: Props) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    displayName: "",
    realName: "",
    showroomId: "",
    seventeenLiveId: "",
    realityId: "",
    payoutRatePct: 50,
  });

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!agencyId) return;
    setLoading(true);
    try {
      const res = await fetch("/api/livers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, agencyId }),
      });
      if (res.ok) {
        setShowForm(false);
        setForm({ displayName: "", realName: "", showroomId: "", seventeenLiveId: "", realityId: "", payoutRatePct: 50 });
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  }

  if (!agencyId) {
    return (
      <div className="rounded-2xl border border-[var(--hairline)] bg-[var(--surface-1)] p-12 text-center">
        <p className="text-[var(--ink-muted)]">事務所を登録してからライバーを追加してください。</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <button
        onClick={() => setShowForm((v) => !v)}
        className="rounded-xl bg-[var(--focus-primary)] hover:bg-[var(--focus-secondary)] text-white text-sm font-medium px-5 py-2.5 transition-colors"
      >
        + ライバーを追加
      </button>

      {showForm && (
        <form
          onSubmit={handleAdd}
          className="rounded-2xl border border-[var(--hairline)] bg-[var(--surface-1)] p-6 space-y-4"
        >
          <h3 className="font-semibold">新規ライバー登録</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-[var(--ink-muted)] block mb-1.5">配信名 *</label>
              <input
                required
                value={form.displayName}
                onChange={(e) => setForm((f) => ({ ...f, displayName: e.target.value }))}
                className="w-full rounded-xl border border-[var(--hairline-mid)] bg-[var(--surface-2)] text-[var(--ink)] px-4 py-2.5 text-sm outline-none focus:border-[var(--focus-primary)] transition-all"
                placeholder="配信者名（CSVと一致させてください）"
              />
            </div>
            <div>
              <label className="text-sm text-[var(--ink-muted)] block mb-1.5">本名</label>
              <input
                value={form.realName}
                onChange={(e) => setForm((f) => ({ ...f, realName: e.target.value }))}
                className="w-full rounded-xl border border-[var(--hairline-mid)] bg-[var(--surface-2)] text-[var(--ink)] px-4 py-2.5 text-sm outline-none focus:border-[var(--focus-primary)] transition-all"
                placeholder="任意"
              />
            </div>
            <div>
              <label className="text-sm text-[var(--ink-muted)] block mb-1.5">SHOWROOM ID</label>
              <input
                value={form.showroomId}
                onChange={(e) => setForm((f) => ({ ...f, showroomId: e.target.value }))}
                className="w-full rounded-xl border border-[var(--hairline-mid)] bg-[var(--surface-2)] text-[var(--ink)] px-4 py-2.5 text-sm outline-none focus:border-[var(--focus-primary)] transition-all"
                placeholder="任意"
              />
            </div>
            <div>
              <label className="text-sm text-[var(--ink-muted)] block mb-1.5">17LIVE ID</label>
              <input
                value={form.seventeenLiveId}
                onChange={(e) => setForm((f) => ({ ...f, seventeenLiveId: e.target.value }))}
                className="w-full rounded-xl border border-[var(--hairline-mid)] bg-[var(--surface-2)] text-[var(--ink)] px-4 py-2.5 text-sm outline-none focus:border-[var(--focus-primary)] transition-all"
                placeholder="任意"
              />
            </div>
            <div>
              <label className="text-sm text-[var(--ink-muted)] block mb-1.5">報酬率 (%)</label>
              <input
                type="number"
                min={0}
                max={100}
                value={form.payoutRatePct}
                onChange={(e) => setForm((f) => ({ ...f, payoutRatePct: parseFloat(e.target.value) }))}
                className="w-full rounded-xl border border-[var(--hairline-mid)] bg-[var(--surface-2)] text-[var(--ink)] px-4 py-2.5 text-sm outline-none focus:border-[var(--focus-primary)] transition-all font-[var(--font-mono)]"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-[var(--focus-primary)] hover:bg-[var(--focus-secondary)] disabled:opacity-50 text-white text-sm font-medium px-6 py-2.5 transition-colors"
            >
              {loading ? "登録中..." : "登録する"}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-xl border border-[var(--hairline)] text-[var(--ink-muted)] text-sm px-6 py-2.5 hover:bg-[var(--surface-2)] transition-colors"
            >
              キャンセル
            </button>
          </div>
        </form>
      )}

      {livers.length === 0 ? (
        <div className="rounded-2xl border border-[var(--hairline)] bg-[var(--surface-1)] p-12 text-center">
          <div className="text-4xl mb-4">🎙️</div>
          <p className="text-[var(--ink-muted)]">ライバーがまだ登録されていません。</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-[var(--hairline)] bg-[var(--surface-1)] overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--hairline)] text-[var(--ink-subtle)] text-xs">
                <th className="text-left px-6 py-3 font-medium">配信名</th>
                <th className="text-left px-6 py-3 font-medium">プラットフォーム</th>
                <th className="text-left px-4 py-3 font-medium">報酬率</th>
                <th className="text-left px-4 py-3 font-medium">ステータス</th>
              </tr>
            </thead>
            <tbody>
              {livers.map((l) => (
                <tr
                  key={l.id}
                  className="border-b border-[var(--hairline)] last:border-0 hover:bg-[var(--surface-2)] transition-colors"
                >
                  <td className="px-6 py-4 font-medium">{l.displayName}</td>
                  <td className="px-6 py-4 text-[var(--ink-muted)]">
                    {[
                      l.showroomId && "SHOWROOM",
                      l.seventeenLiveId && "17LIVE",
                      l.realityId && "REALITY",
                    ]
                      .filter(Boolean)
                      .join(", ") || "—"}
                  </td>
                  <td className="px-4 py-4 font-[var(--font-mono)] text-[var(--ink-muted)]">
                    {l.payoutRatePct}%
                  </td>
                  <td className="px-4 py-4">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_COLOR[l.status]}`}>
                      {STATUS_LABEL[l.status]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
