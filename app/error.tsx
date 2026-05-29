"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center text-center px-6">
      <div>
        <p className="font-[var(--font-mono)] text-sm text-[var(--ink-subtle)] mb-4">500</p>
        <h1 className="text-3xl font-bold mb-4">エラーが発生しました</h1>
        <p className="text-[var(--ink-muted)] mb-8 text-sm">
          {error.message || "予期しないエラーが発生しました。"}
        </p>
        <button
          onClick={reset}
          className="inline-flex rounded-xl bg-[var(--focus-primary)] hover:bg-[var(--focus-secondary)] text-white font-medium px-6 py-3 transition-colors"
        >
          再試行
        </button>
      </div>
    </div>
  );
}
