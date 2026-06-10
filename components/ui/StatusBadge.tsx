import { STATUS_CONFIG } from "@/lib/formatters";
import type { OrderStatus } from "@/types/api.types";
import { clsx } from "clsx";

export function StatusBadge({
  status,
  pulse,
}: {
  status: OrderStatus;
  pulse?: boolean;
}) {
  const config = STATUS_CONFIG[status];
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border",
        config.className,
      )}
    >
      {pulse && status === "PAYMENT_PROCESSING" && (
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-500" />
        </span>
      )}
      {config.label}
    </span>
  );
}
