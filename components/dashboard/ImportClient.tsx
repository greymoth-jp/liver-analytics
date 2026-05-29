"use client";

import { useState, useRef } from "react";
import Papa from "papaparse";

const PLATFORMS = [
  { slug: "showroom", name: "SHOWROOM", color: "#e11d48" },
  { slug: "17live", name: "17LIVE", color: "#6366f1" },
  { slug: "reality", name: "REALITY", color: "#0ea5e9" },
];

type ImportStatus = "idle" | "parsing" | "uploading" | "done" | "error";

export function ImportClient() {
  const [platform, setPlatform] = useState("showroom");
  const [status, setStatus] = useState<ImportStatus>("idle");
  const [rowCount, setRowCount] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const [preview, setPreview] = useState<Record<string, string>[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setStatus("parsing");
    setErrorMsg("");
    setPreview([]);

    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (result) => {
        const rows = result.data;
        setRowCount(rows.length);
        setPreview(rows.slice(0, 3));

        if (rows.length === 0) {
          setStatus("error");
          setErrorMsg("CSVにデータがありません。");
          return;
        }

        setStatus("uploading");
        try {
          const res = await fetch("/api/import/csv", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ platform, rows, fileName: file.name }),
          });
          if (!res.ok) {
            const d = await res.json().catch(() => ({}));
            throw new Error(d.error ?? `HTTP ${res.status}`);
          }
          setStatus("done");
        } catch (e) {
          setStatus("error");
          setErrorMsg(e instanceof Error ? e.message : "インポートに失敗しました");
        }
      },
      error: (err) => {
        setStatus("error");
        setErrorMsg(err.message);
      },
    });
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  function reset() {
    setStatus("idle");
    setRowCount(0);
    setPreview([]);
    setErrorMsg("");
    if (fileRef.current) fileRef.current.value = "";
  }

  return (
    <div className="space-y-6">
      {/* Platform selector */}
      <div className="rounded-2xl border border-[var(--hairline)] bg-[var(--surface-1)] p-6">
        <h2 className="font-semibold mb-4">プラットフォームを選択</h2>
        <div className="flex gap-3">
          {PLATFORMS.map((p) => (
            <button
              key={p.slug}
              onClick={() => setPlatform(p.slug)}
              className={`rounded-xl border px-5 py-2.5 text-sm font-medium transition-colors ${
                platform === p.slug
                  ? "border-[var(--focus-primary)] bg-[var(--focus-primary)]/15 text-[var(--focus-secondary)]"
                  : "border-[var(--hairline)] text-[var(--ink-muted)] hover:bg-[var(--surface-2)]"
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* Drop zone */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => fileRef.current?.click()}
        className="rounded-2xl border-2 border-dashed border-[var(--hairline-mid)] bg-[var(--surface-1)] hover:bg-[var(--surface-2)] p-12 text-center cursor-pointer transition-colors"
      >
        <input
          ref={fileRef}
          type="file"
          accept=".csv"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
        {status === "idle" && (
          <>
            <div className="text-5xl mb-4">📁</div>
            <p className="font-medium text-[var(--ink)] mb-2">
              CSVファイルをドロップ、またはクリックして選択
            </p>
            <p className="text-sm text-[var(--ink-muted)]">
              {PLATFORMS.find((p) => p.slug === platform)?.name} の配信データCSV
            </p>
          </>
        )}
        {status === "parsing" && (
          <p className="text-[var(--ink-muted)]">解析中...</p>
        )}
        {status === "uploading" && (
          <div>
            <div className="text-2xl mb-3">⬆️</div>
            <p className="font-medium">{rowCount}件のデータをインポート中...</p>
          </div>
        )}
        {status === "done" && (
          <div>
            <div className="text-4xl mb-3">✅</div>
            <p className="font-semibold text-[var(--accent-green)]">
              {rowCount}件のインポート完了
            </p>
            <button
              onClick={(e) => { e.stopPropagation(); reset(); }}
              className="mt-4 text-sm text-[var(--ink-muted)] hover:text-[var(--ink)] underline"
            >
              続けてインポートする
            </button>
          </div>
        )}
        {status === "error" && (
          <div>
            <div className="text-4xl mb-3">❌</div>
            <p className="font-medium text-[var(--accent-red)] mb-2">エラーが発生しました</p>
            <p className="text-sm text-[var(--ink-muted)]">{errorMsg}</p>
            <button
              onClick={(e) => { e.stopPropagation(); reset(); }}
              className="mt-4 text-sm text-[var(--ink-muted)] hover:text-[var(--ink)] underline"
            >
              やり直す
            </button>
          </div>
        )}
      </div>

      {/* Preview */}
      {preview.length > 0 && (
        <div className="rounded-2xl border border-[var(--hairline)] bg-[var(--surface-1)] p-6">
          <h3 className="font-semibold mb-4 text-sm">プレビュー（先頭3行）</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-[var(--hairline)]">
                  {Object.keys(preview[0]).map((k) => (
                    <th key={k} className="pb-2 pr-4 text-[var(--ink-subtle)] font-medium">
                      {k}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {preview.map((row, i) => (
                  <tr key={i} className="border-b border-[var(--hairline)] last:border-0">
                    {Object.values(row).map((v, j) => (
                      <td key={j} className="py-2 pr-4 text-[var(--ink-muted)] max-w-[160px] truncate">
                        {v}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CSV format guide */}
      <div className="rounded-2xl border border-[var(--hairline)] bg-[var(--surface-1)] p-6">
        <h3 className="font-semibold mb-4">CSVフォーマット</h3>
        <div className="space-y-4 text-sm text-[var(--ink-muted)]">
          {[
            {
              name: "SHOWROOM",
              cols: "配信日, 配信者名, 視聴者数(最大), 配信時間(分), ギフトポイント, 換算金額(円), 手数料(円), 支払額(円)",
            },
            {
              name: "17LIVE",
              cols: "配信日時, ライバー名, 配信時間, 最大視聴数, 総獲得ダイヤ, 円換算, プラットフォーム手数料, 精算額",
            },
            {
              name: "REALITY",
              cols: "配信日, ストリーマー名, 配信時間(分), 視聴者数(最大), 総ギフト(pt), 換算(円), 手数料(円), 支払(円)",
            },
          ].map((f) => (
            <div key={f.name}>
              <span className="font-medium text-[var(--ink)]">{f.name}：</span>
              <code className="ml-2 text-xs text-[var(--ink-subtle)]">{f.cols}</code>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
