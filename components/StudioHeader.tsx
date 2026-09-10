"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const NAV = [
  { href: "/", label: "Inicio" },
  { href: "/generate", label: "Generar" },
  { href: "/creatives", label: "Creatividades" },
  { href: "/campaigns", label: "Campañas" },
  { href: "/settings", label: "Ajustes" },
];

export function StudioHeader({ current }: { current: string }) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setReady(true);
  }, []);

  return (
    <header className="border-b border-[#e4ddd0] bg-[#F5F0E6]/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="font-serif text-xl text-[#C41E3A]">Lala&apos;s</span>
          <span className="text-sm tracking-wide text-[#7a7268]">Ads Studio</span>
        </Link>
        <nav className="flex min-h-8 items-center gap-1 overflow-x-auto text-sm">
          {ready
            ? NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`shrink-0 rounded-full px-3 py-1.5 ${
                    current === item.href
                      ? "bg-[#1A1A1A] text-white"
                      : "text-[#2D2D2D] hover:bg-white"
                  }`}
                >
                  {item.label}
                </Link>
              ))
            : null}
        </nav>
      </div>
    </header>
  );
}
