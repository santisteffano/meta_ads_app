import { NextResponse } from "next/server";
import { generateCopy } from "@/lib/ai";
import { landingUrl } from "@/lib/brand";
import { copyBriefSchema } from "@/lib/prompts";
import { reviewCopyVariant } from "@/lib/quality";
import { withUtm } from "@/lib/utm";

export const maxDuration = 60;

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = copyBriefSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Brief inválido", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const generated = await generateCopy(parsed.data);
  const variants = generated.variants.map((variant, index) => ({
    ...variant,
    qa: reviewCopyVariant(variant),
    landingUrl: withUtm(
      landingUrl(parsed.data.destination),
      parsed.data,
      index,
    ),
  }));

  return NextResponse.json({
    source: generated.source,
    variants,
  });
}
