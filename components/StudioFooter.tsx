import Link from "next/link";

export function StudioFooter() {
  return (
    <footer className="mt-auto border-t border-[#e4ddd0] px-4 py-6 text-center text-xs text-[#7a7268]">
      <p>
        Lala&apos;s Ads Studio · herramienta interna ·{" "}
        <Link href="/privacy" className="underline underline-offset-2">
          Política de privacidad
        </Link>
      </p>
    </footer>
  );
}
