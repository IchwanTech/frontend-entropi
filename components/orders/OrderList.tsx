"use client";

import { useState } from "react";
import Link from "next/link";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { AmountDisplay } from "@/components/ui/AmountDisplay";
import { Skeleton } from "@/components/ui/Skeleton";
import type { OrderStatus } from "@/types/api.types";
import { STATUS_FILTERS, formatDateTime } from "@/lib/formatters";
import { useOrders } from "@/hooks/useOrders";

export const OrderList = () => {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const { orders, total, isLoading, error } = useOrders(page, status);

  return (
    <div className="space-y-4">
      {/* Filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => {
              setStatus(f.value);
              setPage(1);
            }}
            className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${status === f.value
                ? "bg-brand-600 text-white shadow-md shadow-brand-500/20"
                : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200 border border-slate-700"
              }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="glass-panel rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-14 rounded-xl" />
            ))}
          </div>
        ) : error ? (
          <div className="p-8 text-sm text-red-400 bg-red-500/10">{error}</div>
        ) : orders.length === 0 ? (
          <div className="py-20 text-center">
            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📭</span>
            </div>
            <p className="text-base font-medium text-slate-300">
              No orders found
            </p>
            <p className="text-sm text-slate-500 mt-1">
              Try adjusting your filters
            </p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-slate-500 border-b border-slate-700/60 bg-slate-800/50 uppercase tracking-wider">
                <th className="text-left font-bold px-4 py-4">Customer</th>
                <th className="text-right font-bold px-4 py-4">Amount</th>
                <th className="text-right font-bold px-4 py-4">Payout</th>
                <th className="text-left font-bold px-4 py-4">Status</th>
                <th className="text-left font-bold px-6 py-4">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-slate-800/40 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <Link
                      href={`/orders/${order.id}`}
                      className="font-mono text-sm text-brand-400 hover:text-brand-300 font-medium group-hover:underline"
                    >
                      {order.id.slice(0, 16)}…
                    </Link>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <AmountDisplay
                      value={order.amount}
                      size="sm"
                      className="font-semibold text-slate-200"
                    />
                  </td>
                  <td className="px-4 py-4 text-right">
                    <AmountDisplay
                      value={order.payout}
                      size="sm"
                      className="font-semibold text-emerald-400"
                    />
                  </td>
                  <td className="px-4 py-4">
                    <StatusBadge status={order.status as OrderStatus} />
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500 whitespace-nowrap">
                    {formatDateTime(order.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Pagination */}
        {total > 20 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800/60 bg-slate-800/30">
            <p className="text-sm font-medium text-slate-400">
              {total} total orders
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 text-sm font-medium rounded-xl border border-slate-700 bg-slate-800 text-slate-400 disabled:opacity-50 hover:bg-slate-700 hover:text-slate-200 transition-colors"
              >
                Previous
              </button>
              <div className="flex items-center px-2 text-sm font-medium text-slate-500">
                Page {page} of {Math.ceil(total / 20)}
              </div>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= Math.ceil(total / 20)}
                className="px-4 py-2 text-sm font-medium rounded-xl border border-slate-700 bg-slate-800 text-slate-400 disabled:opacity-50 hover:bg-slate-700 hover:text-slate-200 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
