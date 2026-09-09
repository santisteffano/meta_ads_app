import { randomUUID } from "node:crypto";
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import {
  ALLOWED_TYPES,
  MAX_UPLOAD_BYTES,
  type Asset,
} from "@/lib/assets";
import {
  diskAssetPath,
  publicAssetUrl,
  readCatalog,
  writeCatalog,
} from "@/lib/asset-store";
import { SHOP_IMAGES } from "@/lib/shop-images";

export const runtime = "nodejs";
export const maxDuration = 120;

function extFromType(type: string) {
  if (type === "image/png") return ".png";
  if (type === "image/webp") return ".webp";
  return ".jpg";
}

export async function GET() {
  const assets = await readCatalog();
  return NextResponse.json({ assets });
}

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    const body = (await request.json()) as { action?: string };
    if (body.action === "seed") {
      return seedFromShop();
    }
    return NextResponse.json({ error: "Acción no soportada" }, { status: 400 });
  }

  const form = await request.formData();
  const file = form.get("file");
  const productId = String(form.get("productId") ?? "marca");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Falta el archivo" }, { status: 400 });
  }
  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json(
      { error: "Usá JPG, PNG o WebP" },
      { status: 400 },
    );
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return NextResponse.json(
      { error: "La foto no puede pasar de 8 MB" },
      { status: 400 },
    );
  }

  const id = randomUUID();
  const filename = `${id}${extFromType(file.type)}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(diskAssetPath(filename), buffer);

  const asset: Asset = {
    id,
    filename,
    url: publicAssetUrl(filename),
    productId,
    alt: file.name,
    source: "upload",
    createdAt: new Date().toISOString(),
  };

  const catalog = await readCatalog();
  catalog.unshift(asset);
  await writeCatalog(catalog);

  return NextResponse.json({ asset });
}

async function seedFromShop() {
  const catalog = await readCatalog();
  const have = new Set(
    catalog.filter((item) => item.source === "shop").map((item) => item.productId),
  );
  const added: Asset[] = [];

  for (const image of SHOP_IMAGES) {
    if (have.has(image.productId)) continue;

    const response = await fetch(image.src);
    if (!response.ok) continue;

    const type = response.headers.get("content-type") ?? "image/jpeg";
    const ext = type.includes("png")
      ? ".png"
      : type.includes("webp")
        ? ".webp"
        : path.extname(new URL(image.src).pathname) || ".jpg";
    const id = randomUUID();
    const filename = `${id}${ext}`;
    const buffer = Buffer.from(await response.arrayBuffer());
    await writeFile(diskAssetPath(filename), buffer);

    const asset: Asset = {
      id,
      filename,
      url: publicAssetUrl(filename),
      productId: image.productId,
      alt: image.alt,
      source: "shop",
      createdAt: new Date().toISOString(),
    };
    added.push(asset);
  }

  const next = [...added, ...catalog];
  await writeCatalog(next);
  return NextResponse.json({ assets: next, imported: added.length });
}
