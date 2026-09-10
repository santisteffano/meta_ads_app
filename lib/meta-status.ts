import type { MetaCity } from "@/lib/meta-targeting";

export type MetaStatus = {
  connected: boolean;
  source?: "none" | "file" | "env" | "invalid";
  accountName?: string;
  accountId?: string;
  currency?: string;
  currencyOffset?: number;
  pageId?: string;
  pageName?: string;
  instagramActorId?: string;
  tokenHint?: string;
  dailyBudgetMinor?: number;
  dailyBudget?: number;
  cities?: MetaCity[];
  error?: string;
};
