import { NextResponse } from "next/server";
import { actId, inspectMetaConfig, graphGet, readPublishes } from "@/lib/meta";

export async function GET() {
  const local = await readPublishes();
  const { config } = await inspectMetaConfig();
  if (!config) {
    return NextResponse.json({
      local,
      remote: [],
      connected: false,
    });
  }

  try {
    const remote = await graphGet<{
      data?: Array<{
        id: string;
        name: string;
        status: string;
        effective_status?: string;
        insights?: {
          data?: Array<{
            impressions?: string;
            clicks?: string;
            spend?: string;
            ctr?: string;
            cpc?: string;
          }>;
        };
      }>;
    }>(`${actId(config.adAccountId)}/campaigns`, config.accessToken, {
      fields:
        "id,name,status,effective_status,insights.date_preset(last_7d){impressions,clicks,spend,ctr,cpc}",
      limit: "20",
    });
    return NextResponse.json({
      local,
      remote: remote.data ?? [],
      connected: true,
      accountId: config.adAccountId,
      currency: config.currency ?? "UYU",
    });
  } catch (error) {
    return NextResponse.json({
      local,
      remote: [],
      connected: true,
      accountId: config.adAccountId,
      currency: config.currency ?? "UYU",
      error: error instanceof Error ? error.message : "No se pudieron leer campañas",
    });
  }
}
