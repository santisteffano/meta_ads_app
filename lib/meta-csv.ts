import { landingUrl } from "@/lib/brand";
import { ageRange } from "@/lib/meta-targeting";
import type { CopyBrief } from "@/lib/prompts";
import {
  adName,
  adSetName,
  campaignName,
  imageFileName,
} from "@/lib/naming";
import { buildUtm } from "@/lib/utm";

export type ExportVariant = {
  index: number;
  primaryText: string;
  headline: string;
  description: string;
  cta: string;
};

const META_HEADERS = [
  "Campaign Name",
  "Campaign Objective",
  "Campaign Status",
  "Buying Type",
  "Ad Set Name",
  "Ad Set Run Status",
  "Optimization Goal",
  "Billing Event",
  "Countries",
  "Age Min",
  "Age Max",
  "Ad Name",
  "Ad Status",
  "Title",
  "Body",
  "Description",
  "Link",
  "Call to Action",
  "Image File Name",
  "URL Tags",
] as const;

const OBJECTIVE_API = {
  ventas: "OUTCOME_SALES",
  conversaciones: "OUTCOME_ENGAGEMENT",
  leads: "OUTCOME_LEADS",
  awareness: "OUTCOME_AWARENESS",
} as const;

const OPTIMIZATION = {
  ventas: "OFFSITE_CONVERSIONS",
  conversaciones: "CONVERSATIONS",
  leads: "CONVERSATIONS",
  awareness: "REACH",
} as const;

function csvCell(value: string | number) {
  const text = String(value);
  if (/[",\n]/.test(text)) return `"${text.replaceAll('"', '""')}"`;
  return text;
}

function csvTable(headers: readonly string[], rows: Array<Array<string | number>>) {
  return [headers, ...rows].map((row) => row.map(csvCell).join(",")).join("\n");
}

export function metaObjective(brief: CopyBrief) {
  return OBJECTIVE_API[brief.objective];
}

export function buildMetaCsv(
  brief: CopyBrief,
  variants: ExportVariant[],
  formats: CopyBrief["formats"],
) {
  const campaign = campaignName(brief);
  const rows = variants.flatMap((variant) =>
    formats.map((format) => [
      campaign,
      metaObjective(brief),
      "PAUSED",
      "AUCTION",
      adSetName(brief, format),
      "PAUSED",
      OPTIMIZATION[brief.objective],
      "IMPRESSIONS",
      "UY",
      ageRange(brief.audience).age_min,
      ageRange(brief.audience).age_max,
      adName(brief, variant.index, format, variant.headline),
      "PAUSED",
      variant.headline,
      variant.primaryText,
      variant.description,
      landingUrl(brief.destination),
      variant.cta,
      imageFileName(brief, variant.index, format),
      brief.destination === "tienda" ? buildUtm(brief, variant.index) : "",
    ]),
  );

  return csvTable(META_HEADERS, rows);
}

export function buildCopyCsv(
  brief: CopyBrief,
  variants: ExportVariant[],
  formats: CopyBrief["formats"],
) {
  const headers = [
    "archivo",
    "campaña",
    "headline",
    "primary_text",
    "description",
    "cta",
    "destino",
    "utm",
    "estado",
  ];
  const rows = variants.flatMap((variant) =>
    formats.map((format) => [
      imageFileName(brief, variant.index, format),
      campaignName(brief),
      variant.headline,
      variant.primaryText,
      variant.description,
      variant.cta,
      landingUrl(brief.destination),
      brief.destination === "tienda" ? buildUtm(brief, variant.index) : "",
      "PAUSED",
    ]),
  );
  return csvTable(headers, rows);
}

export function buildExportReadme(brief: CopyBrief, adCount: number) {
  return [
    "Lala's Ads Studio — paquete para Ads Manager",
    "",
    `Campaña: ${campaignName(brief)}`,
    `Anuncios: ${adCount}`,
    "Estado: PAUSED. Nada se publica solo.",
    "",
    "Cómo importar",
    "1. Ads Manager → Importar y exportar → Importar anuncios.",
    "2. Bajá la plantilla oficial de Meta (XLSX). No cambies sus encabezados.",
    "3. Copiá las filas de ads-meta.csv en las columnas del mismo nombre:",
    "   Campaign Name, Campaign Objective, Campaign Status, Ad Set Name,",
    "   Title (headline), Body (primary text), Description, Link,",
    "   Call to Action, Image File Name, URL Tags.",
    "4. Subí la carpeta imagenes/ (o el zip) cuando Meta pida creatividades.",
    "   El Image File Name tiene que coincidir carácter por carácter.",
    "5. Completá presupuesto, Page ID e Instagram Account ID en la plantilla.",
    "6. Revisá y dejá todo en pausa hasta que apruebes el gasto.",
    "",
    "Notas",
    "- País: UY. B2C: zona de envío (MVD + CdC) si importás a mano, afiná el geo.",
    "- Edad 21-54. Objetivo mapeado desde el brief.",
    "- WhatsApp: Link es wa.me. Tienda: Link es lalaspizza.uy y UTM va en URL Tags.",
    "- Este CSV es un recorte útil, no la plantilla de 140 columnas.",
    "  Si el import falla, pegá solo Title/Body/Link/CTA/Image File Name.",
    "",
  ].join("\n");
}
