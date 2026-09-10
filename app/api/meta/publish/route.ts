import { NextResponse } from "next/server";
import { z } from "zod";
import { copyBriefSchema } from "@/lib/prompts";
import { readMetaConfig } from "@/lib/meta";
import { publishPausedAds } from "@/lib/meta-publish";

export const maxDuration = 120;

const schema = z.object({
  brief: copyBriefSchema,
  variants: z
    .array(
      z.object({
        index: z.number().int().min(0),
        primaryText: z.string(),
        headline: z.string(),
        description: z.string(),
        cta: z.string(),
      }),
    )
    .min(1),
  images: z
    .array(
      z.object({
        filename: z.string(),
        mime: z.string(),
        base64: z.string().min(20),
      }),
    )
    .min(1),
});

export async function POST(request: Request) {
  const config = await readMetaConfig();
  if (!config) {
    return NextResponse.json(
      { error: "Conectá Meta en Ajustes antes de crear anuncios." },
      { status: 400 },
    );
  }

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Faltan variantes o imágenes para publicar." },
      { status: 400 },
    );
  }

  try {
    const record = await publishPausedAds({
      config,
      brief: parsed.data.brief,
      variants: parsed.data.variants,
      formats: parsed.data.brief.formats,
      images: parsed.data.images,
    });
    return NextResponse.json({ publish: record });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Meta rechazó la creación de la campaña",
      },
      { status: 400 },
    );
  }
}
