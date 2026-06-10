"use client";

import { useState } from "react";
import { AmountDisplay } from "@/components/ui/AmountDisplay";
import { clsx } from "clsx";
import { useSettlement } from "@/hooks/useSettlement";

export const SettlementPanel = () => {
  const [date, setDate] = useState(
    () => new Date().toISOString().split("T")[0]!,
  );
  const {
    result,
    isLoading,
    error,
    isIdempotent,
    lastAction,
    runSettlement,
    checkSettlement,
    reset,
  } = useSettlement();

  const isAlreadySettled = result !== null;

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
              reset();
            }}
            className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-400"
          />
          <button
            onClick={() => checkSettlement(date)}
            disabled={isLoading}
            className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-colors"
          >
            Check
          </button>
          <button
            onClick={() => runSettlement(date)}
            disabled={isLoading || isAlreadySettled}
            className="px-4 py-2 rounded-lg bg-slate-900 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50 disabled:bg-slate-300 disabled:text-slate-500 transition-colors"
          >
            {isLoading ? "Processing…" : isAlreadySettled ? "Already Settled" : "Run Settlement"}
          </button>
        </div>
        {error && <p className="mt-3 text-xs text-red-500">{error}</p>}
      </div>

      {/* Result */}
      {result && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
          {/* Feedback Banners */}
          {lastAction === 'run' && !isIdempotent && (
            <div className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-medium shadow-sm">
              <span className="text-lg">✅</span>
              Settlement for {result.date} has been successfully processed! Ledger entries created.
            </div>
          )}
          {lastAction === 'run' && isIdempotent && (
            <div className="bg-amber-50 text-amber-700 border border-amber-200 px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-medium shadow-sm">
              <span className="text-lg">ℹ️</span>
              Settlement for this date was already processed previously. Showing existing data.
            </div>
          )}
          {lastAction === 'check' && (
            <div className="bg-blue-50 text-blue-700 border border-blue-200 px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-medium shadow-sm">
              <span className="text-lg">🔍</span>
              Past settlement record retrieved for {result.date}.
            </div>
          )}

          <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
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
        </div>
      )}
    </div>
  );
};

const StatCell = ({
  label,
  value,
  isAmount,
  variant,
}: {
  label: string;
  value: string;
  isAmount?: boolean;
  variant?: "positive" | "deduct";
}) => {
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
