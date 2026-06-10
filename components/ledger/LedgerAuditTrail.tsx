import { LedgerEntry } from "@/types/api.types";
import { formatLedgerAmount, isPositive } from "@/lib/decimal";
import { clsx } from "clsx";
import { ArrowDownRight, ArrowUpRight, Activity } from "lucide-react";
import Decimal from "decimal.js";

interface LedgerAuditTrailProps {
  entries: LedgerEntry[];
  isLoading: boolean;
}

export const LedgerAuditTrail = ({ entries, isLoading }: LedgerAuditTrailProps) => {
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

  // Calculate running balance per entry
  // Because entries come from oldest to newest (or newest to oldest), we need to sort them chronologically
  const sortedEntries = [...entries].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  
  let currentBalance = new Decimal(0);
  const entriesWithBalance = sortedEntries.map(entry => {
    const debit = new Decimal(entry.debit || 0);
    const credit = new Decimal(entry.credit || 0);
    // Standard accounting formula: new_balance = old_balance + debit - credit
    // Wait, it depends on normal balance of the account. Let's just track net movement for the order.
    // For order context, debit means money in (receivable/cash), credit means money out (revenue/liability).
    // Let's just show the net effect on "seller balance" (order_balance - fees).
    // Actually, double entry requires sum(debit) = sum(credit).
    currentBalance = currentBalance.add(debit).sub(credit);
    
    return {
      ...entry,
      runningBalance: currentBalance.toFixed(4)
    };
  }).reverse(); // Reverse for display (newest first)

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
          const isCredit = !!entry.credit && new Decimal(entry.credit).gt(0);
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
              <div className={clsx(
                "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110",
                isDebit ? "bg-emerald-500/10" : "bg-rose-500/10"
              )}>
                {isDebit ? (
                  <ArrowDownRight className="w-5 h-5 text-emerald-400" />
                ) : (
                  <ArrowUpRight className="w-5 h-5 text-rose-400" />
                )}
              </div>

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
                  {new Date(entry.timestamp).toLocaleString()}
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
