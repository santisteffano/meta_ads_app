import { landingUrl } from "@/lib/brand";
import {
  actId,
  graphPost,
  readPublishes,
  resolveShippingCities,
  writePublishes,
  type MetaConfig,
  type MetaPublish,
} from "@/lib/meta";
import type { ExportVariant } from "@/lib/meta-csv";
import { targetingLabel, targetingSpec } from "@/lib/meta-targeting";
import { adName, adSetName, campaignName, imageFileName } from "@/lib/naming";
import type { CopyBrief } from "@/lib/prompts";
import { buildUtm } from "@/lib/utm";

export type PublishImage = {
  filename: string;
  mime: string;
  base64: string;
};

const LINK_CTAS = new Set([
  "LEARN_MORE",
  "SHOP_NOW",
  "ORDER_NOW",
  "CONTACT_US",
  "GET_OFFER",
  "SIGN_UP",
]);

function linkCta(cta: string) {
  if (LINK_CTAS.has(cta)) return cta;
  if (cta === "WHATSAPP_MESSAGE" || cta === "SEND_MESSAGE") return "CONTACT_US";
  return "LEARN_MORE";
}

function trafficObjective(brief: CopyBrief) {
  if (brief.objective === "awareness") return "OUTCOME_AWARENESS";
  return "OUTCOME_TRAFFIC";
}

async function uploadImage(config: MetaConfig, image: PublishImage) {
  const bytes = Buffer.from(image.base64, "base64");
  const form = new FormData();
  form.append(
    "filename",
    new Blob([new Uint8Array(bytes)], { type: image.mime || "image/png" }),
    image.filename,
  );
  const result = await graphPost<{
    images?: Record<string, { hash: string }>;
  }>(`${actId(config.adAccountId)}/adimages`, config.accessToken, form);
  const images = result.images ?? {};
  const hash = images[image.filename]?.hash ?? Object.values(images)[0]?.hash;
  if (!hash) throw new Error(`Meta no devolvió hash para ${image.filename}`);
  return hash;
}

export async function publishPausedAds(input: {
  config: MetaConfig;
  brief: CopyBrief;
  variants: ExportVariant[];
  formats: CopyBrief["formats"];
  images: PublishImage[];
}) {
  const { config, brief, variants, formats } = input;
  const cities =
    config.cities?.length
      ? config.cities
      : await resolveShippingCities(config.accessToken);

  const hashes = new Map<string, string>();
  for (const image of input.images) {
    hashes.set(image.filename, await uploadImage(config, image));
  }

  const name = campaignName(brief);
  const campaign = await graphPost<{ id: string }>(
    `${actId(config.adAccountId)}/campaigns`,
    config.accessToken,
    {
      name,
      objective: trafficObjective(brief),
      status: "PAUSED",
      special_ad_categories: [],
    },
  );

  const adSetIds: string[] = [];
  const adIds: string[] = [];

  for (const format of formats) {
    const set = await graphPost<{ id: string }>(
      `${actId(config.adAccountId)}/adsets`,
      config.accessToken,
      {
        name: adSetName(brief, format),
        campaign_id: campaign.id,
        daily_budget: String(config.dailyBudgetMinor),
        billing_event: "IMPRESSIONS",
        optimization_goal:
          brief.objective === "awareness" ? "REACH" : "LINK_CLICKS",
        bid_strategy: "LOWEST_COST_WITHOUT_CAP",
        targeting: targetingSpec(brief, format, cities),
        destination_type: "WEBSITE",
        status: "PAUSED",
      },
    );
    adSetIds.push(set.id);

    for (const variant of variants) {
      const filename = imageFileName(brief, variant.index, format);
      const hash = hashes.get(filename);
      if (!hash) {
        throw new Error(`Falta el PNG ${filename} para subir a Meta`);
      }
      const link =
        brief.destination === "tienda"
          ? `${landingUrl("tienda")}?${buildUtm(brief, variant.index)}`
          : landingUrl("whatsapp");
      const storySpec: Record<string, unknown> = {
        page_id: config.pageId,
        link_data: {
          image_hash: hash,
          link,
          message: variant.primaryText,
          name: variant.headline,
          description: variant.description,
          call_to_action: {
            type: linkCta(variant.cta),
            value: { link },
          },
        },
      };
      if (config.instagramActorId) {
        storySpec.instagram_user_id = config.instagramActorId;
      }
      const creative = await graphPost<{ id: string }>(
        `${actId(config.adAccountId)}/adcreatives`,
        config.accessToken,
        {
          name: adName(brief, variant.index, format, variant.headline),
          object_story_spec: storySpec,
        },
      );
      const ad = await graphPost<{ id: string }>(
        `${actId(config.adAccountId)}/ads`,
        config.accessToken,
        {
          name: adName(brief, variant.index, format, variant.headline),
          adset_id: set.id,
          creative: { creative_id: creative.id },
          status: "PAUSED",
        },
      );
      adIds.push(ad.id);
    }
  }

  const record: MetaPublish = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    campaignName: name,
    campaignId: campaign.id,
    adSetIds,
    adIds,
    status: "paused",
    audience: brief.audience,
    productId: brief.productId,
    destination: brief.destination,
    formats: [...formats],
    dailyBudgetMinor: config.dailyBudgetMinor,
    currency: config.currency,
    targeting: targetingLabel(brief.audience, cities),
  };
  const history = await readPublishes();
  history.unshift(record);
  await writePublishes(history.slice(0, 50));
  return record;
}
