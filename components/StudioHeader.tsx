import Link from "next/link";

const NAV = [
  { href: "/", label: "Inicio" },
  { href: "/generate", label: "Generar" },
  { href: "/creatives", label: "Creatividades", disabled: true },
  { href: "/campaigns", label: "Campañas", disabled: true },
];

export function StudioHeader({ current }: { current: string }) {
  return (
    <header className="border-b border-[#e4ddd0] bg-[#F5F0E6]/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="font-serif text-xl text-[#C41E3A]">Lala&apos;s</span>
          <span className="text-sm tracking-wide text-[#7a7268]">Ads Studio</span>
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          {NAV.map((item) =>
            item.disabled ? (
              <span
                key={item.href}
                className="cursor-not-allowed px-3 py-1.5 text-[#b0a89c]"
              >
                {item.label}
              </span>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-3 py-1.5 ${
                  current === item.href
                    ? "bg-[#1A1A1A] text-white"
                    : "text-[#2D2D2D] hover:bg-white"
                }`}
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>
      </div>
    </header>
  );
}
