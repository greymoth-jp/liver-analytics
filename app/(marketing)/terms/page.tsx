import type { Metadata } from "next";

export const metadata: Metadata = { title: "利用規約" };

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-20">
      <h1 className="text-3xl font-bold mb-8">利用規約</h1>
      <p className="text-[var(--ink-muted)] mb-8">制定日：2026年5月30日</p>

      {[
        {
          title: "1. 本サービスについて",
          body: "LiverAnalytics（以下「本サービス」）は、ライバー事務所向けの投げ銭KPI管理SaaSです。",
        },
        {
          title: "2. 利用資格",
          body: "本サービスは事業者（法人・個人事業主）を対象とします。18歳未満の方は利用できません。",
        },
        {
          title: "3. 禁止事項",
          body: "不正アクセス、リバースエンジニアリング、第三者への再販、虚偽情報の登録を禁じます。",
        },
        {
          title: "4. 料金・支払い",
          body: "月額または年額のサブスクリプション料金をStripeにて決済します。自動継続となり、解約しない限り更新されます。",
        },
        {
          title: "5. 免責事項",
          body: "本サービスは参考情報を提供するものであり、税務・法律アドバイスを提供するものではありません。データの正確性について保証しません。",
        },
        {
          title: "6. 規約変更",
          body: "規約を変更する場合、登録メールアドレスに通知します。変更後も利用継続した場合、変更に同意したものとみなします。",
        },
        {
          title: "7. 準拠法・管轄",
          body: "本規約は日本法に準拠し、東京地方裁判所を専属的合意管轄裁判所とします。",
        },
      ].map((s) => (
        <section key={s.title} className="mb-8">
          <h2 className="text-xl font-semibold mb-3">{s.title}</h2>
          <p className="text-[var(--ink-muted)] leading-relaxed">{s.body}</p>
        </section>
      ))}
    </div>
  );
}
