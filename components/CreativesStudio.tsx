"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { Asset } from "@/lib/assets";
import { LALAS_BRAND, productById } from "@/lib/brand";
import { composeAd, loadImage, type ComposeRatio } from "@/lib/compose";

const fieldClass =
  "mt-1 w-full rounded-md border border-[#e4ddd0] bg-white px-3 py-2 text-sm text-[#2D2D2D] outline-none focus:border-[#C41E3A]";

export function CreativesStudio({
  initialAssetId,
  initialHeadline,
}: {
  initialAssetId?: string;
  initialHeadline?: string;
}) {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [filter, setFilter] = useState("all");
  const [selectedId, setSelectedId] = useState(initialAssetId ?? "");
  const [productId, setProductId] = useState("fugazzeta");
  const [ratio, setRatio] = useState<ComposeRatio>("4:5");
  const [headline, setHeadline] = useState(
    initialHeadline || "Pizzería en tu freezer",
  );
  const [eyebrow, setEyebrow] = useState("Lala's");
  const [overlay, setOverlay] = useState(true);
  const [focusX, setFocusX] = useState(50);
  const [focusY, setFocusY] = useState(40);
  const [safeZone, setSafeZone] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  async function refresh() {
    const response = await fetch("/api/assets");
    const data = (await response.json()) as { assets: Asset[] };
    setAssets(data.assets);
    if (!selectedId && data.assets[0]) {
      setSelectedId(data.assets[0].id);
    }
  }

  useEffect(() => {
    setMounted(true);
    refresh().catch(() => setError("No se pudo cargar la librería"));
  }, []);

  const selected = assets.find((asset) => asset.id === selectedId);
  const visible = useMemo(
    () =>
      filter === "all"
        ? assets
        : assets.filter((asset) => asset.productId === filter),
    [assets, filter],
  );

  if (!mounted) {
    return (
      <p className="text-sm text-[#7a7268]">Cargando la librería de fotos…</p>
    );
  }

  async function onUpload(file: File) {
    setBusy(true);
    setError(null);
    const body = new FormData();
    body.append("file", file);
    body.append("productId", productId);
    const response = await fetch("/api/assets", { method: "POST", body });
    const data = (await response.json()) as { asset?: Asset; error?: string };
    setBusy(false);
    if (!response.ok || !data.asset) {
      setError(data.error ?? "No se pudo subir");
      return;
    }
    setAssets((current) => [data.asset!, ...current]);
    setSelectedId(data.asset.id);
  }

  async function seedShop() {
    setBusy(true);
    setError(null);
    const response = await fetch("/api/assets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "seed" }),
    });
    const data = (await response.json()) as {
      assets?: Asset[];
      imported?: number;
      error?: string;
    };
    setBusy(false);
    if (!response.ok) {
      setError(data.error ?? "No se pudieron importar las fotos");
      return;
    }
    setAssets(data.assets ?? []);
    if (data.assets?.[0]) setSelectedId(data.assets[0].id);
  }

  async function remove(id: string) {
    await fetch(`/api/assets/${id}`, { method: "DELETE" });
    setAssets((current) => current.filter((asset) => asset.id !== id));
    if (selectedId === id) setSelectedId("");
  }

  async function download() {
    if (!selected) return;
    setBusy(true);
    try {
      await document.fonts.ready;
      const image = await loadImage(selected.url);
      const canvas = composeAd({
        image,
        ratio,
        headline,
        eyebrow,
        overlay,
        focusX,
        focusY,
        safeZone: false,
      });
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/png"),
      );
      if (!blob) throw new Error("No se pudo exportar");
      const href = URL.createObjectURL(blob);
      const link = document.createElement("a");
      const slug = selected.productId;
      link.href = href;
      link.download = `lalas-${slug}-${ratio.replace(":", "x")}.png`;
      link.click();
      URL.revokeObjectURL(href);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo exportar");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
      <section>
        <div className="flex flex-wrap items-end gap-3 rounded-2xl border border-[#e4ddd0] bg-white p-4">
          <label className="text-sm font-medium">
            Producto al subir
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
          <label className="text-sm font-medium">
            Subir foto real
            <input
              className={`${fieldClass} file:mr-3 file:border-0 file:bg-[#F5F0E6] file:text-sm`}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              disabled={busy}
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) onUpload(file);
                event.target.value = "";
              }}
            />
          </label>
          <button
            type="button"
            disabled={busy}
            onClick={seedShop}
            className="rounded-md border border-[#e4ddd0] bg-[#F5F0E6] px-3 py-2 text-sm disabled:opacity-60"
          >
            {busy ? "Trabajando…" : "Traer fotos de la tienda"}
          </button>
        </div>

        {error ? <p className="mt-3 text-sm text-[#C41E3A]">{error}</p> : null}

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={`rounded-full px-3 py-1 text-xs ${
              filter === "all"
                ? "bg-[#1A1A1A] text-white"
                : "border border-[#e4ddd0] bg-white"
            }`}
          >
            Todas
          </button>
          {LALAS_BRAND.products.map((product) => (
            <button
              key={product.id}
              type="button"
              onClick={() => setFilter(product.id)}
              className={`rounded-full px-3 py-1 text-xs ${
                filter === product.id
                  ? "bg-[#1A1A1A] text-white"
                  : "border border-[#e4ddd0] bg-white"
              }`}
            >
              {product.name.replace("Pizza ", "").replace(" (6 unidades)", "")}
            </button>
          ))}
        </div>

        {visible.length === 0 ? (
          <p className="mt-8 text-sm text-[#7a7268]">
            Todavía no hay fotos. Subí una o importá el catálogo de
            lalaspizza.shop.
          </p>
        ) : (
          <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {visible.map((asset) => (
              <li key={asset.id}>
                <button
                  type="button"
                  onClick={() => setSelectedId(asset.id)}
                  className={`w-full overflow-hidden rounded-xl border text-left ${
                    selectedId === asset.id
                      ? "border-[#C41E3A]"
                      : "border-[#e4ddd0]"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={asset.url}
                    alt={asset.alt}
                    className="aspect-square w-full object-cover"
                  />
                  <p className="truncate px-2 py-1.5 text-[11px] text-[#5c564e]">
                    {productById(asset.productId)?.name ?? asset.alt}
                  </p>
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <aside className="h-fit rounded-2xl border border-[#e4ddd0] bg-white p-5">
        <h2 className="font-serif text-xl">Overlay y recorte</h2>
        <p className="mt-1 text-sm text-[#7a7268]">
          1080 px. 4:5 para Feed, 9:16 para Stories/Reels. El texto va en una
          barra sólida, no tapando el producto.
        </p>

        {selected ? (
          <div className="mt-4 overflow-hidden rounded-lg bg-[#1A1A1A]">
            <ComposerPreview
              asset={selected}
              ratio={ratio}
              headline={headline}
              eyebrow={eyebrow}
              overlay={overlay}
              focusX={focusX}
              focusY={focusY}
              safeZone={safeZone}
            />
          </div>
        ) : (
          <div className="mt-4 rounded-lg border border-dashed border-[#e4ddd0] p-6 text-sm text-[#7a7268]">
            Elegí una foto de la grilla.
          </div>
        )}

        <div className="mt-4 flex flex-wrap gap-2">
          {(["1:1", "4:5", "9:16"] as const).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setRatio(item)}
              className={`rounded-full px-3 py-1 text-xs ${
                ratio === item
                  ? "bg-[#C41E3A] text-white"
                  : "border border-[#e4ddd0]"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        <label className="mt-4 block text-sm font-medium">
          Ceja
          <input
            className={fieldClass}
            value={eyebrow}
            onChange={(event) => setEyebrow(event.target.value)}
          />
        </label>
        <label className="mt-3 block text-sm font-medium">
          Texto en imagen
          <input
            className={fieldClass}
            value={headline}
            maxLength={40}
            onChange={(event) => setHeadline(event.target.value)}
          />
        </label>
        <label className="mt-3 block text-sm">
          Encuadre horizontal {focusX}
          <input
            className="mt-1 w-full"
            type="range"
            min={0}
            max={100}
            value={focusX}
            onChange={(event) => setFocusX(Number(event.target.value))}
          />
        </label>
        <label className="mt-2 block text-sm">
          Encuadre vertical {focusY}
          <input
            className="mt-1 w-full"
            type="range"
            min={0}
            max={100}
            value={focusY}
            onChange={(event) => setFocusY(Number(event.target.value))}
          />
        </label>
        <label className="mt-3 flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={overlay}
            onChange={(event) => setOverlay(event.target.checked)}
          />
          Mostrar overlay
        </label>
        <label className="mt-2 flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={safeZone}
            onChange={(event) => setSafeZone(event.target.checked)}
          />
          Zona segura Stories (no se exporta)
        </label>

        <button
          type="button"
          disabled={!selected || busy}
          onClick={download}
          className="mt-5 w-full rounded-md bg-[#C41E3A] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
        >
          Descargar PNG {ratio}
        </button>
        {selected ? (
          <div className="mt-3 flex gap-2">
            <Link
              href={`/generate?asset=${selected.id}`}
              className="flex-1 rounded-md border border-[#e4ddd0] px-3 py-2 text-center text-sm"
            >
              Usar en copy
            </Link>
            <button
              type="button"
              onClick={() => remove(selected.id)}
              className="rounded-md border border-[#e4ddd0] px-3 py-2 text-sm text-[#7a7268]"
            >
              Borrar
            </button>
          </div>
        ) : null}
      </aside>
    </div>
  );
}

function ComposerPreview({
  asset,
  ratio,
  headline,
  eyebrow,
  overlay,
  focusX,
  focusY,
  safeZone,
}: {
  asset: Asset;
  ratio: ComposeRatio;
  headline: string;
  eyebrow: string;
  overlay: boolean;
  focusX: number;
  focusY: number;
  safeZone: boolean;
}) {
  const [src, setSrc] = useState<string>("");

  useEffect(() => {
    let cancelled = false;
    loadImage(asset.url)
      .then((image) => {
        if (cancelled) return;
        const canvas = composeAd({
          image,
          ratio,
          headline,
          eyebrow,
          overlay,
          focusX,
          focusY,
          safeZone,
        });
        setSrc(canvas.toDataURL("image/jpeg", 0.85));
      })
      .catch(() => {
        if (!cancelled) setSrc(asset.url);
      });
    return () => {
      cancelled = true;
    };
  }, [asset.url, ratio, headline, eyebrow, overlay, focusX, focusY, safeZone]);

  const aspect =
    ratio === "1:1" ? "1 / 1" : ratio === "4:5" ? "4 / 5" : "9 / 16";

  return src ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={asset.alt} style={{ aspectRatio: aspect }} className="w-full object-contain" />
  ) : (
    <div className="aspect-[4/5] bg-[#2a2a2a]" />
  );
}
