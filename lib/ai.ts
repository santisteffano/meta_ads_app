import { generateObject } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { openai } from "@ai-sdk/openai";
import { xai } from "@ai-sdk/xai";
import { LALAS_BRAND, productById } from "@/lib/brand";
import { mockCopyVariants } from "@/lib/mock-copy";
import {
  buildCopyPrompt,
  copyResponseSchema,
  type CopyBrief,
} from "@/lib/prompts";

export type CopySource = "model" | "mock";

function getModel() {
  if (process.env.ANTHROPIC_API_KEY) {
    return anthropic(process.env.COPY_MODEL ?? "claude-sonnet-4-6");
  }
  if (process.env.OPENAI_API_KEY) {
    return openai(process.env.COPY_MODEL ?? "gpt-4.1");
  }
  if (process.env.XAI_API_KEY) {
    return xai(process.env.COPY_MODEL ?? "grok-3");
  }
  return null;
}

function productName(productId: string) {
  if (productId === "marca") return `${LALAS_BRAND.name} (marca general)`;
  return productById(productId)?.name ?? productId;
}

export async function generateCopy(brief: CopyBrief) {
  const model = getModel();
  if (!model) {
    return { source: "mock" as const, ...mockCopyVariants(brief) };
  }

  try {
    const { object } = await generateObject({
      model,
      schema: copyResponseSchema,
      prompt: buildCopyPrompt(brief, productName(brief.productId)),
    });
    return { source: "model" as const, ...object };
  } catch (error) {
    console.error("Copy model failed, falling back to mock", error);
    return { source: "mock" as const, ...mockCopyVariants(brief) };
  }
}

export function hasCopyProvider() {
  return Boolean(
    process.env.ANTHROPIC_API_KEY ||
      process.env.OPENAI_API_KEY ||
      process.env.XAI_API_KEY,
  );
}
