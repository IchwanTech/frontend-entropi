import { LedgerEntry } from "@/types/api.types";
import { formatLedgerAmount } from "@/lib/decimal";
import { clsx } from "clsx";
import { Activity } from "lucide-react";
import Decimal from "decimal.js";
import { formatDateTime } from "@/lib/formatters";

export const LedgerAuditTrail = ({ entries, isLoading }: {
  entries: LedgerEntry[];
  isLoading: boolean;
}) => {
  if (isLoading) {
    return (
      <div className="glass-panel rounded-2xl p-6 space-y-4 animate-pulse">
        <div className="h-6 w-40 bg-slate-800 rounded mb-6"></div>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-16 bg-slate-800/50 rounded-xl"></div>
        ))}
      </div>
    );
  }

  if (!entries.length) {
    return (
      <div className="glass-panel rounded-2xl p-12 text-center flex flex-col items-center justify-center">
        <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mb-4">
          <Activity className="w-6 h-6 text-slate-500" />
        </div>
        <h3 className="text-lg font-medium text-white mb-2">No Transactions Yet</h3>
        <p className="text-slate-400 text-sm max-w-sm">
          Ledger entries will appear here once the payment is processed.
        </p>
      </div>
    );
  }

  const sortedEntries = [...entries].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  let currentBalance = new Decimal(0);
  const entriesWithBalance = sortedEntries.map(entry => {
    const debit = new Decimal(entry.debit || 0);
    const credit = new Decimal(entry.credit || 0);
    currentBalance = currentBalance.add(debit).sub(credit);

    return {
      ...entry,
      runningBalance: currentBalance.toFixed(4)
    };
  }).reverse();
  return (
    <div className="glass-panel rounded-2xl overflow-hidden flex flex-col h-full border border-slate-800/50">
      <div className="p-6 border-b border-slate-800/50 flex items-center justify-between bg-slate-900/20">
        <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          <Activity className="w-5 h-5 text-brand-400" />
          Ledger Audit Trail
        </h2>
        <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
          Double-Entry Active
        </span>
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-3">
        {entriesWithBalance.map((entry, idx) => {
          const isDebit = !!entry.debit && new Decimal(entry.debit).gt(0);
          const amount = isDebit ? entry.debit : entry.credit;

          return (
            <div
              key={entry.id}
              className={clsx(
                "group flex items-center gap-4 p-4 rounded-xl border transition-all duration-300",
                "bg-slate-900/40 hover:bg-slate-800/60",
                isDebit ? "border-emerald-500/10 hover:border-emerald-500/30" : "border-rose-500/10 hover:border-rose-500/30",
                "animate-in fade-in slide-in-from-right-4 fill-mode-both"
              )}
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-white truncate">
                    {entry.account.replace('_', ' ').toUpperCase()}
                  </span>
                  <span className={clsx(
                    "text-[10px] font-bold px-1.5 py-0.5 rounded tracking-wider",
                    isDebit ? "bg-emerald-400/10 text-emerald-400" : "bg-rose-400/10 text-rose-400"
                  )}>
                    {isDebit ? 'DEBIT' : 'CREDIT'}
                  </span>
                </div>
                <div className="text-xs text-slate-500 font-mono">
                  {formatDateTime(entry.timestamp)}
                </div>
              </div>

              <div className="text-right">
                <div className={clsx(
                  "text-base font-bold tabular-nums tracking-tight",
                  isDebit ? "text-emerald-400" : "text-rose-400"
                )}>
                  {isDebit ? '+' : '-'}${formatLedgerAmount(amount)}
                </div>
                <div className="text-xs text-slate-500 font-mono mt-1">
                  Bal: ${formatLedgerAmount(entry.runningBalance)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
