import { NextResponse } from "next/server";
import {
  actId,
  graphGet,
  inspectMetaConfig,
  maskToken,
} from "@/lib/meta";
import { currencyOffset, toMajor } from "@/lib/money";
import type { MetaStatus } from "@/lib/meta-status";

export async function GET() {
  const { config, source } = await inspectMetaConfig();
  if (!config) {
    return NextResponse.json({
      connected: false,
      source: "none",
    } satisfies MetaStatus);
  }

  try {
    const account = await graphGet<{
      name: string;
      currency: string;
      account_id: string;
    }>(`${actId(config.adAccountId)}`, config.accessToken, {
      fields: "name,currency,account_id",
    });
    let pageName = config.pageName;
    try {
      const page = await graphGet<{ name: string }>(config.pageId, config.accessToken, {
        fields: "name",
      });
      pageName = page.name;
    } catch {
      // page lookup is optional
    }
    const currency = account.currency || config.currency || "UYU";
    return NextResponse.json({
      connected: true,
      source,
      accountName: account.name,
      accountId: account.account_id,
      currency,
      currencyOffset: currencyOffset(currency),
      pageId: config.pageId,
      pageName,
      instagramActorId: config.instagramActorId,
      tokenHint: maskToken(config.accessToken),
      dailyBudgetMinor: config.dailyBudgetMinor,
      dailyBudget: toMajor(config.dailyBudgetMinor, currency),
      cities: config.cities,
    } satisfies MetaStatus);
  } catch (error) {
    return NextResponse.json({
      connected: false,
      source: "invalid",
      accountId: config.adAccountId,
      pageId: config.pageId,
      tokenHint: maskToken(config.accessToken),
      dailyBudgetMinor: config.dailyBudgetMinor,
      error: error instanceof Error ? error.message : "No se pudo hablar con Meta",
    } satisfies MetaStatus);
  }
}
