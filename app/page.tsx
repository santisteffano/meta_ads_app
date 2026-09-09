import Link from "next/link";
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

export default function HomePage() {
  return (
    <div className="min-h-full bg-[#F5F0E6]">
      <StudioHeader current="/" />
      <main className="mx-auto max-w-6xl px-4 py-12">
        <p className="text-[11px] uppercase tracking-[0.16em] text-[#C41E3A]">
          Herramienta interna
        </p>
        <h1 className="mt-3 max-w-xl font-serif text-4xl leading-tight text-[#1A1A1A] sm:text-5xl">
          {LALAS_BRAND.tagline}
        </h1>
        <p className="mt-4 max-w-xl text-[#5c564e]">
          Estudio de creatividades para Meta. Generás, revisás y copiás. Nada
          se publica solo: todo sale en pausa, cuando conectemos Ads Manager.
        </p>
        <Link
          href="/generate"
          className="mt-8 inline-flex rounded-md bg-[#C41E3A] px-5 py-2.5 text-sm font-semibold text-white"
        >
          Generar copy
        </Link>

        <div className="mt-12 grid gap-4 sm:grid-cols-3">
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
    </div>
  );
}
