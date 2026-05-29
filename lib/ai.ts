import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY ?? "",
});

export interface ForecastInput {
  liverId: string;
  liverName: string;
  platform: string;
  last3MonthsRevenue: number[];
  avgStreamMinutes: number;
  avgViewerPeak: number;
}

export async function generateRevenueForecast(
  input: ForecastInput
): Promise<{ forecastYen: number; insight: string }> {
  const trend =
    input.last3MonthsRevenue.length === 3
      ? input.last3MonthsRevenue.map((v, i) => `${i + 1}ヶ月前: ¥${v.toLocaleString()}`).join(", ")
      : "データ不足";

  const message = await client.messages.create({
    model: "claude-haiku-4-5",
    max_tokens: 400,
    system:
      "あなたはライバー事務所向けのKPIアナリストです。データに基づいた簡潔な売上予測と改善提案を日本語で提供します。数値は必ず¥表記で。",
    messages: [
      {
        role: "user",
        content: `ライバー「${input.liverName}」(${input.platform})の来月売上予測を出してください。
直近3ヶ月の収益: ${trend}
平均配信時間: ${input.avgStreamMinutes}分
平均最大視聴者数: ${input.avgViewerPeak}人

JSON形式で返答: {"forecastYen": number, "insight": "string(100文字以内)"}`,
      },
    ],
  });

  try {
    const text =
      message.content[0].type === "text" ? message.content[0].text : "{}";
    const match = text.match(/\{[\s\S]*\}/);
    const parsed = JSON.parse(match?.[0] ?? "{}");
    return {
      forecastYen: typeof parsed.forecastYen === "number" ? parsed.forecastYen : 0,
      insight: typeof parsed.insight === "string" ? parsed.insight : "",
    };
  } catch {
    return { forecastYen: 0, insight: "予測データの解析に失敗しました。" };
  }
}

export async function generateAgencyInsight(data: {
  agencyName: string;
  totalLivers: number;
  monthlyRevenue: number;
  topPlatform: string;
  growthRate: number;
}): Promise<string> {
  const message = await client.messages.create({
    model: "claude-haiku-4-5",
    max_tokens: 300,
    system:
      "ライバー事務所KPIアナリストとして、事務所全体の経営改善提案を150文字以内で日本語で提供します。",
    messages: [
      {
        role: "user",
        content: `事務所「${data.agencyName}」の今月サマリー:
- 所属ライバー数: ${data.totalLivers}名
- 月間総収益: ¥${data.monthlyRevenue.toLocaleString()}
- 主力プラットフォーム: ${data.topPlatform}
- 前月比成長率: ${data.growthRate.toFixed(1)}%

経営改善のための一言アドバイスを提供してください。`,
      },
    ],
  });

  return message.content[0].type === "text"
    ? message.content[0].text
    : "分析データを蓄積中です。";
}
