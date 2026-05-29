import type { Metadata } from "next";
import { ImportClient } from "@/components/dashboard/ImportClient";

export const metadata: Metadata = { title: "CSVインポート" };

export default function ImportPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">CSVインポート</h1>
        <p className="text-[var(--ink-muted)] text-sm mt-1">
          各プラットフォームのCSVファイルをインポートしてください
        </p>
      </div>
      <ImportClient />
    </div>
  );
}
