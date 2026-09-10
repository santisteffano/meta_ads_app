"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { formatMoney, toMajor } from "@/lib/money";
import { adsManagerUrl } from "@/lib/meta-targeting";

type LocalPublish = {
  id: string;
  createdAt: string;
  campaignName: string;
  campaignId?: string;
  adSetIds: string[];
  adIds: string[];
  status: string;
  error?: string;
  targeting?: string;
  dailyBudgetMinor?: number;
  currency?: string;
  productId?: string;
};

type RemoteCampaign = {
  id: string;
  name: string;
  status: string;
  effective_status?: string;
  insights?: {
    data?: Array<{
      impressions?: string;
      clicks?: string;
      spend?: string;
      ctr?: string;
      cpc?: string;
    }>;
  };
};

export function CampaignsList() {
  const [local, setLocal] = useState<LocalPublish[]>([]);
  const [remote, setRemote] = useState<RemoteCampaign[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const [accountId, setAccountId] = useState<string | null>(null);
  const [currency, setCurrency] = useState("UYU");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/meta/campaigns");
      const data = (await response.json()) as {
        local?: LocalPublish[];
        remote?: RemoteCampaign[];
        error?: string;
        connected?: boolean;
        accountId?: string;
        currency?: string;
      };
      setLocal(data.local ?? []);
      setRemote(data.remote ?? []);
      setError(data.error ?? null);
      setConnected(Boolean(data.connected));
      setAccountId(data.accountId ?? null);
      setCurrency(data.currency ?? "UYU");
    } catch {
      setError("No se pudieron leer las campañas");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load().catch(() => undefined);
  }, [load]);

  if (loading && !local.length && !remote.length) {
    return <p className="text-sm text-[#7a7268]">Cargando campañas…</p>;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-[#7a7268]">
          {connected
            ? "Cuenta conectada. Insights de los últimos 7 días."
            : "Sin Meta conectada: se ve solo lo creado desde el studio."}
        </p>
        <button
          type="button"
          onClick={() => load()}
          className="rounded-md border border-[#e4ddd0] bg-white px-3 py-1.5 text-sm"
        >
          Actualizar
        </button>
      </div>

      {error ? (
        <p className="rounded-xl border border-[#e4ddd0] bg-white px-4 py-3 text-sm text-[#C41E3A]">
          {error}
        </p>
      ) : null}

      {!connected && !error ? (
        <p className="rounded-xl border border-[#e4ddd0] bg-white px-4 py-3 text-sm text-[#5c564e]">
          Conectá la cuenta en{" "}
          <Link href="/settings" className="underline">
            Ajustes
          </Link>{" "}
          para ver Ads Manager acá.
        </p>
      ) : null}

      <section>
        <h2 className="font-serif text-xl text-[#1A1A1A]">Creadas desde el studio</h2>
        {local.length === 0 ? (
          <p className="mt-2 text-sm text-[#7a7268]">
            Todavía no hay publicaciones. Aprobá copy en Generar y usá Crear
            en Meta.
          </p>
        ) : (
          <ul className="mt-3 space-y-3">
            {local.map((item) => (
              <li
                key={item.id}
                className="rounded-2xl border border-[#e4ddd0] bg-white p-4"
              >
                <p className="font-medium text-[#1A1A1A]">{item.campaignName}</p>
                <p className="mt-1 text-sm text-[#7a7268]">
                  {new Date(item.createdAt).toLocaleString("es-UY")} ·{" "}
                  {item.adIds.length} ads · {item.status.toUpperCase()}
                  {item.targeting ? ` · ${item.targeting}` : ""}
                  {item.dailyBudgetMinor
                    ? ` · ${formatMoney(toMajor(item.dailyBudgetMinor, item.currency), item.currency ?? currency)}/día`
                    : ""}
                </p>
                {accountId && item.campaignId ? (
                  <a
                    href={adsManagerUrl(accountId, item.campaignId)}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-block text-sm underline"
                  >
                    Abrir en Ads Manager
                  </a>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="font-serif text-xl text-[#1A1A1A]">
          Ads Manager · últimos 7 días
        </h2>
        {remote.length === 0 ? (
          <p className="mt-2 text-sm text-[#7a7268]">
            {connected
              ? "No hay campañas remotas en esta cuenta."
              : "Conectá Meta para listar la cuenta."}
          </p>
        ) : (
          <div className="mt-3 overflow-x-auto rounded-2xl border border-[#e4ddd0] bg-white">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-[#e4ddd0] text-[#7a7268]">
                <tr>
                  <th className="px-4 py-3 font-medium">Campaña</th>
                  <th className="px-4 py-3 font-medium">Estado</th>
                  <th className="px-4 py-3 font-medium">Impresiones</th>
                  <th className="px-4 py-3 font-medium">Clicks</th>
                  <th className="px-4 py-3 font-medium">CTR</th>
                  <th className="px-4 py-3 font-medium">Spend</th>
                </tr>
              </thead>
              <tbody>
                {remote.map((campaign) => {
                  const row = campaign.insights?.data?.[0];
                  return (
                    <tr key={campaign.id} className="border-t border-[#f0ebe3]">
                      <td className="px-4 py-3 text-[#1A1A1A]">
                        {accountId ? (
                          <a
                            href={adsManagerUrl(accountId, campaign.id)}
                            target="_blank"
                            rel="noreferrer"
                            className="underline-offset-2 hover:underline"
                          >
                            {campaign.name}
                          </a>
                        ) : (
                          campaign.name
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {campaign.effective_status ?? campaign.status}
                      </td>
                      <td className="px-4 py-3">{row?.impressions ?? "—"}</td>
                      <td className="px-4 py-3">{row?.clicks ?? "—"}</td>
                      <td className="px-4 py-3">{row?.ctr ?? "—"}</td>
                      <td className="px-4 py-3">
                        {row?.spend
                          ? formatMoney(Number(row.spend), currency)
                          : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
