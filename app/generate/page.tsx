import { GenerateForm } from "@/components/GenerateForm";
import { StudioHeader } from "@/components/StudioHeader";

export default async function GeneratePage({
  searchParams,
}: {
  searchParams: Promise<{ asset?: string }>;
}) {
  const { asset } = await searchParams;

  return (
    <div className="min-h-full bg-[#F5F0E6]">
      <StudioHeader current="/generate" />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <p className="text-[11px] uppercase tracking-[0.16em] text-[#C41E3A]">
          Copy + foto
        </p>
        <h1 className="mt-2 font-serif text-3xl text-[#1A1A1A] sm:text-4xl">
          Generar anuncios
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-[#5c564e]">
          Copy on-brand y preview con foto real. El PNG se exporta desde
          Creatividades; Meta Ads Manager entra después.
        </p>
        <div className="mt-8">
          <GenerateForm initialAssetId={asset} />
        </div>
      </main>
    </div>
  );
}
