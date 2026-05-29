import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "LiverAnalyticsについて",
};

export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-20">
      <h1 className="text-3xl font-bold mb-8">About</h1>
      <div className="space-y-6 text-[var(--ink-muted)] leading-relaxed">
        <p>
          LiverAnalyticsは、ライバー事務所が抱える「各プラットフォームの配信データを手動集計する」という
          構造的な課題を解決するために開発されました。
        </p>
        <p>
          SHOWROOM・17LIVE・REALITYなど複数プラットフォームで活動するライバーを抱える事務所では、
          毎月の投げ銭集計・報酬計算が大きな工数を占めています。
          その作業を自動化し、経営判断に集中できる環境を作ることが私たちのミッションです。
        </p>
        <p>
          開発者：greymoth-jp（個人開発者）
          <br />
          お問い合わせ：support@liver-analytics.jp
        </p>
      </div>
    </div>
  );
}
