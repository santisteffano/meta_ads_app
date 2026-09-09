import { LALAS_BRAND } from "@/lib/brand";

export type QaIssue = {
  code: string;
  message: string;
  severity: "error" | "warning";
};

export type QaResult = {
  ok: boolean;
  issues: QaIssue[];
  counts: {
    primaryText: number;
    headline: number;
    description: number;
  };
};

const LIMITS = {
  primaryTextIdeal: 125,
  primaryTextMax: 220,
  headlineIdeal: 27,
  headlineMax: 40,
  descriptionMax: 30,
};

function hasForbiddenPhrase(text: string) {
  const haystack = text.toLowerCase();
  return LALAS_BRAND.forbiddenPhrases.filter((phrase) =>
    haystack.includes(phrase.toLowerCase()),
  );
}

export function reviewCopyVariant(variant: {
  primaryText: string;
  headline: string;
  description: string;
}): QaResult {
  const issues: QaIssue[] = [];
  const blob = `${variant.primaryText} ${variant.headline} ${variant.description}`;

  for (const phrase of hasForbiddenPhrase(blob)) {
    issues.push({
      code: "forbidden_phrase",
      message: `No usar “${phrase}”.`,
      severity: "error",
    });
  }

  if (variant.primaryText.length > LIMITS.primaryTextMax) {
    issues.push({
      code: "primary_too_long",
      message: `Primary text tiene ${variant.primaryText.length} caracteres (máx ${LIMITS.primaryTextMax}).`,
      severity: "error",
    });
  } else if (variant.primaryText.length > LIMITS.primaryTextIdeal) {
    issues.push({
      code: "primary_truncates",
      message: `Primary text ${variant.primaryText.length}c: en mobile se corta a ~${LIMITS.primaryTextIdeal}.`,
      severity: "warning",
    });
  }

  if (variant.headline.length > LIMITS.headlineMax) {
    issues.push({
      code: "headline_too_long",
      message: `Headline tiene ${variant.headline.length} caracteres (máx ${LIMITS.headlineMax}).`,
      severity: "error",
    });
  } else if (variant.headline.length > LIMITS.headlineIdeal) {
    issues.push({
      code: "headline_truncates",
      message: `Headline ${variant.headline.length}c: Feed a menudo muestra ~${LIMITS.headlineIdeal}.`,
      severity: "warning",
    });
  }

  if (variant.description.length > LIMITS.descriptionMax) {
    issues.push({
      code: "description_too_long",
      message: `Description tiene ${variant.description.length} caracteres (máx ${LIMITS.descriptionMax}).`,
      severity: "error",
    });
  }

  if (/lalaspizza\.shop/i.test(blob)) {
    issues.push({
      code: "wrong_domain",
      message: "Usá lalaspizza.uy, no .shop.",
      severity: "error",
    });
  }

  return {
    ok: issues.every((issue) => issue.severity !== "error"),
    issues,
    counts: {
      primaryText: variant.primaryText.length,
      headline: variant.headline.length,
      description: variant.description.length,
    },
  };
}
