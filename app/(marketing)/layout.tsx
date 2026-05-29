import type { Metadata } from "next";
import { SiteHeader } from "@/components/ui/SiteHeader";

export const metadata: Metadata = {
  robots: "index, follow",
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <footer className="border-t border-[var(--hairline)] py-8 px-6 text-center text-[var(--ink-subtle)] text-sm">
        <p>© 2026 LiverAnalytics. All rights reserved.</p>
        <div className="flex justify-center gap-6 mt-2">
          <a href="/privacy" className="hover:text-[var(--ink-muted)] transition-colors">プライバシーポリシー</a>
          <a href="/terms" className="hover:text-[var(--ink-muted)] transition-colors">利用規約</a>
          <a href="/tokushoho" className="hover:text-[var(--ink-muted)] transition-colors">特定商取引法</a>
        </div>
      </footer>
    </div>
  );
}
