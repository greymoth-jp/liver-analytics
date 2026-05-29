"use client";

import Link from "next/link";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Props {
  agencyName: string;
  totalLivers: number;
  thisMonthRevenue: number;
  lastMonthRevenue: number;
  growthRate: number;
  topLivers: { name: string; revenue: number; platform: string }[];
  revenueChart: { month: string; total: number }[];
  hasAgency: boolean;
}

function KPICard({
  label,
  value,
  sub,
  trend,
}: {
  label: string;
  value: string;
  sub?: string;
  trend?: "up" | "down" | "flat";
}) {
  const trendColor =
    trend === "up"
      ? "text-[var(--accent-green)]"
      : trend === "down"
      ? "text-[var(--accent-red)]"
      : "text-[var(--ink-subtle)]";
  return (
    <div className="rounded-2xl border border-[var(--hairline)] bg-[var(--surface-1)] p-6">
      <p className="text-sm text-[var(--ink-muted)] mb-2">{label}</p>
      <p className="text-2xl font-bold font-[var(--font-mono)] text-[var(--ink)]">{value}</p>
      {sub && <p className={`text-xs mt-1 ${trendColor}`}>{sub}</p>}
    </div>
  );
}

const MOCK_CHART = [
  { month: "12月", total: 1200000 },
  { month: "1月", total: 1450000 },
  { month: "2月", total: 1320000 },
  { month: "3月", total: 1680000 },
  { month: "4月", total: 1920000 },
  { month: "5月", total: 2100000 },
];

export function DashboardClient({
  agencyName,
  totalLivers,
  thisMonthRevenue,
  lastMonthRevenue,
  growthRate,
  topLivers,
  revenueChart,
  hasAgency,
}: Props) {
  const chartData = revenueChart.length > 0 ? revenueChart : MOCK_CHART;
  const fmt = (n: number) =>
    n >= 10000
      ? `¥${Math.round(n / 10000).toLocaleString()}万`
      : `¥${Math.round(n).toLocaleString()}`;

  if (!hasAgency) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="text-5xl mb-6">🏢</div>
        <h2 className="text-2xl font-bold mb-3">事務所を登録しましょう</h2>
        <p className="text-[var(--ink-muted)] mb-8 max-w-sm">
          最初に事務所情報を登録してください。その後ライバーの追加とCSVインポートができます。
        </p>
        <Link
          href="/settings"
          className="rounded-xl bg-[var(--focus-primary)] hover:bg-[var(--focus-secondary)] text-white font-semibold px-8 py-3 transition-colors"
        >
          事務所を登録する
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{agencyName}</h1>
          <p className="text-[var(--ink-muted)] text-sm mt-1">
            {new Date().toLocaleDateString("ja-JP", {
              year: "numeric",
              month: "long",
            })}
          </p>
        </div>
        <Link
          href="/import"
          className="rounded-xl bg-[var(--focus-primary)] hover:bg-[var(--focus-secondary)] text-white text-sm font-medium px-5 py-2.5 transition-colors"
        >
          + CSVインポート
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          label="今月の総収益"
          value={thisMonthRevenue > 0 ? fmt(thisMonthRevenue) : "¥0"}
          sub={
            growthRate !== 0
              ? `前月比 ${growthRate > 0 ? "+" : ""}${growthRate.toFixed(1)}%`
              : "データなし"
          }
          trend={
            growthRate > 0 ? "up" : growthRate < 0 ? "down" : "flat"
          }
        />
        <KPICard
          label="所属ライバー数"
          value={`${totalLivers}名`}
          sub="アクティブ"
        />
        <KPICard
          label="前月収益"
          value={lastMonthRevenue > 0 ? fmt(lastMonthRevenue) : "¥0"}
        />
        <KPICard
          label="今月配信数"
          value="—"
          sub="CSVインポートで集計"
        />
      </div>

      {/* Revenue Chart */}
      <div className="rounded-2xl border border-[var(--hairline)] bg-[var(--surface-1)] p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-semibold">月次収益推移</h2>
          {revenueChart.length === 0 && (
            <span className="text-xs text-[var(--ink-subtle)] bg-[var(--surface-2)] px-3 py-1 rounded-full">
              サンプルデータ
            </span>
          )}
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--hairline)" vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fill: "var(--ink-subtle)", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "var(--ink-subtle)", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => fmt(v)}
            />
            <Tooltip
              contentStyle={{
                background: "var(--surface-2)",
                border: "1px solid var(--hairline)",
                borderRadius: "10px",
                color: "var(--ink)",
                fontSize: "13px",
              }}
              formatter={(v) => [fmt(Number(v ?? 0)), "収益"]}
            />
            <Bar dataKey="total" fill="var(--focus-primary)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Quick actions */}
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { href: "/livers", label: "ライバーを追加", icon: "🎙️", desc: "所属ライバーの登録・管理" },
          { href: "/import", label: "CSVをインポート", icon: "📁", desc: "各プラットフォームの配信データ" },
          { href: "/payouts", label: "報酬を計算する", icon: "💴", desc: "今月の精算書を作成" },
        ].map((a) => (
          <Link
            key={a.href}
            href={a.href}
            className="rounded-2xl border border-[var(--hairline)] bg-[var(--surface-1)] hover:bg-[var(--surface-2)] p-5 transition-colors group"
          >
            <div className="text-2xl mb-3">{a.icon}</div>
            <div className="font-medium text-[var(--ink)] group-hover:text-[var(--focus-secondary)] transition-colors">
              {a.label}
            </div>
            <p className="text-sm text-[var(--ink-muted)] mt-1">{a.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
