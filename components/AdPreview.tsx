import type { QaResult } from "@/lib/quality";

type Placement = "feed" | "stories";

type PreviewVariant = {
  primaryText: string;
  headline: string;
  description: string;
  cta: string;
  qa?: QaResult;
};

const CTA_LABEL: Record<string, string> = {
  WHATSAPP_MESSAGE: "Enviar mensaje de WhatsApp",
  CONTACT_US: "Contactanos",
  LEARN_MORE: "Más información",
  SEND_MESSAGE: "Enviar mensaje",
  SHOP_NOW: "Comprar ahora",
  ORDER_NOW: "Pedir ahora",
  GET_OFFER: "Obtener oferta",
};

function ctaLabel(cta: string) {
  return CTA_LABEL[cta] ?? cta.replaceAll("_", " ");
}

export function AdPreview({
  variant,
  placement,
  imageUrl,
}: {
  variant: PreviewVariant;
  placement: Placement;
  imageUrl?: string;
}) {
  const isStories = placement === "stories";

  return (
    <div className="mx-auto w-full max-w-[320px]">
      <p className="mb-2 text-center text-[11px] uppercase tracking-[0.14em] text-[#7a7268]">
        {isStories ? "Stories / Reels 9:16" : "Feed 4:5"}
      </p>
      <div
        className={`overflow-hidden rounded-[28px] border border-[#e4ddd0] bg-white ${
          isStories ? "aspect-[9/16]" : "aspect-[4/5]"
        }`}
      >
        <div className="flex items-center gap-2 px-3 py-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#C41E3A] text-[11px] font-semibold text-[#F5F0E6]">
            LP
          </div>
          <div className="min-w-0">
            <p className="truncate text-[13px] font-semibold text-[#1A1A1A]">
              Lala&apos;s Pizza
            </p>
            <p className="text-[11px] text-[#7a7268]">Publicidad · lalaspizza.uy</p>
          </div>
        </div>

        <div
          className={`relative mx-3 overflow-hidden rounded-lg bg-[#1A1A1A] ${
            isStories ? "h-[58%]" : "aspect-[4/5]"
          }`}
        >
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageUrl}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-[#2a2a2a]" />
          )}
          <div className="absolute inset-x-0 bottom-0 bg-[#1A1A1A]/70 p-3">
            <p className="text-[11px] uppercase tracking-[0.16em] text-[#F5F0E6]/70">
              {imageUrl ? "Lala's" : "Foto de producto"}
            </p>
            <p className="mt-1 font-serif text-lg leading-tight text-[#F5F0E6]">
              {variant.headline}
            </p>
          </div>
        </div>

        <div className={`px-3 ${isStories ? "py-3" : "py-3"}`}>
          <p className="text-[13px] leading-snug text-[#2D2D2D]">
            {variant.primaryText}
          </p>
          <p className="mt-2 text-[12px] font-semibold text-[#1A1A1A]">
            {variant.headline}
          </p>
          <p className="text-[11px] text-[#7a7268]">{variant.description}</p>
          <button
            type="button"
            className="mt-3 w-full rounded-md bg-[#C41E3A] px-3 py-2 text-[12px] font-semibold text-white"
          >
            {ctaLabel(variant.cta)}
          </button>
        </div>
      </div>
    </div>
  );
}
