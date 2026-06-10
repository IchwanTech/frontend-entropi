import Decimal from "decimal.js";

Decimal.set({ precision: 18, rounding: Decimal.ROUND_HALF_UP });

// Format untuk display: strip trailing zeros tapi tetap minimal 2dp
// "100.0000" → "$100.00", "29999.9997" → "$29,999.9997"
export const formatCurrency = (value: string): string => {
  const d = new Decimal(value);
  const fixed = d.toFixed(4);
  const [integer, decimal] = fixed.split(".");
  const trimmed = decimal!.replace(/0+$/, "").padEnd(2, "0"); // min 2dp
  const formatted = Number(integer).toLocaleString("en-US");
  return `$${formatted}.${trimmed}`;
};

// Format untuk tabel ledger: selalu 4dp
export const formatLedgerAmount = (value: string | null): string => {
  if (!value) return "—";
  return new Decimal(value).toFixed(4);
};

// Hitung apakah ini positif/negatif untuk coloring
export const isPositive = (value: string): boolean => {
  return new Decimal(value).gt(0);
};
