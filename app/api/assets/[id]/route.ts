import { unlink } from "node:fs/promises";
import { NextResponse } from "next/server";
import { diskAssetPath, readCatalog, writeCatalog } from "@/lib/asset-store";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = (await request.json()) as { productId?: string };
  const catalog = await readCatalog();
  const index = catalog.findIndex((asset) => asset.id === id);
  if (index < 0) {
    return NextResponse.json({ error: "No está" }, { status: 404 });
  }
  if (body.productId) {
    catalog[index] = { ...catalog[index], productId: body.productId };
  }
  await writeCatalog(catalog);
  return NextResponse.json({ asset: catalog[index] });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const catalog = await readCatalog();
  const asset = catalog.find((item) => item.id === id);
  if (!asset) {
    return NextResponse.json({ error: "No está" }, { status: 404 });
  }
  await unlink(diskAssetPath(asset.filename)).catch(() => undefined);
  await writeCatalog(catalog.filter((item) => item.id !== id));
  return NextResponse.json({ ok: true });
}
