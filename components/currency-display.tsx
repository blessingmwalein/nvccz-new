"use client"

import { useAppSelector } from "@/lib/store"
import { convertCurrency, formatCurrency } from "@/lib/utils/currency"

interface CurrencyDisplayProps {
  amount: number
  className?: string
}

export function CurrencyDisplay({ amount, className }: CurrencyDisplayProps) {
  const currency = useAppSelector((state) => state.ui.currency)

  const convertedAmount = convertCurrency(amount, "USD", currency)
  const formattedAmount = formatCurrency(convertedAmount, currency)

  return <span className={className}>{formattedAmount}</span>
}
