import type { Metadata } from "next";
import { DM_Sans, Fraunces } from "next/font/google";
import "./globals.css";

const sans = DM_Sans({
  variable: "--font-lalas-sans",
  subsets: ["latin"],
});

const serif = Fraunces({
  variable: "--font-lalas-serif",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lala's Ads Studio",
  description: "Generador interno de anuncios Meta para Lala's Pizza.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es-UY"
      className={`${sans.variable} ${serif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
