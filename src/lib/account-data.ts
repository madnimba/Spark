/**
 * Dashboard fixture data.
 *
 * Entirely invented, and internally consistent: the category rows sum to the
 * month's spend, and each row's `saved` is its `spend × rate`. Keeping those
 * identities true matters — a dashboard whose totals don't reconcile reads as
 * broken even when nobody checks the arithmetic.
 */

export type Category = {
  name: string;
  /** Taka spent this month. */
  spend: number;
  /** Taka returned by the Spark discount. */
  saved: number;
  /** Discount rate applied, in percent. Spark caps at 5%. */
  rate: number;
  txns: number;
};

export const MAX_DISCOUNT = 5;

export const CATEGORIES: Category[] = [
  { name: "Groceries", spend: 18400, saved: 920, rate: 5, txns: 24 },
  { name: "Restaurants & cafés", spend: 12650, saved: 632, rate: 5, txns: 31 },
  { name: "Gadgets", spend: 11200, saved: 336, rate: 3, txns: 4 },
  { name: "Fashion", spend: 9700, saved: 485, rate: 5, txns: 9 },
  { name: "Ride hailing", spend: 8900, saved: 356, rate: 4, txns: 62 },
  { name: "Education & test fees", spend: 6500, saved: 130, rate: 2, txns: 2 },
  { name: "Streaming & AI", spend: 4280, saved: 128, rate: 3, txns: 7 },
  { name: "Travel", spend: 3220, saved: 97, rate: 3, txns: 3 },
];

export const MONTHS = [
  { m: "Mar", spend: 51200, saved: 1740 },
  { m: "Apr", spend: 58400, saved: 2010 },
  { m: "May", spend: 63900, saved: 2380 },
  { m: "Jun", spend: 61200, saved: 2260 },
  { m: "Jul", spend: 70600, saved: 2815 },
  { m: "Aug", spend: 74850, saved: 3084 },
];

export const ACCOUNT = {
  holder: "Wasif Rahman",
  cardLast4: "8421",
  cardDesignId: "bolt",
  memberSince: "March 2026",
  period: "August 2026",
  income: 92000,
  branch: "Bashundhara Branch",
  pickupDays: 2,
  /** 0 = received · 1 = confirmed · 2 = ready for pickup */
  applicationStage: 2 as 0 | 1 | 2,
};

/* ---------------------------------------------------------------- derived -- */

export const spend = CATEGORIES.reduce((s, c) => s + c.spend, 0);
export const saved = CATEGORIES.reduce((s, c) => s + c.saved, 0);
export const txns = CATEGORIES.reduce((s, c) => s + c.txns, 0);

export const leftover = ACCOUNT.income - spend;
export const spendRatio = spend / ACCOUNT.income;
export const effectiveRate = (saved / spend) * 100;

const prev = MONTHS[MONTHS.length - 2];
export const spendDelta = ((spend - prev.spend) / prev.spend) * 100;
export const savedDelta = ((saved - prev.saved) / prev.saved) * 100;

export const top = [...CATEGORIES].sort((a, b) => b.spend - a.spend);
export const bestSaver = [...CATEGORIES].sort((a, b) => b.saved - a.saved)[0];
export const foodShare =
  ((CATEGORIES.find((c) => c.name === "Groceries")!.spend +
    CATEGORIES.find((c) => c.name === "Restaurants & cafés")!.spend) /
    spend) *
  100;

/** What the month would have returned at the full 5% everywhere. */
export const potentialSaved = Math.round((spend * MAX_DISCOUNT) / 100);
export const missedSaved = potentialSaved - saved;

/** Categories not yet earning the full rate, biggest opportunity first. */
export const belowCap = CATEGORIES.filter((c) => c.rate < MAX_DISCOUNT).sort(
  (a, b) => b.spend * (MAX_DISCOUNT - b.rate) - a.spend * (MAX_DISCOUNT - a.rate)
);

export const tk = (n: number) => `৳${Math.round(n).toLocaleString("en-US")}`;
export const pct = (n: number, dp = 1) => `${n.toFixed(dp)}%`;
