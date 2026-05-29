import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "料金プラン",
  description: "LiverAnalyticsの料金プラン。月額¥49,800から。14日間無料トライアル。",
};

export default function PricingPage() {
  const plans = [
    {
      name: "スタータープラン",
      price: "¥29,800",
      period: "/月",
      annualNote: "年払い ¥298,000（2ヶ月分お得）",
      description: "小規模事務所向け",
      features: [
        "ライバー登録数：最大10名",
        "CSV一括インポート",
        "ライバー別KPIダッシュボード",
        "自動報酬計算",
        "SHOWROOM・17LIVE対応",
        "メールサポート",
      ],
      cta: "14日間無料で試す",
      highlight: false,
    },
    {
      name: "プロフェッショナル",
      price: "¥49,800",
      period: "/月",
      annualNote: "年払い ¥498,000（2ヶ月分お得）",
      description: "中規模事務所向け（推奨）",
      features: [
        "ライバー登録数：最大50名",
        "全プラットフォーム対応（SHOWROOM・17LIVE・REALITY他）",
        "AI売上予測（Claude Haiku）",
        "月次レポート自動生成",
        "インセンティブ報酬計算",
        "優先サポート",
        "Capacitorモバイルアプリ",
      ],
      cta: "14日間無料で試す",
      highlight: true,
    },
    {
      name: "エンタープライズ",
      price: "お問い合わせ",
      period: "",
      annualNote: "",
      description: "100名以上の大規模事務所",
      features: [
        "ライバー登録数：無制限",
        "専用オンボーディング支援",
        "カスタムCSVスキーマ対応",
        "API連携開発対応",
        "SLA保証",
        "専任カスタマーサクセス",
      ],
      cta: "お問い合わせ",
      highlight: false,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-20">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">料金プラン</h1>
        <p className="text-[var(--ink-muted)] text-lg">
          14日間の無料トライアル後にプランを選択。クレジットカード不要。
        </p>
      </div>

      <div className="grid sm:grid-cols-3 gap-6 mb-16">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`rounded-2xl border p-8 flex flex-col ${
              plan.highlight
                ? "border-[var(--focus-primary)] bg-[var(--surface-2)] ring-1 ring-[var(--focus-glow)]"
                : "border-[var(--hairline)] bg-[var(--surface-1)]"
            }`}
          >
            {plan.highlight && (
              <div className="text-xs font-semibold text-[var(--focus-secondary)] mb-3 uppercase tracking-wider">
                人気プラン
              </div>
            )}
            <h2 className="text-xl font-bold mb-1">{plan.name}</h2>
            <p className="text-[var(--ink-muted)] text-sm mb-4">{plan.description}</p>
            <div className="mb-1">
              <span className="text-4xl font-bold font-[var(--font-mono)]">{plan.price}</span>
              <span className="text-[var(--ink-muted)] text-sm">{plan.period}</span>
            </div>
            {plan.annualNote && (
              <p className="text-[var(--accent-green)] text-xs mb-6">{plan.annualNote}</p>
            )}
            <ul className="flex-1 space-y-3 mb-8">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-[var(--ink-muted)]">
                  <span className="text-[var(--accent-green)] mt-0.5">✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <a
              href="/login"
              className={`block text-center rounded-xl py-3 font-semibold transition-colors ${
                plan.highlight
                  ? "bg-[var(--focus-primary)] hover:bg-[var(--focus-secondary)] text-white"
                  : "border border-[var(--hairline-mid)] hover:bg-[var(--surface-2)] text-[var(--ink)]"
              }`}
            >
              {plan.cta}
            </a>
          </div>
        ))}
      </div>

      {/* 特商法 */}
      <div className="border border-[var(--hairline)] rounded-2xl bg-[var(--surface-1)] p-8">
        <h2 className="text-xl font-bold mb-6">特定商取引法に基づく表記</h2>
        <dl className="grid sm:grid-cols-2 gap-4 text-sm">
          {[
            ["販売業者", "greymoth-jp（個人事業主）"],
            ["代表者", "非公開（請求があれば開示）"],
            ["所在地", "非公開（請求があれば開示）"],
            ["電話番号", "非公開（請求があれば開示）"],
            ["お問い合わせ", "support@liver-analytics.jp"],
            ["販売価格", "各プランページに表示の金額（税込）"],
            ["支払方法", "クレジットカード（Stripe経由）"],
            ["支払時期", "申込日より毎月または毎年自動更新"],
            ["提供時期", "決済完了後すぐにサービス利用可能"],
            ["返金・キャンセル", "解約はいつでも可能。返金対応なし（特別な事情はサポートに相談）"],
            ["動作環境", "最新のChrome・Firefox・Safari・Edge"],
            ["特記事項", "サービス内容は予告なく変更される場合があります"],
          ].map(([k, v]) => (
            <div key={k}>
              <dt className="text-[var(--ink-subtle)] mb-1">{k}</dt>
              <dd className="text-[var(--ink-muted)]">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
