import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center text-center px-6">
      <div>
        <p className="font-[var(--font-mono)] text-sm text-[var(--ink-subtle)] mb-4">404</p>
        <h1 className="text-3xl font-bold mb-4">ページが見つかりません</h1>
        <p className="text-[var(--ink-muted)] mb-8">
          お探しのページは移動または削除された可能性があります。
        </p>
        <Link
          href="/"
          className="inline-flex rounded-xl bg-[var(--focus-primary)] hover:bg-[var(--focus-secondary)] text-white font-medium px-6 py-3 transition-colors"
        >
          トップへ戻る
        </Link>
      </div>
    </div>
  );
}
