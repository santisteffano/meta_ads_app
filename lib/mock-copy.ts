import { ANGLES, LALAS_BRAND, META_CTAS, productById } from "@/lib/brand";
import type { CopyBrief } from "@/lib/prompts";
import type { z } from "zod";
import type { copyResponseSchema } from "@/lib/prompts";

type CopyResponse = z.infer<typeof copyResponseSchema>;

function productLabel(productId: string) {
  if (productId === "marca") return LALAS_BRAND.name;
  return productById(productId)?.name ?? productId;
}

export function mockCopyVariants(brief: CopyBrief): CopyResponse {
  const product = productLabel(brief.productId);
  const angle = ANGLES.find((item) => item.id === brief.angleId)?.label ?? "";
  const ctas = META_CTAS[brief.destination];
  const shortProduct = product.replace("Pizza ", "").replace(" Lala’s", "").replace(" Lala's", "");

  const b2c: CopyResponse["variants"] = [
    {
      primaryText: `La pizza de pizzería italiana, en tu freezer. ${shortProduct}, masa madre, lista en 8 minutos.`,
      headline: "Pizzería en tu freezer",
      description: "Lista en 8 minutos",
      cta: ctas[0],
      angleNote: "Tagline + tiempo",
    },
    {
      primaryText: `${shortProduct} con harina y tomate italianos. Pre-horneada a 400 °C y congelada en su punto.`,
      headline: "Hecha a mano, 400 °C",
      description: "Sabor de pizzería",
      cta: ctas[1] ?? ctas[0],
      angleNote: "Proceso artesanal",
    },
    {
      primaryText: `Envío gratis desde $2000 en Montevideo y Ciudad de la Costa. Pedila hoy, mañana está en tu freezer.`,
      headline: "Envío gratis desde $2000",
      description: "MVD y CdC",
      cta: ctas[0],
      angleNote: "Oferta de envío",
    },
    {
      primaryText: `¿Delivery caro otra vez? ${shortProduct} Lala's: del freezer al horno en 6-10 minutos.`,
      headline: "Rico, sin delivery caro",
      description: "6-10 minutos",
      cta: ctas[2] ?? ctas[0],
      angleNote: "Anti-delivery",
    },
    {
      primaryText: `Masa madre, fermentación lenta de 24 hs. ${shortProduct} para esta noche, sin salir de casa.`,
      headline: "Masa madre, 24 hs",
      description: "Hecho en Uruguay",
      cta: ctas[0],
      angleNote: "Fermentación",
    },
  ];

  const b2b: CopyResponse["variants"] = [
    {
      primaryText: `Llevá pizza italiana de verdad a tu góndola. ${shortProduct} Lala's: rotación rápida, producto que se diferencia.`,
      headline: "Pizza italiana en tu local",
      description: "Rotación y margen",
      cta: ctas[0],
      angleNote: "Góndola",
    },
    {
      primaryText: `Harina y tomate italianos, masa madre, congelada en su mejor momento. Calidad que tu cliente nota.`,
      headline: "Calidad que se nota",
      description: "Para tu negocio",
      cta: ctas[1] ?? ctas[0],
      angleNote: "Calidad percibida",
    },
    {
      primaryText: `¿Buscás un frozen que no parezca frozen? Lala's. Escribí a WhatsApp y armamos tu pedido mayorista.`,
      headline: "Frozen que no lo parece",
      description: "Pedido mayorista",
      cta: ctas[0],
      angleNote: "Mayorista directo",
    },
    {
      primaryText: `${shortProduct} y más, listos para tu freezer comercial. Hecho en Uruguay, sin conservantes.`,
      headline: "Hecho en Uruguay",
      description: "Sin conservantes",
      cta: ctas[0],
      angleNote: "Origen",
    },
    {
      primaryText: `Sumá Lala's a tu carta o góndola. Sabor de pizzería, logística de congelado. Te cotizamos hoy.`,
      headline: "Sumala a tu carta",
      description: "Te cotizamos hoy",
      cta: ctas[1] ?? ctas[0],
      angleNote: "Carta / cotización",
    },
  ];

  const catering: CopyResponse["variants"] = [
    {
      primaryText: `Pizza italiana recién hecha en tu evento. Cumpleaños, bodas y reuniones que se recuerdan por la comida.`,
      headline: "Pizza en vivo, tu evento",
      description: "Catering premium",
      cta: ctas[0],
      angleNote: "Evento en vivo",
    },
    {
      primaryText: `No es la pizza del freezer: es Lala's en tu fiesta. Pedí presupuesto por WhatsApp.`,
      headline: "Catering Lala's",
      description: "Pedí presupuesto",
      cta: ctas[0],
      angleNote: "Presupuesto",
    },
    {
      primaryText: `Bodas, reuniones y cumpleaños con pizza tipo italiana hecha en el momento. Montevideo y CdC.`,
      headline: "Para el evento",
      description: "MVD y CdC",
      cta: ctas[1] ?? ctas[0],
      angleNote: "Zona + ocasión",
    },
    {
      primaryText: `Querés que hablen de la comida. Catering de pizzas Lala's, con masa madre y el horno en tu salón.`,
      headline: "Que hablen de la comida",
      description: "Horno en tu salón",
      cta: ctas[0],
      angleNote: "Experiencia",
    },
    {
      primaryText: `Catering de pizzas artesanales. Te armamos cantidad, sabores y horario. Escribinos.`,
      headline: "Cantidad, sabores, hora",
      description: "A medida",
      cta: ctas[0],
      angleNote: "A medida",
    },
  ];

  const pool =
    brief.audience === "b2b"
      ? b2b
      : brief.audience === "catering"
        ? catering
        : b2c;

  const tailored = pool.map((variant) => {
    if (brief.angleId === "lista-8-min") {
      return {
        ...variant,
        headline: variant.headline.slice(0, 40),
      };
    }
    if (brief.angleId === "envio-gratis" && brief.audience === "b2c") {
      return variant;
    }
    return {
      ...variant,
      angleNote: `${angle || variant.angleNote}`,
    };
  });

  return { variants: tailored.slice(0, brief.variantCount) };
}
