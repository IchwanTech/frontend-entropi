import type { OrderStatus } from "@/types/api.types";
import { AlertCircle, CheckCircle2, Clock, RefreshCcw } from "lucide-react";

export const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; className: string }
> = {
  PENDING: {
    label: "Pending",
    className: "bg-slate-100 text-slate-600 border-slate-200",
  },
  PAYMENT_PROCESSING: {
    label: "Processing",
    className: "bg-amber-50 text-amber-700 border-amber-200",
  },
  PAYMENT_CONFIRMED: {
    label: "Confirmed",
    className: "bg-blue-50 text-blue-700 border-blue-200",
  },
  FEE_CALCULATED: {
    label: "Fee Applied",
    className: "bg-violet-50 text-violet-700 border-violet-200",
  },
  SHIPPED: {
    label: "Shipped",
    className: "bg-cyan-50 text-cyan-700 border-cyan-200",
  },
  DELIVERED: {
    label: "Delivered",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  REFUNDED: {
    label: "Refunded",
    className: "bg-orange-50 text-orange-700 border-orange-200",
  },
  FAILED: {
    label: "Failed",
    className: "bg-red-50 text-red-700 border-red-200",
  },
};

export const SIZE_CLASS = {
  sm: "text-sm font-medium tabular-nums",
  md: "text-base font-semibold tabular-nums",
  lg: "text-2xl font-bold tabular-nums",
  xl: "text-4xl font-bold tabular-nums tracking-tight",
};

export const getStatusConfig = (status: string) => {
  switch (status) {
    case "PENDING":
      return {
        icon: Clock,
        color: "text-amber-400",
        bg: "bg-amber-400/10",
        label: "Pending Payment",
      };
    case "PAYMENT_PROCESSING":
      return {
        icon: RefreshCcw,
        color: "text-blue-400",
        bg: "bg-blue-400/10",
        label: "Processing",
        spin: true,
      };
    case "PAYMENT_CONFIRMED":
    case "FEE_CALCULATED":
      return {
        icon: CheckCircle2,
        color: "text-brand-400",
        bg: "bg-brand-400/10",
        label: "Payment Confirmed",
      };
    case "SHIPPED":
    case "DELIVERED":
      return {
        icon: CheckCircle2,
        color: "text-emerald-400",
        bg: "bg-emerald-400/10",
        label: "Delivered",
      };
    case "FAILED":
    case "REFUNDED":
      return {
        icon: AlertCircle,
        color: "text-red-400",
        bg: "bg-red-400/10",
        label: status === "FAILED" ? "Payment Failed" : "Refunded",
      };
    default:
      return {
        icon: Clock,
        color: "text-slate-400",
        bg: "bg-slate-400/10",
        label: status,
      };
  }
};

export const STATUS_FILTERS: { label: string; value: string }[] = [
  { label: "All", value: "" },
  { label: "Pending", value: "PENDING" },
  { label: "Processing", value: "PAYMENT_PROCESSING" },
  { label: "Confirmed", value: "PAYMENT_CONFIRMED" },
  { label: "Shipped", value: "SHIPPED" },
  { label: "Delivered", value: "DELIVERED" },
  { label: "Refunded", value: "REFUNDED" },
  { label: "Failed", value: "FAILED" },
];

export const formatDateTime = (dateInput: string | Date | number) => {
  const date = new Date(dateInput);
  return date.toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
