import { CreativesStudio } from "@/components/CreativesStudio";
import { StudioHeader } from "@/components/StudioHeader";

export default async function CreativesPage({
  searchParams,
}: {
  searchParams: Promise<{ asset?: string; headline?: string }>;
}) {
  const { asset, headline } = await searchParams;

  return (
    <div className="min-h-full bg-[#F5F0E6]">
      <StudioHeader current="/creatives" />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <p className="text-[11px] uppercase tracking-[0.16em] text-[#C41E3A]">
          Sprint 2 · Fotos reales
        </p>
        <h1 className="mt-2 font-serif text-3xl text-[#1A1A1A] sm:text-4xl">
          Creatividades
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-[#5c564e]">
          Librería de fotos de producto. Overlay mínimo, recorte a 1:1, 4:5 y
          9:16, y PNG listo para Ads Manager.
        </p>
        <div className="mt-8">
          <CreativesStudio
            initialAssetId={asset}
            initialHeadline={headline}
          />
        </div>
      </main>
    </div>
  );
}
