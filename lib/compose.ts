import { FORMATS } from "@/lib/brand";

export type ComposeRatio = (typeof FORMATS)[number]["id"];

export type ComposeOptions = {
  image: HTMLImageElement;
  ratio: ComposeRatio;
  headline: string;
  eyebrow: string;
  overlay: boolean;
  focusX: number;
  focusY: number;
  safeZone: boolean;
};

function sizeFor(ratio: ComposeRatio) {
  const format = FORMATS.find((item) => item.id === ratio);
  return { width: format?.width ?? 1080, height: format?.height ?? 1350 };
}

function coverDraw(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  width: number,
  height: number,
  focusX: number,
  focusY: number,
) {
  const scale = Math.max(width / image.width, height / image.height);
  const drawW = image.width * scale;
  const drawH = image.height * scale;
  const maxX = Math.max(0, drawW - width);
  const maxY = Math.max(0, drawH - height);
  const x = -maxX * (focusX / 100);
  const y = -maxY * (focusY / 100);
  ctx.drawImage(image, x, y, drawW, drawH);
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
) {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (ctx.measureText(next).width > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }
  if (current) lines.push(current);
  return lines.slice(0, 3);
}

export function composeAd(options: ComposeOptions) {
  const { width, height } = sizeFor(options.ratio);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("No se pudo abrir el canvas");

  ctx.fillStyle = "#1A1A1A";
  ctx.fillRect(0, 0, width, height);
  coverDraw(ctx, options.image, width, height, options.focusX, options.focusY);

  if (options.overlay) {
    const barH = Math.round(height * 0.28);
    ctx.fillStyle = "rgba(26, 26, 26, 0.72)";
    ctx.fillRect(0, height - barH, width, barH);

    const pad = Math.round(width * 0.07);
    ctx.fillStyle = "#F5F0E6";
    ctx.font = `600 ${Math.round(width * 0.028)}px "DM Sans", system-ui, sans-serif`;
    ctx.fillText((options.eyebrow || "LALA'S").toUpperCase(), pad, height - barH + Math.round(width * 0.07));

    ctx.font = `600 ${Math.round(width * 0.068)}px Fraunces, Georgia, serif`;
    const lines = wrapText(ctx, options.headline, width - pad * 2);
    let textY = height - barH + Math.round(width * 0.15);
    for (const line of lines) {
      ctx.fillText(line, pad, textY);
      textY += Math.round(width * 0.08);
    }
  }

  if (options.safeZone && options.ratio === "9:16") {
    ctx.fillStyle = "rgba(196, 30, 58, 0.18)";
    ctx.fillRect(0, 0, width, Math.round(height * 0.12));
    ctx.fillRect(0, height - Math.round(height * 0.18), width, Math.round(height * 0.18));
  }

  return canvas;
}

export async function loadImage(src: string) {
  const image = new Image();
  image.crossOrigin = "anonymous";
  await new Promise<void>((resolve, reject) => {
    image.onload = () => resolve();
    image.onerror = () => reject(new Error("No se pudo leer la foto"));
    image.src = src;
  });
  return image;
}
