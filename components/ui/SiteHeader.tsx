"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--hairline)] bg-[var(--canvas)]/90 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
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
          <span className="font-bold text-[var(--ink)] text-lg tracking-tight">
            LiverAnalytics
          </span>
        </Link>

        <nav className="hidden sm:flex items-center gap-6 text-sm text-[var(--ink-muted)]">
          <Link
            href="/pricing"
            className={`hover:text-[var(--ink)] transition-colors ${
              pathname === "/pricing" ? "text-[var(--ink)]" : ""
            }`}
          >
            料金
          </Link>
          <Link
            href="/about"
            className={`hover:text-[var(--ink)] transition-colors ${
              pathname === "/about" ? "text-[var(--ink)]" : ""
            }`}
          >
            About
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm text-[var(--ink-muted)] hover:text-[var(--ink)] transition-colors"
          >
            ログイン
          </Link>
          <Link
            href="/login"
            className="rounded-lg bg-[var(--focus-primary)] hover:bg-[var(--focus-secondary)] text-white text-sm font-medium px-4 py-2 transition-colors"
          >
            無料で始める
          </Link>
        </div>
      </div>
    </header>
  );
}
