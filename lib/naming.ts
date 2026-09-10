import type { CopyBrief } from "@/lib/prompts";

const AUDIENCE_CODE = {
  b2c: "B2C",
  b2b: "B2B",
  catering: "CAT",
} as const;

const OBJECTIVE_CODE = {
  ventas: "SALES",
  conversaciones: "WA",
  leads: "LEADS",
  awareness: "AWR",
} as const;

function pad(value: number) {
  return String(value).padStart(2, "0");
}

export function campaignStamp(date = new Date()) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}`;
}

export function campaignName(brief: CopyBrief, date = new Date()) {
  const dest = brief.destination === "whatsapp" ? "WA" : "WEB";
  return `${campaignStamp(date)} | ${AUDIENCE_CODE[brief.audience]} | ${OBJECTIVE_CODE[brief.objective]} | ${brief.productId} | ${dest}`;
}

export function adSetName(brief: CopyBrief, format: string) {
  return `${campaignName(brief)} | ${format}`;
}

export function adName(
  brief: CopyBrief,
  variantIndex: number,
  format: string,
  headline: string,
) {
  const slug = headline
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 28);
  return `${brief.productId}-v${variantIndex + 1}-${format.replace(":", "x")}-${slug}`;
}

export function imageFileName(
  brief: CopyBrief,
  variantIndex: number,
  format: string,
) {
  return `${brief.productId}-v${variantIndex + 1}-${format.replace(":", "x")}.png`;
}

export function zipFileName(brief: CopyBrief, date = new Date()) {
  return `lalas-ads-${campaignStamp(date)}-${brief.audience}-${brief.productId}.zip`;
}
