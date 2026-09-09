import { z } from "zod";
import { ANGLES, LALAS_BRAND } from "@/lib/brand";

export const copyBriefSchema = z.object({
  objective: z.enum(["ventas", "conversaciones", "leads", "awareness"]),
  audience: z.enum(["b2c", "b2b", "catering"]),
  productId: z.string(),
  angleId: z.enum([
    "freezer-pizzeria",
    "lista-8-min",
    "envio-gratis",
    "sabor-hero",
    "puntos-de-venta",
    "negocio-italiano",
    "catering-evento",
  ]),
  destination: z.enum(["whatsapp", "tienda"]),
  formats: z.array(z.enum(["1:1", "4:5", "9:16"])).min(1),
  extraNotes: z.string().max(500).optional(),
  variantCount: z.coerce.number().int().min(3).max(8).default(5),
});

export type CopyBrief = z.infer<typeof copyBriefSchema>;

export const copyVariantSchema = z.object({
  primaryText: z.string().min(20).max(220),
  headline: z.string().min(8).max(40),
  description: z.string().min(8).max(30),
  cta: z.string(),
  angleNote: z.string().optional(),
});

export const copyResponseSchema = z.object({
  variants: z.array(copyVariantSchema).min(3).max(8),
});

export function buildCopyPrompt(brief: CopyBrief, productName: string) {
  const angle = ANGLES.find((item) => item.id === brief.angleId);
  const audience = LALAS_BRAND.audiences[brief.audience];

  return `Sos el copywriter oficial de Lala's Pizza (Uruguay). Escribí en español rioplatense, de vos, cercano, apetitoso, con orgullo artesanal. Nunca suenes a supermercado ni a agencia corporativa.

MARCA:
${JSON.stringify(
    {
      name: LALAS_BRAND.name,
      tagline: LALAS_BRAND.tagline,
      tone: LALAS_BRAND.tone,
      keyMessages: LALAS_BRAND.keyMessages,
      cookTime: LALAS_BRAND.cookTime,
      shipping: LALAS_BRAND.shipping,
      doNot: LALAS_BRAND.doNot,
    },
    null,
    2,
  )}

BRIEF:
- Objetivo: ${brief.objective}
- Público: ${brief.audience} — ${audience}
- Producto: ${productName}
- Ángulo: ${angle?.label ?? brief.angleId}
- Destino del anuncio: ${brief.destination === "whatsapp" ? "WhatsApp 099 501 661" : "tienda https://lalaspizza.uy"}
- Formatos: ${brief.formats.join(", ")}
${brief.extraNotes ? `- Notas extra: ${brief.extraNotes}` : ""}

Generá exactamente ${brief.variantCount} variaciones distintas de ad para Meta (Facebook/Instagram).

Cada variación:
- primaryText: ideal ≤125 caracteres (máx 220). Primera línea tiene que enganchar.
- headline: máx 40 caracteres (ideal ≤27 para Feed mobile).
- description: máx 30 caracteres. En mobile casi no se ve; que sea un refuerzo corto.
- cta: uno de ${brief.destination === "whatsapp" ? "WHATSAPP_MESSAGE, CONTACT_US, LEARN_MORE" : "SHOP_NOW, ORDER_NOW, LEARN_MORE, GET_OFFER"}
- angleNote: 5-10 palabras de por qué esta variante es distinta.

Hechos canónicos (no los contradigas):
- Tiempo: 6-10 minutos. El hook "Lista en 8 minutos" está permitido.
- Envío gratis desde $2000, solo Montevideo y Ciudad de la Costa.
- Web: lalaspizza.uy (nunca .shop).
- Es pizza TIPO italiana, no napolitana certificada.

Estilo: uruguayo, concreto, con ganas de pizza. Tutear. 0 o 1 emoji como máximo.`;
}
