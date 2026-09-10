import Link from "next/link";
import { SettingsForm } from "@/components/SettingsForm";
import { StudioFooter } from "@/components/StudioFooter";
import { StudioHeader } from "@/components/StudioHeader";

export default function SettingsPage() {
  return (
    <div className="flex min-h-full flex-col bg-[#F5F0E6]">
      <StudioHeader current="/settings" />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <p className="text-[11px] uppercase tracking-[0.16em] text-[#C41E3A]">
          Meta
        </p>
        <h1 className="mt-2 font-serif text-3xl text-[#1A1A1A] sm:text-4xl">
          Ajustes
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-[#5c564e]">
          Token, Page y presupuesto en pesos. B2C usa Montevideo y Ciudad de
          la Costa. El humano prende el gasto en Ads Manager.
        </p>
        <div className="mt-8">
          <SettingsForm />
        </div>
        <p className="mt-6 text-sm text-[#7a7268]">
          Meta pide una URL pública. Está en{" "}
          <Link href="/privacy" className="underline">
            /privacy
          </Link>
          .
        </p>
      </main>
      <StudioFooter />
    </div>
  );
}
