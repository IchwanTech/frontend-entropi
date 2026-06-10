"use client";

import { useOrderPolling } from "@/hooks/useOrderPolling";
import { useLedger } from "@/hooks/useLedger";
import { OrderStatusCard } from "@/components/orders/OrderStatusCard";
import { LedgerAuditTrail } from "@/components/ledger/LedgerAuditTrail";
import { apiClient } from "@/lib/api-client";
import { useState } from "react";
import { CreditCard, PackageCheck, AlertCircle, Loader2 } from "lucide-react";
import { clsx } from "clsx";

const OrderDetailPage = ({ params }: { params: { id: string } }) => {
  const {
    order,
    isLoading: orderLoading,
    error: orderError,
    refetch: refetchOrder,
  } = useOrderPolling(params.id);
  const {
    entries,
    isLoading: ledgerLoading,
    refetch: refetchLedger,
  } = useLedger(params.id);

  const [isProcessing, setIsProcessing] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const handlePay = async () => {
    setIsProcessing(true);
    setActionError(null);
    try {
      await apiClient.payOrder(params.id, "cus_123", crypto.randomUUID());
      refetchOrder();
      refetchLedger();
    } catch (err: unknown) {
      setActionError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleShip = async () => {
    setIsProcessing(true);
    setActionError(null);
    try {
      await apiClient.shipOrder(
        params.id,
        "TRK" + Date.now(),
        crypto.randomUUID(),
      );
      refetchOrder();
      refetchLedger();
    } catch (err: unknown) {
      setActionError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsProcessing(false);
    }
  };

  const isPending = order?.status === "PENDING";
  const isPaid =
    order?.status === "PAYMENT_CONFIRMED" || order?.status === "FEE_CALCULATED";

  if (orderError) {
    return (
      <div className="flex flex-col items-center justify-center h-64 glass-panel rounded-2xl border-rose-500/20">
        <AlertCircle className="w-10 h-10 text-rose-400 mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">
          Failed to load order
        </h3>
        <p className="text-slate-400">{orderError}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            Order Details
          </h1>
          <p className="text-slate-400 mt-1">
            Real-time financial status and immutable ledger
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={handlePay}
            disabled={!isPending || isProcessing}
            className={clsx(
              "flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all duration-300",
              isPending
                ? "bg-brand-600 hover:bg-brand-500 text-white shadow-lg shadow-brand-500/20 hover:shadow-brand-500/40 hover:-translate-y-0.5"
                : "bg-slate-800 text-slate-500 cursor-not-allowed",
            )}
          >
            {isProcessing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <CreditCard className="w-4 h-4" />
            )}
            {isProcessing ? "Processing..." : "Process Payment"}
          </button>

          <button
            onClick={handleShip}
            disabled={!isPaid || isProcessing}
            className={clsx(
              "flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all duration-300",
              isPaid
                ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:-translate-y-0.5"
                : "bg-slate-800 text-slate-500 cursor-not-allowed",
            )}
          >
            {isProcessing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <PackageCheck className="w-4 h-4" />
            )}
            {isProcessing ? "Processing..." : "Mark as Shipped"}
          </button>
        </div>
      </div>

      {actionError && (
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 px-4 py-3 rounded-xl flex items-center gap-3 animate-in slide-in-from-top-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm font-medium">{actionError}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div className="space-y-8">
          {order && <OrderStatusCard order={order} isLoading={orderLoading} />}

          <div className="glass-panel rounded-2xl p-6 border border-slate-800/50">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-500">Payment Method</span>
                <span className="text-white capitalize">
                  {order?.paymentMethod?.replace("_", " ") || "—"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="h-[600px]">
          <LedgerAuditTrail entries={entries} isLoading={ledgerLoading} />
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
