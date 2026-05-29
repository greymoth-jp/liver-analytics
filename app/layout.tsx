import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "LiverAnalytics — ライバー事務所向けKPI管理",
    template: "%s | LiverAnalytics",
  },
  description:
    "SHOWROOM・17LIVE・REALITYなど複数プラットフォームの投げ銭KPIを一元管理。ライバー事務所向けB2B SaaS。",
  keywords: ["ライバー", "事務所", "投げ銭", "KPI", "SHOWROOM", "17LIVE", "REALITY"],
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName: "LiverAnalytics",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#0b0f1a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full`}
    >
      <body className="min-h-full flex flex-col bg-[var(--canvas)] text-[var(--ink)]">
        {children}
      </body>
    </html>
  );
}
