"use client";

import { useState } from "react";
import { apiClient } from "@/lib/api-client";
import { AmountDisplay } from "@/components/ui/AmountDisplay";
import type { SettlementSummary } from "@/types/api.types";
import { clsx } from "clsx";

export const SettlementPanel = () => {
  const [date, setDate] = useState(
    () => new Date().toISOString().split("T")[0]!,
  );
  const [result, setResult] = useState<SettlementSummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isIdempotent, setIsIdempotent] = useState(false);

  async function runSettlement() {
    setIsLoading(true);
    setError(null);
    try {
      const key = `settle-${date}-${Date.now()}`;
      const data = await apiClient.settle(date, key);
      setResult(data);
      setIsIdempotent((data as any).idempotent ?? false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Settlement failed");
    } finally {
      setIsLoading(false);
    }
  }

  async function checkSettlement() {
    setIsLoading(true);
    setError(null);
    try {
      const data = await apiClient.getSettlement(date);
      setResult(data);
      setIsIdempotent(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No settlement found for this date",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-5">
      {/* Date picker + actions */}
      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="text-sm font-semibold text-slate-800 mb-4">
          Daily Settlement
        </h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="date"
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
              setResult(null);
            }}
            className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-400"
          />
          <button
            onClick={checkSettlement}
            disabled={isLoading}
            className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-colors"
          >
            Check
          </button>
          <button
            onClick={runSettlement}
            disabled={isLoading}
            className="px-4 py-2 rounded-lg bg-slate-900 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50 transition-colors"
          >
            {isLoading ? "Processing…" : "Run Settlement"}
          </button>
        </div>
        {error && <p className="mt-3 text-xs text-red-500">{error}</p>}
      </div>

      {/* Result */}
      {result && (
        <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-semibold text-slate-800">
                Settlement — {result.date}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Settled at {new Date(result.settledAt).toLocaleString()}
              </p>
            </div>
            {isIdempotent && (
              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                Already settled
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-slate-100">
            <StatCell label="Orders" value={String(result.totalOrders)} />
            <StatCell label="Revenue" value={result.totalRevenue} isAmount />
            <StatCell
              label="Fees Collected"
              value={result.totalFees}
              isAmount
              variant="deduct"
            />
            <StatCell
              label="Seller Payout"
              value={result.totalPayout}
              isAmount
              variant="positive"
            />
          </div>
        </div>
      )}
    </div>
  );
};

function StatCell({
  label,
  value,
  isAmount,
  variant,
}: {
  label: string;
  value: string;
  isAmount?: boolean;
  variant?: "positive" | "deduct";
}) {
  return (
    <div className="px-5 py-4">
      <p className="text-xs text-slate-400 mb-1">{label}</p>
      {isAmount ? (
        <AmountDisplay
          value={value}
          size="md"
          className={clsx(
            variant === "positive" && "text-emerald-700",
            variant === "deduct" && "text-slate-500",
            !variant && "text-slate-800",
          )}
        />
      ) : (
        <p className="text-base font-semibold tabular-nums text-slate-800">
          {value}
        </p>
      )}
    </div>
  );
}
