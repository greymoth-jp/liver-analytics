import type { Metadata } from "next";

export const metadata: Metadata = { title: "プライバシーポリシー" };

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-20 prose prose-invert">
      <h1 className="text-3xl font-bold mb-8">プライバシーポリシー</h1>
      <p className="text-[var(--ink-muted)] mb-8">制定日：2026年5月30日</p>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">1. 取得する情報</h2>
        <ul className="text-[var(--ink-muted)] space-y-2 list-disc pl-5">
          <li>メールアドレス、表示名（認証時）</li>
          <li>ライバー収益データ、配信データ（CSVインポート）</li>
          <li>ブラウザ情報・IPアドレス（セキュリティ目的）</li>
          <li>利用状況データ（PostHog経由、匿名集計）</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">2. 利用目的</h2>
        <ul className="text-[var(--ink-muted)] space-y-2 list-disc pl-5">
          <li>サービスの提供・改善</li>
          <li>サポート対応</li>
          <li>課金・決済処理（Stripe）</li>
          <li>不正利用防止</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">3. 第三者提供</h2>
        <p className="text-[var(--ink-muted)]">
          法令に基づく場合を除き、ユーザーの同意なく第三者に個人情報を提供しません。
          決済処理にStripe、メール送信にResend、エラー監視にSentryを使用します。
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">4. データの保管</h2>
        <p className="text-[var(--ink-muted)]">
          データはTurso（libSQL）に暗号化して保存されます。退会時にはデータを削除します。
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">5. お問い合わせ</h2>
        <p className="text-[var(--ink-muted)]">
          プライバシーに関するお問い合わせ：support@liver-analytics.jp
        </p>
      </section>
    </div>
  );
}
