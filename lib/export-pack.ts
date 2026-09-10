import { zipSync, strToU8 } from "fflate";
import { composeAd, loadImage, type ComposeRatio } from "@/lib/compose";
import {
  buildCopyCsv,
  buildExportReadme,
  buildMetaCsv,
  type ExportVariant,
} from "@/lib/meta-csv";
import { imageFileName, zipFileName } from "@/lib/naming";
import type { CopyBrief } from "@/lib/prompts";

async function canvasPng(canvas: HTMLCanvasElement) {
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (value) => (value ? resolve(value) : reject(new Error("No se pudo exportar PNG"))),
      "image/png",
    );
  });
  return new Uint8Array(await blob.arrayBuffer());
}

export async function composeVariantPngs(input: {
  brief: CopyBrief;
  variants: ExportVariant[];
  formats: CopyBrief["formats"];
  imageUrl: string;
  overlay: boolean;
}) {
  await document.fonts.ready;
  const image = await loadImage(input.imageUrl);
  const files: { filename: string; bytes: Uint8Array }[] = [];
  for (const variant of input.variants) {
    for (const format of input.formats) {
      const canvas = composeAd({
        image,
        ratio: format as ComposeRatio,
        headline: variant.headline,
        eyebrow: "Lala's",
        overlay: input.overlay,
        focusX: 50,
        focusY: 40,
        safeZone: false,
      });
      files.push({
        filename: imageFileName(input.brief, variant.index, format),
        bytes: await canvasPng(canvas),
      });
    }
  }
  return files;
}

export async function buildExportZip(input: {
  brief: CopyBrief;
  variants: ExportVariant[];
  formats: CopyBrief["formats"];
  imageUrl?: string;
  overlay: boolean;
}) {
  await document.fonts.ready;
  const files: Record<string, Uint8Array> = {
    "LEEME.txt": strToU8(
      buildExportReadme(input.brief, input.variants.length * input.formats.length),
    ),
    "ads-meta.csv": strToU8(
      buildMetaCsv(input.brief, input.variants, input.formats),
    ),
    "copy.csv": strToU8(buildCopyCsv(input.brief, input.variants, input.formats)),
  };

  if (input.imageUrl) {
    const pngs = await composeVariantPngs({
      brief: input.brief,
      variants: input.variants,
      formats: input.formats,
      imageUrl: input.imageUrl,
      overlay: input.overlay,
    });
    for (const png of pngs) {
      files[`imagenes/${png.filename}`] = png.bytes;
    }
  }

  const zipped = zipSync(files, { level: 6 });
  return {
    blob: new Blob([zipped], { type: "application/zip" }),
    filename: zipFileName(input.brief),
  };
}

export function bytesToBase64(bytes: Uint8Array) {
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

export function downloadBlob(blob: Blob, filename: string) {
  const href = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = href;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(href);
}
