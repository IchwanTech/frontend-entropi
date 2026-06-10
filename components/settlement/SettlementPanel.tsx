"use client";

import { useState } from "react";
import { AmountDisplay } from "@/components/ui/AmountDisplay";
import { clsx } from "clsx";
import { useSettlement } from "@/hooks/useSettlement";
import { Calendar, Play, AlertCircle, CheckCircle2, Info } from "lucide-react";

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
    <div className="space-y-8">
      {/* Date picker + actions */}
      <div className="glass-panel rounded-2xl p-6 md:p-8 border border-slate-800/50 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/5 rounded-full filter blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row gap-6 items-end relative z-10">
          <div className="flex-1 w-full space-y-2">
            <label className="text-sm font-bold text-slate-400 uppercase tracking-wider">
              Settlement Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="date"
                value={date}
                onChange={(e) => {
                  setDate(e.target.value);
                  reset();
                }}
                className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-shadow [color-scheme:dark]"
              />
            </div>
          </div>

          <div className="flex gap-3 w-full md:w-auto">
            <button
              onClick={() => checkSettlement(date)}
              disabled={isLoading}
              className="flex-1 md:flex-none px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-all disabled:opacity-50 border border-slate-700"
            >
              Check Status
            </button>
            <button
              onClick={() => runSettlement(date)}
              disabled={isLoading || isAlreadySettled}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:-translate-y-0.5 disabled:opacity-50 disabled:bg-slate-800 disabled:text-slate-500 disabled:shadow-none disabled:transform-none disabled:border-slate-700 disabled:border"
            >
              {!isAlreadySettled && <Play className="w-4 h-4" />} 
              {isLoading ? "Processing…" : isAlreadySettled ? "Already Settled" : "Run Settlement"}
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-6 bg-rose-500/10 border border-rose-500/20 text-rose-400 px-4 py-3 rounded-xl flex items-center gap-3 animate-in slide-in-from-top-2 relative z-10">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}
      </div>

      {/* Result */}
      {result && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Feedback Banners */}
          {lastAction === 'run' && !isIdempotent && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-5 py-4 rounded-xl flex items-center gap-3 text-sm font-medium shadow-sm">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              Settlement for {result.date} has been successfully processed! Ledger entries created.
            </div>
          )}
          {lastAction === 'run' && isIdempotent && (
            <div className="bg-amber-500/10 border border-amber-500/20 text-amber-400 px-5 py-4 rounded-xl flex items-center gap-3 text-sm font-medium shadow-sm">
              <Info className="w-5 h-5 flex-shrink-0" />
              Settlement for this date was already processed previously. Showing existing data.
            </div>
          )}
          {lastAction === 'check' && (
            <div className="bg-blue-500/10 border border-blue-500/20 text-blue-400 px-5 py-4 rounded-xl flex items-center gap-3 text-sm font-medium shadow-sm">
              <Info className="w-5 h-5 flex-shrink-0" />
              Past settlement record retrieved for {result.date}.
            </div>
          )}

          {/* Results Grid - Using old dark glassmorphism style */}
          <div className="glass-panel rounded-2xl p-8 relative overflow-hidden border border-emerald-500/20">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-500/10 rounded-full filter blur-3xl pointer-events-none" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 relative z-10">
              <div>
                <h2 className="text-2xl font-bold text-white tracking-tight">
                  Settlement Details
                </h2>
                <p className="text-emerald-400 font-medium flex items-center gap-2 mt-1">
                  Date: {result.date}
                  {isIdempotent && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 uppercase tracking-wider">
                      Already Settled
                    </span>
                  )}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-400">Processed at</p>
                <p className="text-sm font-mono text-slate-300">
                  {new Date(result.settledAt).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
              <StatCard label="Orders Processed" value={String(result.totalOrders)} />
              <StatCard label="Total Revenue" value={result.totalRevenue} isAmount />
              <StatCard label="Total Fees (3%)" value={result.totalFees} isAmount variant="deduct" />
              <StatCard label="Net Seller Payout" value={result.totalPayout} isAmount variant="positive" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({
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
    <div className={clsx(
      "rounded-xl p-6 border",
      variant === "positive" 
        ? "bg-emerald-500/10 border-emerald-500/20" 
        : "bg-slate-900/50 border-slate-800/50"
    )}>
      <div className={clsx(
        "text-sm font-medium mb-2",
        variant === "positive" ? "text-emerald-400" : "text-slate-400"
      )}>
        {label}
      </div>
      
      {isAmount ? (
        <div className="flex items-center">
          <AmountDisplay
            value={value}
            size="lg"
            className={clsx(
              variant === "positive" && "text-emerald-400",
              variant === "deduct" && "text-rose-400",
              !variant && "text-white",
            )}
          />
        </div>
      ) : (
        <div className="text-3xl font-bold text-white tabular-nums">
          {value}
        </div>
      )}
    </div>
  );
}
