"use client";

interface PayoutRow {
  liverId: string;
  liverName: string;
  payoutRatePct: number;
  totalNetYen: number;
  payoutAmountYen: number;
  agencyShareYen: number;
}

interface Props {
  data: PayoutRow[];
}

function yen(n: number) {
  return `¥${Math.round(n).toLocaleString("ja-JP")}`;
}

export function PayoutsClient({ data }: Props) {
  const totalNet = data.reduce((s, r) => s + r.totalNetYen, 0);
  const totalPayout = data.reduce((s, r) => s + r.payoutAmountYen, 0);
  const totalAgency = data.reduce((s, r) => s + r.agencyShareYen, 0);

  if (data.length === 0) {
    return (
      <div className="rounded-2xl border border-[var(--hairline)] bg-[var(--surface-1)] p-12 text-center">
        <div className="text-4xl mb-4">💴</div>
        <p className="text-[var(--ink-muted)] mb-2">今月の収益データがありません。</p>
        <p className="text-sm text-[var(--ink-subtle)]">CSVをインポートして報酬を自動計算します。</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "総収益（事務所取り分前）", value: yen(totalNet), sub: "" },
          { label: "ライバー報酬合計", value: yen(totalPayout), sub: "ライバーへの支払額" },
          { label: "事務所取り分合計", value: yen(totalAgency), sub: "事務所の収益" },
        ].map((c) => (
          <div key={c.label} className="rounded-2xl border border-[var(--hairline)] bg-[var(--surface-1)] p-5">
            <p className="text-xs text-[var(--ink-muted)] mb-2">{c.label}</p>
            <p className="text-2xl font-bold font-[var(--font-mono)]">{c.value}</p>
            {c.sub && <p className="text-xs text-[var(--ink-subtle)] mt-1">{c.sub}</p>}
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-[var(--hairline)] bg-[var(--surface-1)] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--hairline)] text-[var(--ink-subtle)] text-xs">
              <th className="text-left px-6 py-3 font-medium">ライバー名</th>
              <th className="text-right px-4 py-3 font-medium">総収益</th>
              <th className="text-right px-4 py-3 font-medium">報酬率</th>
              <th className="text-right px-4 py-3 font-medium">ライバー報酬</th>
              <th className="text-right px-6 py-3 font-medium">事務所取り分</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr
                key={row.liverId}
                className="border-b border-[var(--hairline)] last:border-0 hover:bg-[var(--surface-2)] transition-colors"
              >
                <td className="px-6 py-4 font-medium">{row.liverName}</td>
                <td className="px-4 py-4 text-right font-[var(--font-mono)] text-[var(--ink-muted)]">
                  {yen(row.totalNetYen)}
                </td>
                <td className="px-4 py-4 text-right font-[var(--font-mono)] text-[var(--ink-muted)]">
                  {row.payoutRatePct}%
                </td>
                <td className="px-4 py-4 text-right font-[var(--font-mono)] text-[var(--accent-green)]">
                  {yen(row.payoutAmountYen)}
                </td>
                <td className="px-6 py-4 text-right font-[var(--font-mono)] text-[var(--ink)]">
                  {yen(row.agencyShareYen)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-[var(--hairline)] bg-[var(--surface-2)]">
              <td className="px-6 py-4 font-semibold text-[var(--ink-muted)]">合計</td>
              <td className="px-4 py-4 text-right font-[var(--font-mono)] font-semibold">
                {yen(totalNet)}
              </td>
              <td className="px-4 py-4" />
              <td className="px-4 py-4 text-right font-[var(--font-mono)] font-semibold text-[var(--accent-green)]">
                {yen(totalPayout)}
              </td>
              <td className="px-6 py-4 text-right font-[var(--font-mono)] font-semibold">
                {yen(totalAgency)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
