"use client";

import { useState } from "react";
import { apiClient } from "@/lib/api-client";
import { formatCurrency } from "@/lib/decimal";
import { SettlementSummary } from "@/types/api.types";
import { Calendar, ShieldCheck, Play, AlertCircle } from "lucide-react";

export default function SettlementPage() {
  const [date, setDate] = useState(
    () => new Date().toISOString().split("T")[0] as string,
  );
  const [summary, setSummary] = useState<SettlementSummary | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runSettlement = async () => {
    setIsProcessing(true);
    setError(null);
    try {
      const data = await apiClient.settle(date, crypto.randomUUID());
      setSummary(data);
    } catch (err: any) {
      setError(err.message || "Failed to run settlement");
    } finally {
      setIsProcessing(false);
    }
  };

  const getSettlement = async () => {
    setIsProcessing(true);
    setError(null);
    try {
      const data = await apiClient.getSettlement(date);
      setSummary(data);
    } catch (err: any) {
      setError(err.message || "Settlement not found");
      setSummary(null);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
            Daily Settlement
          </h1>
          <p className="text-slate-400 mt-1">
            Calculate and disburse daily revenue to seller account
          </p>
        </div>
      </div>

      <div className="glass-panel rounded-2xl p-6 md:p-8 border border-slate-800/50">
        <div className="flex flex-col md:flex-row gap-6 items-end">
          <div className="flex-1 w-full space-y-2">
            <label className="text-sm font-bold text-slate-400 uppercase tracking-wider">
              Settlement Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-shadow"
              />
            </div>
          </div>

          <div className="flex gap-3 w-full md:w-auto">
            <button
              onClick={getSettlement}
              disabled={isProcessing}
              className="flex-1 md:flex-none px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-all disabled:opacity-50"
            >
              Check Status
            </button>
            <button
              onClick={runSettlement}
              disabled={isProcessing}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:-translate-y-0.5 disabled:opacity-50"
            >
              <Play className="w-4 h-4" /> Run Settlement
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-6 bg-rose-500/10 border border-rose-500/20 text-rose-400 px-4 py-3 rounded-xl flex items-center gap-3 animate-in slide-in-from-top-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}
      </div>

      {summary && (
        <div className="glass-panel rounded-2xl p-8 relative overflow-hidden border border-emerald-500/20 animate-in slide-in-from-bottom-4">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-500/10 rounded-full filter blur-3xl pointer-events-none" />

          <div className="flex items-center gap-3 mb-8 relative z-10">
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">
                Settlement Successful
              </h2>
              <p className="text-emerald-400 font-medium">
                Date: {summary.date}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
            <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-800/50">
              <div className="text-slate-400 text-sm font-medium mb-2">
                Orders Processed
              </div>
              <div className="text-3xl font-bold text-white tabular-nums">
                {summary.totalOrders}
              </div>
            </div>

            <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-800/50">
              <div className="text-slate-400 text-sm font-medium mb-2">
                Total Amount
              </div>
              <div className="text-3xl font-bold text-white tabular-nums">
                {formatCurrency(summary.totalRevenue)}
              </div>
            </div>

            <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-800/50">
              <div className="text-slate-400 text-sm font-medium mb-2">
                Total Fees Collected (3%)
              </div>
              <div className="text-3xl font-bold text-rose-400 tabular-nums">
                -{formatCurrency(summary.totalFees)}
              </div>
            </div>

            <div className="bg-emerald-500/10 rounded-xl p-6 border border-emerald-500/20">
              <div className="text-emerald-400 text-sm font-medium mb-2">
                Net Seller Payout
              </div>
              <div className="text-4xl font-extrabold text-emerald-400 tabular-nums">
                {formatCurrency(summary.totalPayout)}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
