import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  ASSET_CATALOG,
  ASSET_DIR,
  type Asset,
} from "@/lib/assets";

function catalogPath() {
  return path.join(process.cwd(), ASSET_CATALOG);
}

function assetDir() {
  return path.join(process.cwd(), ASSET_DIR);
}

export async function ensureAssetDirs() {
  await mkdir(assetDir(), { recursive: true });
  await mkdir(path.dirname(catalogPath()), { recursive: true });
}

export async function readCatalog(): Promise<Asset[]> {
  await ensureAssetDirs();
  try {
    const raw = await readFile(catalogPath(), "utf8");
    return JSON.parse(raw) as Asset[];
  } catch {
    return [];
  }
}

export async function writeCatalog(assets: Asset[]) {
  await ensureAssetDirs();
  await writeFile(catalogPath(), JSON.stringify(assets, null, 2), "utf8");
}

export function publicAssetUrl(filename: string) {
  return `/assets/${filename}`;
}

export function diskAssetPath(filename: string) {
  return path.join(assetDir(), filename);
}
