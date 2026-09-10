import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { MetaCity } from "@/lib/meta-targeting";

export const META_API_VERSION = process.env.META_API_VERSION ?? "v21.0";
export const META_GRAPH = `https://graph.facebook.com/${META_API_VERSION}`;

export type MetaConfig = {
  accessToken: string;
  adAccountId: string;
  pageId: string;
  instagramActorId?: string;
  dailyBudgetMinor: number;
  currency?: string;
  accountName?: string;
  pageName?: string;
  cities?: MetaCity[];
};

const CONFIG_PATH = path.join(process.cwd(), "data", "meta-config.json");
const PUBLISH_PATH = path.join(process.cwd(), "data", "meta-publishes.json");

function normalizeAccountId(id: string) {
  return id.replace(/^act_/i, "").trim();
}

export function actId(id: string) {
  return `act_${normalizeAccountId(id)}`;
}

function fromEnv(): MetaConfig | null {
  const accessToken = process.env.META_ACCESS_TOKEN?.trim();
  const adAccountId = process.env.META_AD_ACCOUNT_ID?.trim();
  const pageId = process.env.META_PAGE_ID?.trim();
  if (!accessToken || !adAccountId || !pageId) return null;
  return {
    accessToken,
    adAccountId: normalizeAccountId(adAccountId),
    pageId,
    instagramActorId: process.env.META_INSTAGRAM_ACTOR_ID?.trim() || undefined,
    dailyBudgetMinor: Number(process.env.META_DAILY_BUDGET_MINOR ?? 40000),
    currency: process.env.META_CURRENCY?.trim() || "UYU",
  };
}

export type MetaConfigSource = "file" | "env" | "none";

export async function inspectMetaConfig(): Promise<{
  config: MetaConfig | null;
  source: MetaConfigSource;
}> {
  try {
    const raw = await readFile(CONFIG_PATH, "utf8");
    const parsed = JSON.parse(raw) as Partial<MetaConfig>;
    if (parsed.accessToken && parsed.adAccountId && parsed.pageId) {
      return { config: await readMetaConfig(), source: "file" };
    }
  } catch {
    // no file
  }
  const env = fromEnv();
  return { config: env, source: env ? "env" : "none" };
}

export async function readMetaConfig(): Promise<MetaConfig | null> {
  try {
    const raw = await readFile(CONFIG_PATH, "utf8");
    const parsed = JSON.parse(raw) as Partial<MetaConfig>;
    if (!parsed.accessToken || !parsed.adAccountId || !parsed.pageId) {
      return fromEnv();
    }
    return {
      accessToken: parsed.accessToken,
      adAccountId: normalizeAccountId(parsed.adAccountId),
      pageId: parsed.pageId,
      instagramActorId: parsed.instagramActorId || undefined,
      dailyBudgetMinor: Number(parsed.dailyBudgetMinor ?? 40000),
      currency: parsed.currency,
      accountName: parsed.accountName,
      pageName: parsed.pageName,
      cities: parsed.cities,
    };
  } catch {
    return fromEnv();
  }
}

export async function writeMetaConfig(config: MetaConfig) {
  await mkdir(path.dirname(CONFIG_PATH), { recursive: true });
  await writeFile(
    CONFIG_PATH,
    JSON.stringify(
      {
        ...config,
        adAccountId: normalizeAccountId(config.adAccountId),
      },
      null,
      2,
    ),
    "utf8",
  );
}

export async function clearMetaConfig() {
  await mkdir(path.dirname(CONFIG_PATH), { recursive: true });
  await writeFile(CONFIG_PATH, "{}", "utf8");
}

export function maskToken(token: string) {
  if (token.length < 8) return "••••";
  return `••••${token.slice(-4)}`;
}

export type GraphError = {
  message: string;
  code?: number;
  type?: string;
  error_user_title?: string;
  error_user_msg?: string;
};

export async function graphGet<T>(
  pathname: string,
  token: string,
  search?: Record<string, string>,
) {
  const url = new URL(`${META_GRAPH}/${pathname.replace(/^\//, "")}`);
  url.searchParams.set("access_token", token);
  if (search) {
    for (const [key, value] of Object.entries(search)) {
      url.searchParams.set(key, value);
    }
  }
  return parseGraph<T>(await fetch(url));
}

export async function graphPost<T>(
  pathname: string,
  token: string,
  body: Record<string, unknown> | FormData,
) {
  const url = `${META_GRAPH}/${pathname.replace(/^\//, "")}`;
  if (body instanceof FormData) {
    body.set("access_token", token);
    return parseGraph<T>(
      await fetch(url, {
        method: "POST",
        body,
      }),
    );
  }
  const form = new URLSearchParams();
  form.set("access_token", token);
  for (const [key, value] of Object.entries(body)) {
    if (value === undefined) continue;
    form.set(
      key,
      typeof value === "object" ? JSON.stringify(value) : String(value),
    );
  }
  return parseGraph<T>(
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: form,
    }),
  );
}

async function parseGraph<T>(response: Response): Promise<T> {
  const json = (await response.json()) as {
    error?: GraphError;
  } & T;
  if (!response.ok || json.error) {
    const message =
      json.error?.error_user_msg ||
      json.error?.error_user_title ||
      json.error?.message ||
      `Meta ${response.status}`;
    throw new Error(message);
  }
  return json;
}

export type MetaPublish = {
  id: string;
  createdAt: string;
  campaignName: string;
  campaignId?: string;
  adSetIds: string[];
  adIds: string[];
  status: "paused" | "error";
  error?: string;
  audience?: string;
  productId?: string;
  destination?: string;
  formats?: string[];
  dailyBudgetMinor?: number;
  currency?: string;
  targeting?: string;
};

export async function readPublishes(): Promise<MetaPublish[]> {
  try {
    const raw = await readFile(PUBLISH_PATH, "utf8");
    return JSON.parse(raw) as MetaPublish[];
  } catch {
    return [];
  }
}

export async function resolveShippingCities(
  token: string,
): Promise<MetaCity[]> {
  const queries = ["Montevideo", "Ciudad de la Costa"];
  const found: MetaCity[] = [];
  for (const query of queries) {
    try {
      const result = await graphGet<{
        data?: Array<{ key: string; name: string; country_code?: string }>;
      }>("search", token, {
        type: "adgeolocation",
        q: query,
        location_types: JSON.stringify(["city"]),
        country_code: "UY",
        limit: "8",
      });
      const match =
        (result.data ?? []).find((item) => {
          const name = item.name.toLowerCase();
          const needle = query.toLowerCase();
          return (
            (item.country_code ?? "UY") === "UY" &&
            (name === needle || name.includes(needle) || needle.includes(name))
          );
        }) ?? (result.data ?? []).find((item) => (item.country_code ?? "UY") === "UY");
      if (match && !found.some((city) => city.key === match.key)) {
        found.push({ key: match.key, name: match.name });
      }
    } catch {
      // sin permiso de targeting search: se usa Uruguay entero
    }
  }
  return found;
}

export async function writePublishes(items: MetaPublish[]) {
  await mkdir(path.dirname(PUBLISH_PATH), { recursive: true });
  await writeFile(PUBLISH_PATH, JSON.stringify(items, null, 2), "utf8");
}
