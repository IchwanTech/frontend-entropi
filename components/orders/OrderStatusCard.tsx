import { OrderSummary } from "@/types/api.types";
import { formatCurrency } from "@/lib/decimal";
import { clsx } from "clsx";
import { getStatusConfig } from "@/lib/formatters";

export const OrderStatusCard = ({
  order,
  isLoading,
}: {
  order: OrderSummary;
  isLoading: boolean;
}) => {
  if (isLoading || !order) {
    return (
      <div className="glass-panel rounded-2xl p-6 space-y-6 animate-pulse">
        <div className="h-6 w-32 bg-slate-800 rounded"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-slate-800/50 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  const amount = order.amount;
  const fee = order.fee;
  const payout = order.payout;

  const statusConfig = getStatusConfig(order.status);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="glass-panel rounded-2xl p-6 md:p-8 relative overflow-hidden group hover-lift">
      <div
        className={clsx(
          "absolute -top-24 -right-24 w-64 h-64 rounded-full filter blur-3xl opacity-20 pointer-events-none transition-colors duration-1000",
          statusConfig.color.replace("text-", "bg-"),
        )}
      />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 relative z-10">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white mb-1">
            Order Overview
          </h2>
        </div>

        <div
          className={clsx(
            "flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-500",
            statusConfig.bg,
            statusConfig.color
              .replace("text-", "border-")
              .replace("400", "400/20"),
          )}
        >
          <StatusIcon
            className={clsx(
              "w-4 h-4",
              statusConfig.color,
              statusConfig.spin && "animate-spin",
            )}
          />
          <span
            className={clsx(
              "text-sm font-semibold tracking-wide",
              statusConfig.color,
            )}
          >
            {statusConfig.label}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 relative z-10">
        <MetricCard
          title="Gross Amount"
          value={formatCurrency(amount)}
          color="text-white"
        />
        <MetricCard
          title="Fee (3%)"
          value={formatCurrency(fee)}
          color="text-red-400"
          prefix="-"
          delay="delay-75"
        />
        <MetricCard
          title="Net Payout"
          value={formatCurrency(payout)}
          color="text-emerald-400"
          delay="delay-150"
        />
      </div>
    </div>
  );
};

const MetricCard = ({
  title,
  value,
  color,
  prefix = "",
  delay = "",
}: {
  title: string;
  value: string;
  color: string;
  prefix?: string;
  delay?: string;
}) => (
  <div
    className={clsx(
      "bg-slate-900/50 rounded-xl p-5 border border-slate-800/50 hover:border-slate-700/50 transition-all duration-300",
      "animate-in fade-in slide-in-from-bottom-4 fill-mode-both",
      delay,
    )}
  >
    <div className="flex items-center gap-3 mb-3 text-slate-400">
      <span className="text-sm font-medium">{title}</span>
    </div>
    <div
      className={clsx("text-lg font-bold tracking-tight tabular-nums", color)}
    >
      {prefix}
      {value}
    </div>
  </div>
);
