export type AssetSource = "upload" | "shop";

export type Asset = {
  id: string;
  filename: string;
  url: string;
  productId: string;
  alt: string;
  source: AssetSource;
  createdAt: string;
};

export const ASSET_DIR = "public/assets";
export const ASSET_CATALOG = "data/assets.json";
export const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;
export const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);
