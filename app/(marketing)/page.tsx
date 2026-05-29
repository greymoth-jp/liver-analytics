import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export default async function HomePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden px-6 py-24 sm:py-36 text-center">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(99,102,241,0.15) 0%, transparent 70%)",
          }}
        />
        <div className="relative max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--hairline)] bg-[var(--surface-1)] px-4 py-1.5 text-sm text-[var(--ink-muted)] mb-8">
            <span className="w-2 h-2 rounded-full bg-[var(--accent-green)] animate-pulse" />
            ライバー事務所200社以上が抱える集計地獄を解決
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold text-[var(--ink)] leading-tight mb-6">
            複数プラットフォームの
            <br />
            <span className="text-[var(--focus-secondary)]">投げ銭KPI</span>を
            <br />
            一元管理
          </h1>
          <p className="text-lg sm:text-xl text-[var(--ink-muted)] max-w-2xl mx-auto mb-10">
            SHOWROOM・17LIVE・REALITYなど各プラットフォームのCSVをインポートするだけ。
            ライバー別収益・報酬計算・AI売上予測を自動化します。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/login"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--focus-primary)] hover:bg-[var(--focus-secondary)] text-white font-semibold px-8 py-3.5 transition-colors text-base"
            >
              無料で始める
            </a>
            <a
              href="/pricing"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--hairline-mid)] bg-[var(--surface-1)] hover:bg-[var(--surface-2)] text-[var(--ink)] font-medium px-8 py-3.5 transition-colors text-base"
            >
              料金を見る
            </a>
          </div>
        </div>
      </section>

      {/* Pain points */}
      <section className="px-6 py-20 max-w-5xl mx-auto w-full">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12">
          こんな課題ありませんか？
        </h2>
        <div className="grid sm:grid-cols-3 gap-6">
          {[
            {
              icon: "📊",
              title: "プラットフォームごとにバラバラ",
              body: "SHOWROOM・17LIVE・REALITYをそれぞれ手動で集計。毎月の工数が膨大。",
            },
            {
              icon: "💴",
              title: "報酬計算がミスだらけ",
              body: "Excelで計算すると計算ミスが発生。ライバーからの問い合わせが絶えない。",
            },
            {
              icon: "📈",
              title: "成長戦略が立てられない",
              body: "データはあるのに可視化できず、どのライバーに注力すべきかわからない。",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-[var(--hairline)] bg-[var(--surface-1)] p-6"
            >
              <div className="text-3xl mb-4">{item.icon}</div>
              <h3 className="font-semibold text-[var(--ink)] mb-2">{item.title}</h3>
              <p className="text-[var(--ink-muted)] text-sm leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-20 bg-[var(--surface-1)]">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12">
            LiverAnalyticsが解決します
          </h2>
          <div className="grid sm:grid-cols-2 gap-8">
            {[
              {
                title: "CSV一括インポート",
                body: "SHOWROOM・17LIVE・REALITYのCSVをドラッグ&ドロップ。自動でライバーにマッピング。",
                badge: "Core",
              },
              {
                title: "ライバー別KPIダッシュボード",
                body: "投げ銭収益・視聴者数・配信時間をグラフで一覧。プラットフォーム横断比較も。",
                badge: "Core",
              },
              {
                title: "自動報酬計算",
                body: "契約ごとの報酬率設定で報酬額を瞬時に算出。インセンティブボーナスも対応。",
                badge: "Core",
              },
              {
                title: "AI売上予測",
                body: "Claude Haikuが過去3ヶ月のトレンドから来月の売上を予測。経営判断をサポート。",
                badge: "AI",
              },
              {
                title: "月次レポート自動生成",
                body: "ライバー別・事務所全体の月次サマリーをワンクリックで出力。",
                badge: "Pro",
              },
              {
                title: "Capacitorモバイルアプリ",
                body: "外出先でもスマホからKPIをチェック。事務所マネージャー向け。",
                badge: "Mobile",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="flex gap-4 rounded-2xl border border-[var(--hairline)] bg-[var(--surface-2)] p-6"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-[var(--ink)]">{f.title}</h3>
                    <span className="text-xs rounded-full bg-[var(--focus-primary)] text-white px-2 py-0.5 font-medium">
                      {f.badge}
                    </span>
                  </div>
                  <p className="text-[var(--ink-muted)] text-sm leading-relaxed">{f.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">今すぐ無料で始める</h2>
          <p className="text-[var(--ink-muted)] mb-8">
            クレジットカード不要。14日間のトライアル後にプランを選択。
          </p>
          <a
            href="/login"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--focus-primary)] hover:bg-[var(--focus-secondary)] text-white font-semibold px-10 py-4 transition-colors text-lg"
          >
            無料トライアル開始
          </a>
        </div>
      </section>
    </div>
  );
}
