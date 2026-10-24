import type { Coupon } from "@/lib/types";
import CouponFilters, { type CouponFilter } from "./CouponFilters";
import CouponItem from "./CouponItem";

interface CouponListProps {
  coupons: Coupon[];
  today: string;
  filter: CouponFilter;
  notice: string;
  deleting: string | null;
  onFilterChange: (filter: CouponFilter) => void;
  onCopy: (coupon: Coupon) => void;
  onTogglePause: (coupon: Coupon) => void;
  onRequestDelete: (id: string) => void;
  onCancelDelete: () => void;
  onRemove: (coupon: Coupon) => void;
}

export default function CouponList({
  coupons,
  today,
  filter,
  notice,
  deleting,
  onFilterChange,
  onCopy,
  onTogglePause,
  onRequestDelete,
  onCancelDelete,
  onRemove,
}: CouponListProps) {
  return (
    <section aria-labelledby="lista-title" className="min-w-0">
      <div className="rounded-lg border border-line bg-panel">
        <div className="flex flex-col gap-3 border-b border-line p-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <h2 id="lista-title" className="font-medium">
            Cupones ({coupons.length})
          </h2>

          <CouponFilters filter={filter} onChange={onFilterChange} />
        </div>

        <p
          role="status"
          aria-live="polite"
          className="min-h-5 px-4 pt-3 text-sm text-success sm:px-6"
        >
          {notice}
        </p>

        {coupons.length === 0 ? (
          <p className="p-6 text-ink-soft">
            No hay cupones para mostrar con este filtro.
          </p>
        ) : (
          <ul className="divide-y divide-line">
            {coupons.map((coupon) => (
              <CouponItem
                key={coupon.id}
                coupon={coupon}
                today={today}
                deleting={deleting === coupon.id}
                onCopy={onCopy}
                onTogglePause={onTogglePause}
                onRequestDelete={onRequestDelete}
                onCancelDelete={onCancelDelete}
                onRemove={onRemove}
              />
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
