"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  buildExportZip,
  bytesToBase64,
  composeVariantPngs,
  downloadBlob,
} from "@/lib/export-pack";
import type { ExportVariant } from "@/lib/meta-csv";
import type { MetaStatus } from "@/lib/meta-status";
import { targetingLabel } from "@/lib/meta-targeting";
import { campaignName } from "@/lib/naming";
import type { CopyBrief } from "@/lib/prompts";

export function ExportPack({
  brief,
  variants,
  imageUrl,
}: {
  brief: CopyBrief;
  variants: ExportVariant[];
  imageUrl?: string;
}) {
  const [overlay, setOverlay] = useState(true);
  const [busy, setBusy] = useState<"zip" | "compose" | "meta" | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [published, setPublished] = useState<string | null>(null);
  const [meta, setMeta] = useState<MetaStatus | null>(null);

  useEffect(() => {
    fetch("/api/meta/status")
      .then((response) => response.json())
      .then((data: MetaStatus) => setMeta(data))
      .catch(() => undefined);
  }, []);

  const adCount = variants.length * brief.formats.length;
  const geo = targetingLabel(brief.audience, meta?.cities);
  const budgetLabel =
    meta?.dailyBudget != null
      ? `${meta.dailyBudget} ${meta.currency ?? "UYU"}/día por formato`
      : "presupuesto de Ajustes";

  async function onExport() {
    if (!variants.length) return;
    setBusy("zip");
    setError(null);
    try {
      const pack = await buildExportZip({
        brief,
        variants,
        formats: brief.formats,
        imageUrl,
        overlay,
      });
      downloadBlob(pack.blob, pack.filename);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo armar el ZIP");
    } finally {
      setBusy(null);
    }
  }

  async function onPublish() {
    if (!variants.length) return;
    if (!imageUrl) {
      setError("Elegí una foto antes de crear anuncios en Meta.");
      return;
    }
    if (!meta?.connected) {
      setError("Conectá Meta en Ajustes antes de crear anuncios.");
      return;
    }
    setBusy("compose");
    setError(null);
    setPublished(null);
    setConfirming(false);
    try {
      const pngs = await composeVariantPngs({
        brief,
        variants,
        formats: brief.formats,
        imageUrl,
        overlay,
      });
      setBusy("meta");
      const response = await fetch("/api/meta/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brief,
          variants,
          images: pngs.map((png) => ({
            filename: png.filename,
            mime: "image/png",
            base64: bytesToBase64(png.bytes),
          })),
        }),
      });
      const data = (await response.json()) as {
        error?: string;
        publish?: { campaignId: string; campaignName: string; adIds: string[] };
      };
      if (!response.ok) {
        throw new Error(data.error ?? "Meta rechazó la campaña");
      }
      setPublished(
        data.publish
          ? `${data.publish.campaignName} · ${data.publish.adIds.length} ads en pausa`
          : "Campaña creada en pausa",
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "No se pudo crear la campaña en Meta",
      );
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="rounded-2xl border border-[#e4ddd0] bg-white p-4">
      <p className="text-[11px] uppercase tracking-[0.14em] text-[#C41E3A]">
        Exportar
      </p>
      <h3 className="mt-1 font-serif text-lg text-[#1A1A1A]">
        {campaignName(brief)}
      </h3>
      <p className="mt-1 text-sm text-[#7a7268]">
        {adCount === 1
          ? "1 anuncio. ZIP o Meta, siempre en pausa."
          : `${variants.length} variantes × ${brief.formats.join(", ")} = ${adCount} anuncios. ZIP o Meta, siempre en pausa.`}
      </p>
      <p className="mt-2 text-xs text-[#7a7268]">
        Targeting: {geo}. {budgetLabel}.
      </p>
      <p className="mt-1 text-xs text-[#7a7268]">
        Meta:{" "}
        {meta == null
          ? "consultando…"
          : meta.connected
            ? `${meta.accountName ?? "conectada"}${meta.pageName ? ` · ${meta.pageName}` : ""}`
            : "sin conectar"}
      </p>
      <label className="mt-3 flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={overlay}
          onChange={(event) => setOverlay(event.target.checked)}
        />
        Overlay de texto en el PNG
      </label>
      {error ? <p className="mt-2 text-sm text-[#C41E3A]">{error}</p> : null}
      {published ? (
        <p className="mt-2 text-sm text-[#2D2D2D]">
          {published}.{" "}
          <Link href="/campaigns" className="underline">
            Ver campañas
          </Link>
        </p>
      ) : null}
      {confirming ? (
        <div className="mt-3 rounded-xl bg-[#F5F0E6] px-3 py-3 text-sm">
          <p>
            Se van a crear {adCount} ads en pausa. {budgetLabel}. No se gasta
            hasta que los prendas en Ads Manager.
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            <button
              type="button"
              disabled={Boolean(busy)}
              onClick={onPublish}
              className="rounded-md bg-[#C41E3A] px-3 py-1.5 text-sm font-semibold text-white disabled:opacity-60"
            >
              Sí, crear en pausa
            </button>
            <button
              type="button"
              disabled={Boolean(busy)}
              onClick={() => setConfirming(false)}
              className="rounded-md border border-[#e4ddd0] bg-white px-3 py-1.5 text-sm"
            >
              Cancelar
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            disabled={Boolean(busy) || !variants.length}
            onClick={onExport}
            className="rounded-md bg-[#C41E3A] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
          >
            {busy === "zip" ? "Armando ZIP…" : "Descargar ZIP + CSV"}
          </button>
          {meta == null ? (
            <button
              type="button"
              disabled
              className="rounded-md border border-[#1A1A1A] bg-white px-4 py-2 text-sm font-semibold text-[#1A1A1A] opacity-60"
            >
              Consultando Meta…
            </button>
          ) : !meta.connected ? (
            <Link
              href="/settings"
              className="rounded-md border border-[#1A1A1A] bg-white px-4 py-2 text-sm font-semibold text-[#1A1A1A]"
            >
              Conectar Meta
            </Link>
          ) : (
            <button
              type="button"
              disabled={Boolean(busy) || !variants.length}
              onClick={() => {
                setError(null);
                setConfirming(true);
              }}
              className="rounded-md border border-[#1A1A1A] bg-white px-4 py-2 text-sm font-semibold text-[#1A1A1A] disabled:opacity-60"
            >
              {busy === "compose"
                ? "Componiendo PNG…"
                : busy === "meta"
                  ? "Creando en Meta…"
                  : "Crear en Meta (PAUSED)"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
