import { clsx } from "clsx";

export const Skeleton = ({ className }: { className: string }) => {
  return (
    <div className={clsx("animate-pulse rounded bg-slate-800", className)} />
  );
};

export const OrderCardSkeleton = () => {
  return (
    <div className="glass-panel rounded-2xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-6 w-24 rounded-full" />
      </div>
      <Skeleton className="h-10 w-48" />
      <div className="grid grid-cols-2 gap-4">
        <Skeleton className="h-16 rounded-xl" />
        <Skeleton className="h-16 rounded-xl" />
      </div>
      <Skeleton className="h-1 w-full" />
      <div className="flex gap-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-32" />
      </div>
    </div>
  );
};

export const LedgerSkeleton = () => {
  return (
    <div className="glass-panel rounded-2xl p-4 space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 px-3 py-3 rounded-xl border border-slate-800"
        >
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-20 ml-auto" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-20" />
        </div>
      ))}
    </div>
  );
};

export const OrderTableSkeleton = ({ rows = 8 }: { rows?: number }) => {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <tr key={i}>
          <td className="px-6 py-4">
            <div className="h-4 w-36 animate-pulse rounded bg-slate-800" />
          </td>
          <td className="px-6 py-4">
            <div className="h-4 w-24 animate-pulse rounded bg-slate-800" />
          </td>
          <td className="px-6 py-4">
            <div className="h-5 w-28 animate-pulse rounded-full bg-slate-800" />
          </td>
          <td className="px-6 py-4">
            <div className="h-4 w-20 animate-pulse rounded bg-slate-800" />
          </td>
          <td className="px-6 py-4">
            <div className="h-4 w-32 animate-pulse rounded bg-slate-800" />
          </td>
          <td className="px-6 py-4 text-right">
            <div className="h-8 w-20 animate-pulse rounded-lg bg-slate-800 ml-auto" />
          </td>
        </tr>
      ))}
    </>
  );
};
