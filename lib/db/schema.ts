import { sql, relations } from "drizzle-orm";
import {
  sqliteTable,
  text,
  integer,
  real,
  index,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

// ─── Better Auth tables ───────────────────────────────────────────────────────

export const user = sqliteTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("email_verified", { mode: "boolean" })
    .notNull()
    .default(false),
  image: text("image"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

export const session = sqliteTable("session", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  token: text("token").notNull().unique(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

export const account = sqliteTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: integer("access_token_expires_at", {
    mode: "timestamp",
  }),
  refreshTokenExpiresAt: integer("refresh_token_expires_at", {
    mode: "timestamp",
  }),
  scope: text("scope"),
  password: text("password"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

export const verification = sqliteTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

// ─── App: user settings ───────────────────────────────────────────────────────

export const userSettings = sqliteTable("user_settings", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .unique()
    .references(() => user.id, { onDelete: "cascade" }),
  plan: text("plan", { enum: ["free", "pro", "lifetime"] })
    .notNull()
    .default("free"),
  stripeCustomerId: text("stripe_customer_id"),
  subscriptionId: text("subscription_id"),
  onboarded: integer("onboarded", { mode: "boolean" }).notNull().default(false),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

// ─── App: agencies (ライバー事務所) ──────────────────────────────────────────

export const agencies = sqliteTable("agencies", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  nameKana: text("name_kana"),
  contactEmail: text("contact_email"),
  contactPerson: text("contact_person"),
  notes: text("notes"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

// ─── App: livers (ライバー) ───────────────────────────────────────────────────

export const livers = sqliteTable(
  "livers",
  {
    id: text("id").primaryKey(),
    agencyId: text("agency_id")
      .notNull()
      .references(() => agencies.id, { onDelete: "cascade" }),
    displayName: text("display_name").notNull(),
    realName: text("real_name"),
    showroomId: text("showroom_id"),
    seventeenLiveId: text("seventeen_live_id"),
    realityId: text("reality_id"),
    pocochaId: text("pococha_id"),
    twitcastingId: text("twitcasting_id"),
    status: text("status", {
      enum: ["active", "inactive", "graduated"],
    })
      .notNull()
      .default("active"),
    contractStartDate: integer("contract_start_date", { mode: "timestamp" }),
    contractEndDate: integer("contract_end_date", { mode: "timestamp" }),
    payoutRatePct: real("payout_rate_pct").notNull().default(50),
    notes: text("notes"),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
    updatedAt: integer("updated_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
  },
  (t) => [index("livers_agency_idx").on(t.agencyId)]
);

// ─── App: platforms ───────────────────────────────────────────────────────────

export const platforms = sqliteTable("platforms", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(), // 'showroom' | '17live' | 'reality' | 'pococha' | 'twitcasting'
  name: text("name").notNull(),
  currencyCode: text("currency_code").notNull().default("JPY"),
  pointToYenRate: real("point_to_yen_rate").notNull().default(1.0),
  csvSchema: text("csv_schema"), // JSON describing expected CSV columns
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

// ─── App: revenue entries (投げ銭) ────────────────────────────────────────────

export const revenues = sqliteTable(
  "revenues",
  {
    id: text("id").primaryKey(),
    liverId: text("liver_id")
      .notNull()
      .references(() => livers.id, { onDelete: "cascade" }),
    agencyId: text("agency_id")
      .notNull()
      .references(() => agencies.id, { onDelete: "cascade" }),
    platformSlug: text("platform_slug").notNull(),
    streamDate: integer("stream_date", { mode: "timestamp" }).notNull(),
    grossPoints: real("gross_points").notNull().default(0),
    grossYen: real("gross_yen").notNull().default(0),
    platformFeeYen: real("platform_fee_yen").notNull().default(0),
    netYen: real("net_yen").notNull().default(0),
    streamDurationMin: integer("stream_duration_min"),
    viewerPeak: integer("viewer_peak"),
    newFollowers: integer("new_followers"),
    importBatchId: text("import_batch_id"),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
  },
  (t) => [
    index("revenues_liver_idx").on(t.liverId),
    index("revenues_agency_date_idx").on(t.agencyId, t.streamDate),
    index("revenues_batch_idx").on(t.importBatchId),
  ]
);

// ─── App: payouts (報酬計算) ──────────────────────────────────────────────────

export const payouts = sqliteTable(
  "payouts",
  {
    id: text("id").primaryKey(),
    liverId: text("liver_id")
      .notNull()
      .references(() => livers.id, { onDelete: "cascade" }),
    agencyId: text("agency_id")
      .notNull()
      .references(() => agencies.id, { onDelete: "cascade" }),
    periodStart: integer("period_start", { mode: "timestamp" }).notNull(),
    periodEnd: integer("period_end", { mode: "timestamp" }).notNull(),
    totalNetYen: real("total_net_yen").notNull().default(0),
    payoutRatePct: real("payout_rate_pct").notNull(),
    payoutAmountYen: real("payout_amount_yen").notNull().default(0),
    agencyShareYen: real("agency_share_yen").notNull().default(0),
    status: text("status", {
      enum: ["draft", "confirmed", "paid"],
    })
      .notNull()
      .default("draft"),
    paidAt: integer("paid_at", { mode: "timestamp" }),
    notes: text("notes"),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
    updatedAt: integer("updated_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
  },
  (t) => [index("payouts_liver_period_idx").on(t.liverId, t.periodStart)]
);

// ─── App: contracts ───────────────────────────────────────────────────────────

export const contracts = sqliteTable("contracts", {
  id: text("id").primaryKey(),
  liverId: text("liver_id")
    .notNull()
    .references(() => livers.id, { onDelete: "cascade" }),
  agencyId: text("agency_id")
    .notNull()
    .references(() => agencies.id, { onDelete: "cascade" }),
  payoutRatePct: real("payout_rate_pct").notNull(),
  minimumGuaranteeYen: real("minimum_guarantee_yen").notNull().default(0),
  incentiveThresholdYen: real("incentive_threshold_yen"),
  incentiveBonusPct: real("incentive_bonus_pct"),
  terms: text("terms"),
  startDate: integer("start_date", { mode: "timestamp" }).notNull(),
  endDate: integer("end_date", { mode: "timestamp" }),
  status: text("status", {
    enum: ["active", "expired", "terminated"],
  })
    .notNull()
    .default("active"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

// ─── App: KPI snapshots (月次集計) ────────────────────────────────────────────

export const kpiSnapshots = sqliteTable(
  "kpi_snapshots",
  {
    id: text("id").primaryKey(),
    liverId: text("liver_id")
      .notNull()
      .references(() => livers.id, { onDelete: "cascade" }),
    agencyId: text("agency_id")
      .notNull()
      .references(() => agencies.id, { onDelete: "cascade" }),
    periodYear: integer("period_year").notNull(),
    periodMonth: integer("period_month").notNull(), // 1-12
    totalStreams: integer("total_streams").notNull().default(0),
    totalStreamMinutes: integer("total_stream_minutes").notNull().default(0),
    totalGrossYen: real("total_gross_yen").notNull().default(0),
    totalNetYen: real("total_net_yen").notNull().default(0),
    avgViewerPeak: real("avg_viewer_peak"),
    totalNewFollowers: integer("total_new_followers").notNull().default(0),
    platformBreakdown: text("platform_breakdown"), // JSON: {showroom: yen, 17live: yen, ...}
    aiRevenueforecastYen: real("ai_revenue_forecast_yen"),
    aiInsight: text("ai_insight"),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
  },
  (t) => [
    uniqueIndex("kpi_liver_period_idx").on(
      t.liverId,
      t.periodYear,
      t.periodMonth
    ),
    index("kpi_agency_period_idx").on(t.agencyId, t.periodYear, t.periodMonth),
  ]
);

// ─── App: import batches ──────────────────────────────────────────────────────

export const importBatches = sqliteTable("import_batches", {
  id: text("id").primaryKey(),
  agencyId: text("agency_id")
    .notNull()
    .references(() => agencies.id, { onDelete: "cascade" }),
  platformSlug: text("platform_slug").notNull(),
  fileName: text("file_name").notNull(),
  rowCount: integer("row_count").notNull().default(0),
  status: text("status", {
    enum: ["pending", "processing", "done", "error"],
  })
    .notNull()
    .default("pending"),
  errorMessage: text("error_message"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

// ─── App: Stripe webhook idempotency ─────────────────────────────────────────

export const processedWebhooks = sqliteTable("processed_webhooks", {
  id: text("id").primaryKey(),
  stripeEventId: text("stripe_event_id").notNull().unique(),
  processedAt: integer("processed_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

// ─── Relations ────────────────────────────────────────────────────────────────

export const agenciesRelations = relations(agencies, ({ one, many }) => ({
  owner: one(user, { fields: [agencies.userId], references: [user.id] }),
  livers: many(livers),
  revenues: many(revenues),
  payouts: many(payouts),
  kpiSnapshots: many(kpiSnapshots),
  importBatches: many(importBatches),
}));

export const liversRelations = relations(livers, ({ one, many }) => ({
  agency: one(agencies, {
    fields: [livers.agencyId],
    references: [agencies.id],
  }),
  revenues: many(revenues),
  payouts: many(payouts),
  contracts: many(contracts),
  kpiSnapshots: many(kpiSnapshots),
}));

export const revenuesRelations = relations(revenues, ({ one }) => ({
  liver: one(livers, { fields: [revenues.liverId], references: [livers.id] }),
  agency: one(agencies, {
    fields: [revenues.agencyId],
    references: [agencies.id],
  }),
}));

export const payoutsRelations = relations(payouts, ({ one }) => ({
  liver: one(livers, { fields: [payouts.liverId], references: [livers.id] }),
  agency: one(agencies, {
    fields: [payouts.agencyId],
    references: [agencies.id],
  }),
}));

export const contractsRelations = relations(contracts, ({ one }) => ({
  liver: one(livers, {
    fields: [contracts.liverId],
    references: [livers.id],
  }),
  agency: one(agencies, {
    fields: [contracts.agencyId],
    references: [agencies.id],
  }),
}));

export const kpiSnapshotsRelations = relations(kpiSnapshots, ({ one }) => ({
  liver: one(livers, {
    fields: [kpiSnapshots.liverId],
    references: [livers.id],
  }),
  agency: one(agencies, {
    fields: [kpiSnapshots.agencyId],
    references: [agencies.id],
  }),
}));

export const userRelations = relations(user, ({ one, many }) => ({
  settings: one(userSettings, {
    fields: [user.id],
    references: [userSettings.userId],
  }),
  agencies: many(agencies),
}));
