"use client";

import { useMemo, useState, type FormEvent } from "react";
import { AdPreview } from "@/components/AdPreview";
import {
  ANGLES,
  DESTINATIONS,
  FORMATS,
  LALAS_BRAND,
  OBJECTIVES,
  type AudienceId,
} from "@/lib/brand";
import type { CopyBrief } from "@/lib/prompts";
import type { QaResult } from "@/lib/quality";

type VariantResult = {
  primaryText: string;
  headline: string;
  description: string;
  cta: string;
  angleNote?: string;
  qa: QaResult;
  landingUrl: string;
};

type ApiResponse = {
  source: "model" | "mock";
  variants: VariantResult[];
  error?: string;
};

const fieldClass =
  "mt-1 w-full rounded-md border border-[#e4ddd0] bg-white px-3 py-2 text-sm text-[#2D2D2D] outline-none focus:border-[#C41E3A]";

export function GenerateForm() {
  const [audience, setAudience] = useState<AudienceId>("b2c");
  const [objective, setObjective] = useState<CopyBrief["objective"]>(
    "conversaciones",
  );
  const [productId, setProductId] = useState("fugazzeta");
  const [angleId, setAngleId] = useState<CopyBrief["angleId"]>(
    "freezer-pizzeria",
  );
  const [destination, setDestination] =
    useState<CopyBrief["destination"]>("whatsapp");
  const [formats, setFormats] = useState<CopyBrief["formats"]>(["4:5", "9:16"]);
  const [extraNotes, setExtraNotes] = useState("");
  const [variantCount, setVariantCount] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ApiResponse | null>(null);
  const [selected, setSelected] = useState(0);
  const [placement, setPlacement] = useState<"feed" | "stories">("feed");

  const angles = useMemo(
    () =>
      ANGLES.filter((angle) =>
        (angle.audiences as readonly string[]).includes(audience),
      ),
    [audience],
  );

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const brief: CopyBrief = {
      objective,
      audience,
      productId,
      angleId: angles.some((angle) => angle.id === angleId)
        ? angleId
        : (angles[0]?.id ?? "freezer-pizzeria"),
      destination,
      formats,
      extraNotes: extraNotes.trim() || undefined,
      variantCount,
    };

    try {
      const response = await fetch("/api/generate/copy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(brief),
      });
      const data = (await response.json()) as ApiResponse;
      if (!response.ok) {
        throw new Error(data.error ?? "No se pudo generar el copy");
      }
      setResult(data);
      setSelected(0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado");
    } finally {
      setLoading(false);
    }
  }

  function toggleFormat(id: CopyBrief["formats"][number]) {
    setFormats((current) => {
      if (current.includes(id)) {
        const next = current.filter((item) => item !== id);
        return next.length ? next : current;
      }
      return [...current, id];
    });
  }

  const active = result?.variants[selected];

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)]">
      <form
        onSubmit={onSubmit}
        className="h-fit rounded-2xl border border-[#e4ddd0] bg-white p-5"
      >
        <h2 className="font-serif text-xl text-[#1A1A1A]">Brief</h2>
        <p className="mt-1 text-sm text-[#7a7268]">
          Cinco variantes on-brand, con QA de claims y caracteres.
        </p>

        <label className="mt-5 block text-sm font-medium">
          Público
          <select
            className={fieldClass}
            value={audience}
            onChange={(event) => {
              const next = event.target.value as AudienceId;
              setAudience(next);
              const first = ANGLES.find((angle) =>
                (angle.audiences as readonly string[]).includes(next),
              );
              if (first) setAngleId(first.id);
            }}
          >
            <option value="b2c">B2C — hogar</option>
            <option value="b2b">B2B — comercios</option>
            <option value="catering">Catering — eventos</option>
          </select>
        </label>

        <label className="mt-4 block text-sm font-medium">
          Objetivo
          <select
            className={fieldClass}
            value={objective}
            onChange={(event) =>
              setObjective(event.target.value as CopyBrief["objective"])
            }
          >
            {OBJECTIVES.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </label>

        <label className="mt-4 block text-sm font-medium">
          Producto
          <select
            className={fieldClass}
            value={productId}
            onChange={(event) => setProductId(event.target.value)}
          >
            <option value="marca">Marca general</option>
            {LALAS_BRAND.products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>
        </label>

        <label className="mt-4 block text-sm font-medium">
          Ángulo
          <select
            className={fieldClass}
            value={angles.some((angle) => angle.id === angleId) ? angleId : angles[0]?.id}
            onChange={(event) =>
              setAngleId(event.target.value as CopyBrief["angleId"])
            }
          >
            {angles.map((angle) => (
              <option key={angle.id} value={angle.id}>
                {angle.label}
              </option>
            ))}
          </select>
        </label>

        <label className="mt-4 block text-sm font-medium">
          Destino
          <select
            className={fieldClass}
            value={destination}
            onChange={(event) =>
              setDestination(event.target.value as CopyBrief["destination"])
            }
          >
            {DESTINATIONS.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </label>

        <fieldset className="mt-4">
          <legend className="text-sm font-medium">Formatos</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {FORMATS.map((format) => {
              const on = formats.includes(format.id);
              return (
                <button
                  key={format.id}
                  type="button"
                  onClick={() => toggleFormat(format.id)}
                  className={`rounded-full border px-3 py-1 text-xs ${
                    on
                      ? "border-[#C41E3A] bg-[#C41E3A] text-white"
                      : "border-[#e4ddd0] bg-white text-[#2D2D2D]"
                  }`}
                >
                  {format.label}
                </button>
              );
            })}
          </div>
        </fieldset>

        <label className="mt-4 block text-sm font-medium">
          Variantes
          <input
            className={fieldClass}
            type="number"
            min={3}
            max={8}
            value={variantCount}
            onChange={(event) => setVariantCount(Number(event.target.value))}
          />
        </label>

        <label className="mt-4 block text-sm font-medium">
          Notas extra
          <textarea
            className={`${fieldClass} min-h-[72px] resize-y`}
            value={extraNotes}
            onChange={(event) => setExtraNotes(event.target.value)}
            placeholder="Combo, promo, fecha de cierre…"
          />
        </label>

        {error ? (
          <p className="mt-4 text-sm text-[#C41E3A]">{error}</p>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="mt-5 w-full rounded-md bg-[#C41E3A] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
        >
          {loading ? "Generando…" : "Generar copy"}
        </button>
      </form>

      <div>
        {!result ? (
          <div className="rounded-2xl border border-dashed border-[#e4ddd0] bg-white/60 p-8 text-sm text-[#7a7268]">
            Completá el brief y generá. Sin API key usa copy de muestra
            on-brand; con Anthropic, OpenAI o xAI usa el modelo.
          </div>
        ) : (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-[#7a7268]">
                Fuente:{" "}
                <span className="font-medium text-[#1A1A1A]">
                  {result.source === "model" ? "modelo" : "muestra local"}
                </span>
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPlacement("feed")}
                  className={`rounded-full px-3 py-1 text-xs ${
                    placement === "feed"
                      ? "bg-[#1A1A1A] text-white"
                      : "bg-white text-[#2D2D2D] border border-[#e4ddd0]"
                  }`}
                >
                  Feed
                </button>
                <button
                  type="button"
                  onClick={() => setPlacement("stories")}
                  className={`rounded-full px-3 py-1 text-xs ${
                    placement === "stories"
                      ? "bg-[#1A1A1A] text-white"
                      : "bg-white text-[#2D2D2D] border border-[#e4ddd0]"
                  }`}
                >
                  Stories
                </button>
              </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_280px]">
              <ul className="space-y-3">
                {result.variants.map((variant, index) => (
                  <li key={`${variant.headline}-${index}`}>
                    <button
                      type="button"
                      onClick={() => setSelected(index)}
                      className={`w-full rounded-xl border p-4 text-left ${
                        selected === index
                          ? "border-[#C41E3A] bg-white"
                          : "border-[#e4ddd0] bg-white/80"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <p className="font-semibold text-[#1A1A1A]">
                          {variant.headline}
                        </p>
                        <span
                          className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] ${
                            variant.qa.ok
                              ? "bg-[#e8f3ea] text-[#1f6b34]"
                              : "bg-[#fde8e8] text-[#C41E3A]"
                          }`}
                        >
                          {variant.qa.ok ? "QA ok" : "Revisar"}
                        </span>
                      </div>
                      <p className="mt-2 text-sm leading-snug text-[#2D2D2D]">
                        {variant.primaryText}
                      </p>
                      <p className="mt-2 text-[12px] text-[#7a7268]">
                        {variant.description} · {variant.cta} ·{" "}
                        {variant.qa.counts.primaryText}c /{" "}
                        {variant.qa.counts.headline}c
                      </p>
                      {variant.qa.issues.length ? (
                        <ul className="mt-2 space-y-1 text-[12px] text-[#9a4a1f]">
                          {variant.qa.issues.map((issue) => (
                            <li key={issue.code + issue.message}>
                              {issue.severity === "error" ? "Error" : "Aviso"}:{" "}
                              {issue.message}
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </button>
                  </li>
                ))}
              </ul>

              {active ? (
                <div className="space-y-3">
                  <AdPreview variant={active} placement={placement} />
                  <button
                    type="button"
                    className="w-full rounded-md border border-[#e4ddd0] bg-white px-3 py-2 text-sm"
                    onClick={() =>
                      navigator.clipboard.writeText(
                        [
                          active.primaryText,
                          active.headline,
                          active.description,
                          active.cta,
                          active.landingUrl,
                        ].join("\n"),
                      )
                    }
                  >
                    Copiar variante
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
