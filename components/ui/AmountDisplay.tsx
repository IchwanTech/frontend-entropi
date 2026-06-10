import { clsx } from "clsx";
import { formatCurrency } from "@/lib/decimal";
import { SIZE_CLASS } from "@/lib/formatters";
import { AmountDisplayProps } from "@/types/general";

export const AmountDisplay = ({
  value,
  size = "md",
  className,
  showSign,
}: AmountDisplayProps) => {
  const formatted = formatCurrency(value);
  return (
    <span className={clsx(SIZE_CLASS[size], className)}>
      {showSign && parseFloat(value) > 0 ? "+" : ""}
      {formatted}
    </span>
  );
};
