"use client";

import { useEffect, useState, type FormEvent } from "react";
import type { MetaStatus } from "@/lib/meta-status";

const fieldClass =
  "mt-1 w-full rounded-md border border-[#e4ddd0] bg-white px-3 py-2 text-sm text-[#2D2D2D] outline-none focus:border-[#C41E3A]";

export function SettingsForm() {
  const [status, setStatus] = useState<MetaStatus | null>(null);
  const [accessToken, setAccessToken] = useState("");
  const [adAccountId, setAdAccountId] = useState("");
  const [pageId, setPageId] = useState("");
  const [instagramActorId, setInstagramActorId] = useState("");
  const [dailyBudget, setDailyBudget] = useState(400);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function refresh() {
    const response = await fetch("/api/meta/status");
    const data = (await response.json()) as MetaStatus;
    setStatus(data);
    if (data.accountId) setAdAccountId(data.accountId);
    if (data.pageId) setPageId(data.pageId);
    if (data.instagramActorId) setInstagramActorId(data.instagramActorId);
    if (typeof data.dailyBudget === "number") setDailyBudget(data.dailyBudget);
  }

  useEffect(() => {
    refresh().catch(() => undefined);
  }, []);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      const response = await fetch("/api/meta/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accessToken: accessToken || undefined,
          adAccountId,
          pageId,
          instagramActorId: instagramActorId || undefined,
          dailyBudget,
        }),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(data.error ?? "No se pudo conectar");
      }
      setAccessToken("");
      setMessage("Guardado. Meta validó la cuenta; el token no se vuelve a mostrar.");
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo conectar");
    } finally {
      setBusy(false);
    }
  }

  async function onDisconnect() {
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      await fetch("/api/meta/connect", { method: "DELETE" });
      setMessage("Se borró el token guardado en este equipo.");
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo desconectar");
    } finally {
      setBusy(false);
    }
  }

  const currency = status?.currency ?? "UYU";
  const tokenOptional = Boolean(status?.connected || status?.tokenHint);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <form
        onSubmit={onSubmit}
        className="rounded-2xl border border-[#e4ddd0] bg-white p-5"
      >
        <h2 className="font-serif text-xl text-[#1A1A1A]">Conectar Meta</h2>
        <p className="mt-1 text-sm text-[#7a7268]">
          Token de larga duración de la Marketing API de Lala&apos;s. Se guarda
          solo acá. Los anuncios salen siempre en pausa.
        </p>

        <label className="mt-4 block text-sm">
          Access token{tokenOptional ? " (opcional para actualizar)" : ""}
          <input
            className={fieldClass}
            type="password"
            autoComplete="off"
            required={!tokenOptional}
            value={accessToken}
            onChange={(event) => setAccessToken(event.target.value)}
            placeholder={status?.tokenHint ?? "EAAG…"}
          />
        </label>
        <label className="mt-3 block text-sm">
          Ad account ID
          <input
            className={fieldClass}
            required
            value={adAccountId}
            onChange={(event) => setAdAccountId(event.target.value)}
            placeholder="act_123… o 123…"
          />
        </label>
        <label className="mt-3 block text-sm">
          Page ID
          <input
            className={fieldClass}
            required
            value={pageId}
            onChange={(event) => setPageId(event.target.value)}
          />
        </label>
        <label className="mt-3 block text-sm">
          Instagram actor ID (opcional, para Stories)
          <input
            className={fieldClass}
            value={instagramActorId}
            onChange={(event) => setInstagramActorId(event.target.value)}
          />
        </label>
        <label className="mt-3 block text-sm">
          Presupuesto diario por ad set ({currency})
          <input
            className={fieldClass}
            type="number"
            min={1}
            required
            value={dailyBudget}
            onChange={(event) => setDailyBudget(Number(event.target.value))}
          />
        </label>
        <p className="mt-1 text-xs text-[#7a7268]">
          Se aplica a cada formato (4:5 y 9:16 = dos ad sets). B2C apunta a
          Montevideo y Ciudad de la Costa; B2B y catering, a Uruguay.
        </p>

        {error ? <p className="mt-3 text-sm text-[#C41E3A]">{error}</p> : null}
        {message ? <p className="mt-3 text-sm text-[#2D2D2D]">{message}</p> : null}

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="submit"
            disabled={busy}
            className="rounded-md bg-[#C41E3A] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
          >
            {busy ? "Guardando…" : "Probar y guardar"}
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={onDisconnect}
            className="rounded-md border border-[#e4ddd0] px-4 py-2 text-sm"
          >
            Borrar token local
          </button>
        </div>
      </form>

      <aside className="rounded-2xl border border-[#e4ddd0] bg-white p-5">
        <h2 className="font-serif text-xl text-[#1A1A1A]">Estado</h2>
        {!status ? (
          <p className="mt-2 text-sm text-[#7a7268]">Consultando…</p>
        ) : status.connected ? (
          <ul className="mt-3 space-y-2 text-sm text-[#2D2D2D]">
            <li>
              <span className="text-[#7a7268]">Cuenta</span>
              <br />
              {status.accountName}
              {status.currency ? ` · ${status.currency}` : ""}
            </li>
            <li>
              <span className="text-[#7a7268]">Page</span>
              <br />
              {status.pageName ?? status.pageId}
            </li>
            <li>
              <span className="text-[#7a7268]">Token</span>
              <br />
              {status.tokenHint}
              {status.source === "env" ? " · desde .env" : ""}
            </li>
            <li>
              <span className="text-[#7a7268]">Budget diario / ad set</span>
              <br />
              {status.dailyBudget} {status.currency}
            </li>
            <li>
              <span className="text-[#7a7268]">Zona B2C</span>
              <br />
              {status.cities?.length
                ? status.cities.map((city) => city.name).join(" y ")
                : "Uruguay (Meta no devolvió las ciudades; se usa el país)"}
            </li>
          </ul>
        ) : (
          <p className="mt-2 text-sm text-[#7a7268]">
            {status.error ??
              "Todavía no hay una cuenta válida. Sin token no se pueden crear anuncios en Meta; el ZIP sigue funcionando."}
          </p>
        )}
      </aside>
    </div>
  );
}
