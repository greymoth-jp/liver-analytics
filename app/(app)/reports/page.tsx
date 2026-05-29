import type { Metadata } from "next";

export const metadata: Metadata = { title: "レポート" };

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">レポート</h1>
        <p className="text-[var(--ink-muted)] text-sm mt-1">月次サマリーとAI分析</p>
      </div>
      <div className="rounded-2xl border border-[var(--hairline)] bg-[var(--surface-1)] p-12 text-center">
        <div className="text-4xl mb-4">📈</div>
        <p className="font-medium mb-2">月次レポートは近日公開予定</p>
        <p className="text-sm text-[var(--ink-muted)]">
          CSVインポート後、AI売上予測とレポート自動生成機能が有効になります。
        </p>
      </div>
    </div>
  );
}
