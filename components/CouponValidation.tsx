import type { FormEvent } from "react";
import type { Coupon, ValidationResult } from "@/lib/types";
import { describeDiscount, normalizeCode } from "@/lib/coupons";
import { formatCOP } from "@/lib/format";

interface CouponValidationProps {
  code: string;
  amount: string;
  amountNumber: number;
  result: ValidationResult | null;
  onCodeChange: (value: string) => void;
  onAmountChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onApply: () => void;
}

export default function CouponValidation({
  code,
  amount,
  amountNumber,
  result,
  onCodeChange,
  onAmountChange,
  onSubmit,
  onApply,
}: CouponValidationProps) {
  return (
    <section
      aria-labelledby="validar-title"
      className="rounded-lg border border-line bg-panel p-5"
    >
      <h2 id="validar-title" className="font-medium">
        Validar cupón
      </h2>

      <form onSubmit={onSubmit} className="mt-4 space-y-3">
        <div>
          <label
            htmlFor="v-code"
            className="mb-1 block text-sm text-muted"
          >
            Código
          </label>

          <input
            id="v-code"
            value={code}
            onChange={(event) =>
              onCodeChange(normalizeCode(event.target.value))
            }
            placeholder="Ej. SAT50K"
            autoComplete="off"
            className="w-full rounded-md border border-line bg-panel-2 px-3 py-2.5 text-sm text-ink placeholder:text-muted"
          />
        </div>

        <div>
          <label
            htmlFor="v-amount"
            className="mb-1 block text-sm text-muted"
          >
            Valor de la compra
          </label>

          <input
            id="v-amount"
            inputMode="numeric"
            value={amount}
            onChange={(event) =>
              onAmountChange(event.target.value.replace(/[^\d]/g, ""))
            }
            placeholder="Ej. 450000"
            className="w-full rounded-md border border-line bg-panel-2 px-3 py-2.5 text-sm text-ink placeholder:text-muted"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-primary-hover"
        >
          Validar cupón
        </button>
      </form>

      <div role="status" aria-live="polite" className="mt-4">
        {result && !result.ok && (
          <p className="rounded-md bg-coral-soft px-3 py-3 text-sm text-coral">
            {result.reason}
          </p>
        )}

        {result?.ok && (
          <div className="rounded-md border border-line bg-panel-2 p-4">
            <p className="text-sm text-success">
              Cupón válido:{" "}
              {describeDiscount(result.coupon.type, result.coupon.value)}
            </p>

            <dl className="mt-3 space-y-1 text-sm">
              <div className="flex justify-between text-ink-soft">
                <dt>Compra</dt>
                <dd>{formatCOP(amountNumber)}</dd>
              </div>

              <div className="flex justify-between text-ink-soft">
                <dt>Descuento</dt>
                <dd>−{formatCOP(result.discount)}</dd>
              </div>
            </dl>

            <p className="mt-3 text-sm text-muted">Total a pagar</p>

            <p className="text-3xl font-semibold tracking-tight text-accent">
              {formatCOP(result.total)}
            </p>

            <button
              type="button"
              onClick={onApply}
              className="mt-4 w-full rounded-md border border-line px-4 py-2.5 text-sm font-medium transition-colors hover:border-accent hover:text-accent"
            >
              Aplicar cupón
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
