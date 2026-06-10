"use client";

import { SettlementPanel } from "@/components/settlement/SettlementPanel";

export default function SettlementPage() {
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

      <SettlementPanel />
    </div>
  );
}
