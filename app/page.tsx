import Link from "next/link";
import { StudioFooter } from "@/components/StudioFooter";
import { StudioHeader } from "@/components/StudioHeader";
import { LALAS_BRAND } from "@/lib/brand";

const FUNNELS = [
  {
    title: "B2C hogar",
    body: "WhatsApp o tienda. Envío gratis desde $2000 en Montevideo y Ciudad de la Costa.",
  },
  {
    title: "B2B comercios",
    body: "Almacenes, rotiserías, hoteles. Rotación, margen y producto que se diferencia.",
  },
  {
    title: "Catering",
    body: "Pizza recién hecha en el evento. Presupuesto por WhatsApp.",
  },
];

const STEPS = [
  { n: "01", title: "Copy", body: "Brief + variantes con QA de claims." },
  { n: "02", title: "Foto", body: "Foto real, overlay y recorte 1:1 / 4:5 / 9:16." },
  { n: "03", title: "Aprobar", body: "Human in the loop. Nada se publica solo." },
  { n: "04", title: "Pausa", body: "ZIP para Ads Manager o crear en Meta, siempre PAUSED." },
];

export default function HomePage() {
  return (
    <div className="flex min-h-full flex-col bg-[#F5F0E6]">
      <StudioHeader current="/" />
      <main className="mx-auto max-w-6xl px-4 py-12">
        <p className="text-[11px] uppercase tracking-[0.16em] text-[#C41E3A]">
          Herramienta interna
        </p>
        <h1 className="mt-3 max-w-xl font-serif text-4xl leading-tight text-[#1A1A1A] sm:text-5xl">
          {LALAS_BRAND.tagline}
        </h1>
        <p className="mt-4 max-w-xl text-[#5c564e]">
          Estudio de creatividades para Meta. Generás, aprobás y exportás.
          Nada se publica solo: todo sale en pausa.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/generate"
            className="inline-flex rounded-md bg-[#C41E3A] px-5 py-2.5 text-sm font-semibold text-white"
          >
            Generar copy
          </Link>
          <Link
            href="/creatives"
            className="inline-flex rounded-md border border-[#e4ddd0] bg-white px-5 py-2.5 text-sm font-semibold text-[#1A1A1A]"
          >
            Fotos y PNG
          </Link>
          <Link
            href="/settings"
            className="inline-flex rounded-md border border-[#e4ddd0] bg-white px-5 py-2.5 text-sm font-semibold text-[#1A1A1A]"
          >
            Conectar Meta
          </Link>
        </div>

        <div className="mt-12 grid gap-3 sm:grid-cols-4">
          {STEPS.map((step) => (
            <article
              key={step.n}
              className="rounded-2xl border border-[#e4ddd0] bg-white/70 p-4"
            >
              <p className="text-[11px] tracking-[0.14em] text-[#C41E3A]">{step.n}</p>
              <h2 className="mt-1 font-serif text-lg text-[#1A1A1A]">{step.title}</h2>
              <p className="mt-1 text-sm text-[#5c564e]">{step.body}</p>
            </article>
          ))}
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {FUNNELS.map((funnel) => (
            <article
              key={funnel.title}
              className="rounded-2xl border border-[#e4ddd0] bg-white p-5"
            >
              <h2 className="font-serif text-lg text-[#1A1A1A]">{funnel.title}</h2>
              <p className="mt-2 text-sm text-[#5c564e]">{funnel.body}</p>
            </article>
          ))}
        </div>
      </main>
      <StudioFooter />
    </div>
  );
}
