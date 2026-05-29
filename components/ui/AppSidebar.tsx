"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  name: string;
  email: string;
  image?: string | null;
}

const NAV = [
  { href: "/dashboard", label: "ダッシュボード", icon: "📊" },
  { href: "/livers", label: "ライバー管理", icon: "🎙️" },
  { href: "/import", label: "CSVインポート", icon: "📁" },
  { href: "/payouts", label: "報酬計算", icon: "💴" },
  { href: "/reports", label: "レポート", icon: "📈" },
  { href: "/settings", label: "設定", icon: "⚙️" },
];

export function AppSidebar({ user }: { user: User }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    await authClient.signOut();
    router.push("/login");
  }

  return (
    <aside className="w-64 border-r border-[var(--hairline)] flex flex-col bg-[var(--canvas)] shrink-0 h-screen">
      <div className="p-6 border-b border-[var(--hairline)]">
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
          <span className="font-bold text-[var(--ink)] leading-tight">
            LiverAnalytics
          </span>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {NAV.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-[var(--focus-primary)]/15 text-[var(--focus-secondary)]"
                  : "text-[var(--ink-muted)] hover:bg-[var(--surface-1)] hover:text-[var(--ink)]"
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[var(--hairline)]">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-[var(--surface-3)] flex items-center justify-center text-sm font-semibold text-[var(--ink)]">
            {user.name?.[0]?.toUpperCase() ?? "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user.name}</p>
            <p className="text-xs text-[var(--ink-subtle)] truncate">{user.email}</p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="w-full text-left text-xs text-[var(--ink-subtle)] hover:text-[var(--ink-muted)] transition-colors px-1"
        >
          サインアウト
        </button>
      </div>
    </aside>
  );
}
