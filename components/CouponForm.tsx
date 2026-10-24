import type { FormEvent } from "react";
import type { DiscountType } from "@/lib/types";
import type { CouponErrors, NewCouponInput } from "@/lib/coupons";
import { generateCode, normalizeCode } from "@/lib/coupons";
import Field from "./Field";

interface CouponFormProps {
  form: NewCouponInput;
  errors: CouponErrors;
  today: string;
  onFieldChange: <K extends keyof NewCouponInput>(
    key: K,
    value: NewCouponInput[K],
  ) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

const INPUT_CLASS =
  "w-full rounded-md border border-line bg-panel-2 px-3 py-2.5 text-sm text-ink placeholder:text-muted";

export default function CouponForm({
  form,
  errors,
  today,
  onFieldChange,
  onSubmit,
}: CouponFormProps) {
  const discountTypes: [DiscountType, string][] = [
    ["porcentaje", "Porcentaje"],
    ["fijo", "Valor fijo"],
  ];

  return (
    <section
      aria-labelledby="crear-title"
      className="rounded-lg border border-line bg-panel p-5"
    >
      <h2 id="crear-title" className="font-medium">
        Crear cupón
      </h2>

      <form onSubmit={onSubmit} noValidate className="mt-4 space-y-4">
        <Field id="c-code" label="Código" error={errors.code}>
          <div className="flex gap-2">
            <input
              id="c-code"
              value={form.code}
              onChange={(event) =>
                onFieldChange("code", normalizeCode(event.target.value))
              }
              placeholder="Ej. NAVIDAD25"
              autoComplete="off"
              aria-invalid={!!errors.code}
              className={INPUT_CLASS}
            />

            <button
              type="button"
              onClick={() => onFieldChange("code", generateCode())}
              className="shrink-0 rounded-md border border-line px-3 text-sm text-ink-soft transition-colors hover:border-muted"
            >
              Generar
            </button>
          </div>
        </Field>

        <div>
          <span className="mb-1 block text-sm text-muted">
            Tipo de descuento
          </span>

          <div
            role="group"
            aria-label="Tipo de descuento"
            className="grid grid-cols-2 gap-2"
          >
            {discountTypes.map(([type, label]) => (
              <button
                key={type}
                type="button"
                aria-pressed={form.type === type}
                onClick={() => onFieldChange("type", type)}
                className={`rounded-md border px-3 py-2 text-sm transition-colors ${
                  form.type === type
                    ? "border-primary bg-primary text-ink"
                    : "border-line text-ink-soft hover:border-muted"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <Field
          id="c-value"
          label={
            form.type === "porcentaje"
              ? "Porcentaje (1 a 100)"
              : "Valor del descuento (COP)"
          }
          error={errors.value}
        >
          <input
            id="c-value"
            inputMode="numeric"
            value={form.value}
            onChange={(event) =>
              onFieldChange("value", event.target.value.replace(/\D/g, ""))
            }
            placeholder={form.type === "porcentaje" ? "Ej. 15" : "Ej. 50000"}
            aria-invalid={!!errors.value}
            className={INPUT_CLASS}
          />
        </Field>

        <Field id="c-min" label="Compra mínima en COP (opcional)">
          <input
            id="c-min"
            inputMode="numeric"
            value={form.minPurchase}
            onChange={(event) =>
              onFieldChange(
                "minPurchase",
                event.target.value.replace(/\D/g, ""),
              )
            }
            placeholder="Sin mínimo"
            className={INPUT_CLASS}
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          <Field
            id="c-exp"
            label="Vence (opcional)"
            error={errors.expiresAt}
          >
            <input
              id="c-exp"
              type="date"
              min={today}
              value={form.expiresAt}
              onChange={(event) =>
                onFieldChange("expiresAt", event.target.value)
              }
              aria-invalid={!!errors.expiresAt}
              className={INPUT_CLASS}
            />
          </Field>

          <Field
            id="c-max"
            label="Usos máximos (opcional)"
            error={errors.maxUses}
          >
            <input
              id="c-max"
              inputMode="numeric"
              value={form.maxUses}
              onChange={(event) =>
                onFieldChange("maxUses", event.target.value.replace(/\D/g, ""))
              }
              placeholder="Ilimitados"
              aria-invalid={!!errors.maxUses}
              className={INPUT_CLASS}
            />
          </Field>
        </div>

        <button
          type="submit"
          className="w-full rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-primary-hover"
        >
          Crear cupón
        </button>
      </form>
    </section>
  );
}
