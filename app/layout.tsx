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
    default: "LiverAnalytics â€” ãƒ©ã‚¤ãƒãƒ¼äº‹å‹™æ‰€å‘ã‘KPIç®¡ç†",
    template: "%s | LiverAnalytics",
  },
  description:
    "SHOWROOMãƒ»17LIVEãƒ»REALITYãªã©è¤‡æ•°ãƒ—ãƒ©ãƒƒãƒˆãƒ•ã‚©ãƒ¼ãƒ ã®æŠ•ã’éŠ­KPIã‚’ä¸€å…ƒç®¡ç†ã€‚ãƒ©ã‚¤ãƒãƒ¼äº‹å‹™æ‰€å‘ã‘B2B SaaSã€‚",
  keywords: ["ãƒ©ã‚¤ãƒãƒ¼", "äº‹å‹™æ‰€", "æŠ•ã’éŠ­", "KPI", "SHOWROOM", "17LIVE", "REALITY"],
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName: "LiverAnalytics",
  },
  icons: {
    icon: [
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  other: {
    'apple-itunes-app': 'app-id=PLACEHOLDER_APP_ID',
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
