import type { Coupon, CouponStatus } from "@/lib/types";
import { describeDiscount, statusOf } from "@/lib/coupons";
import { formatCOP, formatDay } from "@/lib/format";

interface CouponItemProps {
  coupon: Coupon;
  today: string;
  deleting: boolean;
  onCopy: (coupon: Coupon) => void;
  onTogglePause: (coupon: Coupon) => void;
  onRequestDelete: (id: string) => void;
  onCancelDelete: () => void;
  onRemove: (coupon: Coupon) => void;
}

const STATUS: Record<CouponStatus, { label: string; className: string }> = {
  activo: { label: "Activo", className: "bg-success-soft text-success" },
  pausado: { label: "Pausado", className: "bg-warning-soft text-warning" },
  vencido: { label: "Vencido", className: "bg-panel-2 text-ink-soft" },
  agotado: { label: "Agotado", className: "bg-coral-soft text-coral" },
};

const actionClass =
  "rounded-md border border-line px-3 py-1.5 text-sm text-ink-soft transition-colors hover:border-muted";

export default function CouponItem({
  coupon,
  today,
  deleting,
  onCopy,
  onTogglePause,
  onRequestDelete,
  onCancelDelete,
  onRemove,
}: CouponItemProps) {
  const status = STATUS[statusOf(coupon, today)];

  const usePercentage =
    coupon.maxUses !== null
      ? Math.min(100, Math.round((coupon.uses / coupon.maxUses) * 100))
      : null;

  return (
    <li className="px-4 py-4 sm:px-6">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <span className="font-medium tracking-wide">{coupon.code}</span>

        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${status.className}`}
        >
          {status.label}
        </span>

        <span className="ml-auto text-sm font-medium">
          {describeDiscount(coupon.type, coupon.value)}
        </span>
      </div>

      <p className="mt-1 text-sm text-ink-soft">
        {coupon.minPurchase > 0
          ? `Compra mínima ${formatCOP(coupon.minPurchase)}`
          : "Sin compra mínima"}
        {" · "}
        {coupon.expiresAt
          ? `Vence el ${formatDay(coupon.expiresAt)}`
          : "Sin vencimiento"}
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-3">
        <div className="min-w-40 flex-1">
          <p className="text-xs text-muted">
            {coupon.uses}{" "}
            {coupon.maxUses !== null
              ? `de ${coupon.maxUses} usos`
              : "usos"}
          </p>

          {usePercentage !== null && (
            <div
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={usePercentage}
              aria-label={`Usos de ${coupon.code}`}
              className="mt-1 h-1.5 overflow-hidden rounded-full bg-line"
            >
              <div
                className="h-full rounded-full bg-primary-hover"
                style={{ width: `${usePercentage}%` }}
              />
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onCopy(coupon)}
            className={actionClass}
          >
            Copiar
          </button>

          <button
            type="button"
            onClick={() => onTogglePause(coupon)}
            className={actionClass}
          >
            {coupon.paused ? "Activar" : "Pausar"}
          </button>

          {deleting ? (
            <>
              <button
                type="button"
                onClick={() => onRemove(coupon)}
                className="rounded-md bg-coral-soft px-3 py-1.5 text-sm font-medium text-coral"
              >
                Confirmar eliminación
              </button>

              <button
                type="button"
                onClick={onCancelDelete}
                className={actionClass}
              >
                Cancelar
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => onRequestDelete(coupon.id)}
              className="rounded-md border border-line px-3 py-1.5 text-sm text-ink-soft transition-colors hover:border-coral hover:text-coral"
            >
              Eliminar
            </button>
          )}
        </div>
      </div>
    </li>
  );
}
