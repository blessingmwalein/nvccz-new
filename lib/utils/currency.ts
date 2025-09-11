import type { Currency } from "../store/slices/uiSlice"

export const currencyRates = {
  USD: 1,
  ZIG: 0.000025, // Example rate: 1 USD = 40,000 ZIG
}

export function convertCurrency(amount: number, from: Currency, to: Currency): number {
  if (from === to) return amount

  // Convert to USD first, then to target currency
  const usdAmount = from === "USD" ? amount : amount * currencyRates[from]
  return to === "USD" ? usdAmount : usdAmount / currencyRates[to]
}

export function formatCurrency(amount: number, currency: Currency): string {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency === "ZIG" ? "USD" : currency,
    minimumFractionDigits: currency === "ZIG" ? 0 : 2,
    maximumFractionDigits: currency === "ZIG" ? 0 : 2,
  })

  if (currency === "ZIG") {
    return `ZIG ${amount.toLocaleString()}`
  }

  return formatter.format(amount)
}
