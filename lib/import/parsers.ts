/**
 * CSV parsers for SHOWROOM, 17LIVE, REALITY
 * Each platform exports different column names.
 * Returns normalized RevenueRow[]
 */

export interface RevenueRow {
  liverId?: string; // resolved after matching liver
  platformSlug: string;
  streamDate: Date;
  grossPoints: number;
  grossYen: number;
  platformFeeYen: number;
  netYen: number;
  streamDurationMin?: number;
  viewerPeak?: number;
  newFollowers?: number;
  rawDisplayName?: string; // for matching to liver record
}

function parseJpDate(s: string): Date {
  // handles yyyy/mm/dd, yyyy-mm-dd, yyyy年mm月dd日
  const normalized = s.replace(/年|月/g, "-").replace(/日/g, "").trim();
  const d = new Date(normalized);
  if (isNaN(d.getTime())) throw new Error(`Invalid date: ${s}`);
  return d;
}

function num(v: string | undefined): number {
  if (!v) return 0;
  return parseFloat(v.replace(/,/g, "").replace(/¥/g, "").trim()) || 0;
}

// SHOWROOM: 配信日,配信者名,視聴者数(最大),配信時間(分),ギフトポイント,換算金額(円),手数料(円),支払額(円)
export function parseShowroomCsv(rows: Record<string, string>[]): RevenueRow[] {
  return rows
    .filter((r) => r["配信日"] || r["stream_date"])
    .map((r) => {
      const grossYen = num(r["換算金額(円)"] ?? r["gross_yen"]);
      const platformFeeYen = num(r["手数料(円)"] ?? r["platform_fee_yen"]);
      return {
        platformSlug: "showroom",
        streamDate: parseJpDate(r["配信日"] ?? r["stream_date"] ?? ""),
        grossPoints: num(r["ギフトポイント"] ?? r["gift_points"]),
        grossYen,
        platformFeeYen,
        netYen: num(r["支払額(円)"] ?? r["net_yen"]) || grossYen - platformFeeYen,
        streamDurationMin: r["配信時間(分)"] ? parseInt(r["配信時間(分)"]) : undefined,
        viewerPeak: r["視聴者数(最大)"] ? parseInt(r["視聴者数(最大)"].replace(/,/g, "")) : undefined,
        rawDisplayName: r["配信者名"] ?? r["liver_name"],
      };
    });
}

// 17LIVE: 配信日時,ライバー名,配信時間,最大視聴数,総獲得ダイヤ,円換算,プラットフォーム手数料,精算額
export function parseSeventeenLiveCsv(rows: Record<string, string>[]): RevenueRow[] {
  return rows
    .filter((r) => r["配信日時"] || r["stream_date"])
    .map((r) => {
      const grossYen = num(r["円換算"] ?? r["gross_yen"]);
      const platformFeeYen = num(r["プラットフォーム手数料"] ?? r["platform_fee_yen"]);
      return {
        platformSlug: "17live",
        streamDate: parseJpDate(r["配信日時"] ?? r["stream_date"] ?? ""),
        grossPoints: num(r["総獲得ダイヤ"] ?? r["diamonds"]),
        grossYen,
        platformFeeYen,
        netYen: num(r["精算額"] ?? r["net_yen"]) || grossYen - platformFeeYen,
        streamDurationMin: r["配信時間"] ? parseInt(r["配信時間"]) : undefined,
        viewerPeak: r["最大視聴数"] ? parseInt(r["最大視聴数"].replace(/,/g, "")) : undefined,
        rawDisplayName: r["ライバー名"] ?? r["liver_name"],
      };
    });
}

// REALITY: 配信日,ストリーマー名,配信時間(分),視聴者数(最大),総ギフト(pt),換算(円),手数料(円),支払(円)
export function parseRealityCsv(rows: Record<string, string>[]): RevenueRow[] {
  return rows
    .filter((r) => r["配信日"] || r["stream_date"])
    .map((r) => {
      const grossYen = num(r["換算(円)"] ?? r["gross_yen"]);
      const platformFeeYen = num(r["手数料(円)"] ?? r["platform_fee_yen"]);
      return {
        platformSlug: "reality",
        streamDate: parseJpDate(r["配信日"] ?? r["stream_date"] ?? ""),
        grossPoints: num(r["総ギフト(pt)"] ?? r["gift_points"]),
        grossYen,
        platformFeeYen,
        netYen: num(r["支払(円)"] ?? r["net_yen"]) || grossYen - platformFeeYen,
        streamDurationMin: r["配信時間(分)"] ? parseInt(r["配信時間(分)"]) : undefined,
        viewerPeak: r["視聴者数(最大)"] ? parseInt(r["視聴者数(最大)"].replace(/,/g, "")) : undefined,
        rawDisplayName: r["ストリーマー名"] ?? r["liver_name"],
      };
    });
}

export function getPlatformParser(
  slug: string
): (rows: Record<string, string>[]) => RevenueRow[] {
  switch (slug) {
    case "showroom":
      return parseShowroomCsv;
    case "17live":
      return parseSeventeenLiveCsv;
    case "reality":
      return parseRealityCsv;
    default:
      throw new Error(`Unknown platform: ${slug}`);
  }
}
