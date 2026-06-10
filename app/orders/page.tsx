"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";
import { OrderSummary } from "@/types/api.types";
import { formatCurrency } from "@/lib/decimal";
import Link from "next/link";
import { ShoppingCart, ArrowRight, Filter } from "lucide-react";
import { clsx } from "clsx";
import { OrderTableSkeleton } from "@/components/ui/Skeleton";

const OrdersPage = () => {
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<string>("");

  const fetchOrders = async (currentPage: number, currentFilter: string) => {
    try {
      setIsLoading(true);
      const data = await apiClient.getOrders(
        currentPage,
        20,
        currentFilter || undefined,
      );
      setOrders(data.orders);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(page, filter);
  }, [page, filter]);

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
            All Orders
          </h1>
          <p className="text-slate-400 mt-1">
            Manage and track all financial transactions
          </p>
        </div>

        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <select
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
              setPage(1);
            }}
            className="bg-slate-900/50 border border-slate-800 rounded-xl py-2 pl-9 pr-10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50 appearance-none cursor-pointer [&>option]:bg-slate-900"
          >
            <option value="">All Statuses</option>
            <option value="PENDING">Pending Payment</option>
            <option value="PAYMENT_CONFIRMED">Payment Confirmed</option>
            <option value="FEE_CALCULATED">Fee Calculated</option>
            <option value="SHIPPED">Shipped</option>
            <option value="DELIVERED">Delivered</option>
          </select>
        </div>
      </div>

      <div className="glass-panel rounded-2xl overflow-hidden border border-slate-800/50">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800/50 text-xs uppercase tracking-wider text-slate-500 bg-slate-900/40">
                <th className="px-6 py-4 font-semibold">Customer</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Amount</th>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 text-right font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {isLoading ? (
                <OrderTableSkeleton rows={8} />
              ) : orders.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-slate-500"
                  >
                    No orders found matching the criteria.
                  </td>
                </tr>
              ) : (
                orders.map((order, index) => (
                  <tr
                    key={order.id}
                    className="hover:bg-slate-800/20 transition-colors group"
                  >
                    <td className="px-6 py-4 text-sm text-slate-300">
                      {order.customerId}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={clsx(
                          "text-xs font-bold px-2 py-1 rounded-full tracking-wide inline-block",
                          order.status === "PENDING"
                            ? "bg-amber-400/10 text-amber-400"
                            : order.status.includes("PAYMENT") ||
                                order.status.includes("FEE")
                              ? "bg-brand-400/10 text-brand-400"
                              : order.status.includes("DELIVERED") ||
                                  order.status.includes("SHIPPED")
                                ? "bg-emerald-400/10 text-emerald-400"
                                : "bg-rose-400/10 text-rose-400",
                        )}
                      >
                        {order.status.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold tabular-nums text-white">
                      {formatCurrency(order.amount)}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-400 font-mono">
                      {new Date(order.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/orders/${order.id}`}
                        className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium bg-slate-800 hover:bg-brand-600 text-white transition-colors gap-2"
                      >
                        Details <ArrowRight className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="p-4 border-t border-slate-800/50 flex justify-center gap-2 bg-slate-900/20">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 disabled:opacity-50 text-sm font-medium hover:bg-slate-700 transition-colors"
          >
            Previous
          </button>
          <div className="px-4 py-2 flex items-center justify-center text-sm text-slate-400 font-medium">
            Page {page}
          </div>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={orders.length < 20}
            className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 disabled:opacity-50 text-sm font-medium hover:bg-slate-700 transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
