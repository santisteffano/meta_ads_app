import { CampaignsList } from "@/components/CampaignsList";
import { StudioHeader } from "@/components/StudioHeader";

export default function CampaignsPage() {
  return (
    <div className="min-h-full bg-[#F5F0E6]">
      <StudioHeader current="/campaigns" />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <p className="text-[11px] uppercase tracking-[0.16em] text-[#C41E3A]">
          Insights
        </p>
        <h1 className="mt-2 font-serif text-3xl text-[#1A1A1A] sm:text-4xl">
          Campañas
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-[#5c564e]">
          Historial del studio y un vistazo de Ads Manager (7 días). Los
          anuncios creados acá siguen en pausa hasta que los prendas.
        </p>
        <div className="mt-8">
          <CampaignsList />
        </div>
      </main>
    </div>
  );
}
