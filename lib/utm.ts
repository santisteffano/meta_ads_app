import type { CopyBrief } from "@/lib/prompts";

export function buildUtm(brief: CopyBrief, variantIndex: number) {
  const campaign = `${brief.audience}-${brief.angleId}`;
  const content = `${brief.productId}-v${variantIndex + 1}`;
  const params = new URLSearchParams({
    utm_source: "meta",
    utm_medium: "paid",
    utm_campaign: campaign,
    utm_content: content,
  });
  return params.toString();
}

export function withUtm(url: string, brief: CopyBrief, variantIndex: number) {
  if (url.startsWith("https://wa.me/")) return url;
  const sep = url.includes("?") ? "&" : "?";
  return `${url}${sep}${buildUtm(brief, variantIndex)}`;
}
