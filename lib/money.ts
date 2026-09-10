export function currencyOffset(currency?: string) {
  if (currency && ["JPY", "KRW", "CLP"].includes(currency.toUpperCase())) {
    return 1;
  }
  return 100;
}

export function toMinor(amount: number, currency?: string) {
  return Math.round(amount * currencyOffset(currency));
}

export function toMajor(minor: number, currency?: string) {
  return minor / currencyOffset(currency);
}

export function formatMoney(amount: number, currency = "UYU") {
  try {
    return new Intl.NumberFormat("es-UY", {
      style: "currency",
      currency,
      maximumFractionDigits: currency === "UYU" ? 0 : 2,
    }).format(amount);
  } catch {
    return `${amount} ${currency}`;
  }
}
