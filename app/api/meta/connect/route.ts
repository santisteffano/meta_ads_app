import { NextResponse } from "next/server";
import { z } from "zod";
import {
  actId,
  clearMetaConfig,
  graphGet,
  readMetaConfig,
  resolveShippingCities,
  writeMetaConfig,
} from "@/lib/meta";
import { toMinor } from "@/lib/money";

const schema = z.object({
  accessToken: z.string().optional(),
  adAccountId: z.string().min(3),
  pageId: z.string().min(3),
  instagramActorId: z.string().optional(),
  dailyBudget: z.coerce.number().positive().min(1),
});

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
  }

  const existing = await readMetaConfig();
  const accessToken = parsed.data.accessToken?.trim() || existing?.accessToken;
  if (!accessToken) {
    return NextResponse.json(
      { error: "Pegá un access token de larga duración." },
      { status: 400 },
    );
  }

  try {
    const account = await graphGet<{
      name: string;
      currency: string;
      account_id: string;
    }>(`${actId(parsed.data.adAccountId)}`, accessToken, {
      fields: "name,currency,account_id",
    });
    const page = await graphGet<{ id: string; name: string }>(
      parsed.data.pageId.trim(),
      accessToken,
      { fields: "id,name" },
    );
    const cities = await resolveShippingCities(accessToken);
    await writeMetaConfig({
      accessToken,
      adAccountId: parsed.data.adAccountId,
      pageId: page.id,
      instagramActorId: parsed.data.instagramActorId?.trim() || undefined,
      dailyBudgetMinor: toMinor(parsed.data.dailyBudget, account.currency),
      currency: account.currency,
      accountName: account.name,
      pageName: page.name,
      cities,
    });
    return NextResponse.json({
      ok: true,
      accountName: account.name,
      pageName: page.name,
      currency: account.currency,
      cities,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Meta rechazó el token, la cuenta o la Page",
      },
      { status: 400 },
    );
  }
}

export async function DELETE() {
  await clearMetaConfig();
  return NextResponse.json({ ok: true });
}
