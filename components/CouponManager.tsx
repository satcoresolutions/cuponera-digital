"use client";

import { useMemo, useState } from "react";
import type {
  Coupon,
  CouponStatus,
  DiscountType,
  ValidationResult,
} from "@/lib/types";
import {
  type CouponErrors,
  type NewCouponInput,
  describeDiscount,
  generateCode,
  normalizeCode,
  statusOf,
  todayISO,
  validateCoupon,
  validateNewCoupon,
} from "@/lib/coupons";
import { formatCOP, formatDay } from "@/lib/format";

type Filter = CouponStatus | "todos";

const STATUS: Record<CouponStatus, { label: string; className: string }> = {
  activo: { label: "Activo", className: "bg-success-soft text-success" },
  pausado: { label: "Pausado", className: "bg-warning-soft text-warning" },
  vencido: { label: "Vencido", className: "bg-panel-2 text-ink-soft" },
  agotado: { label: "Agotado", className: "bg-coral-soft text-coral" },
};

const FILTERS: { value: Filter; label: string }[] = [
  { value: "todos", label: "Todos" },
  { value: "activo", label: "Activos" },
  { value: "pausado", label: "Pausados" },
  { value: "vencido", label: "Vencidos" },
  { value: "agotado", label: "Agotados" },
];

const EMPTY_FORM: NewCouponInput = {
  code: "",
  type: "porcentaje",
  value: "",
  minPurchase: "",
  expiresAt: "",
  maxUses: "",
};

const inputCls =
  "w-full rounded-md border border-line bg-panel-2 px-3 py-2.5 text-sm text-ink placeholder:text-muted";

export default function CouponManager({
  initialCoupons,
}: {
  initialCoupons: Coupon[];
}) {
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons);
  const [filter, setFilter] = useState<Filter>("todos");
  const [notice, setNotice] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);

  // Validar
  const [vCode, setVCode] = useState("");
  const [vAmount, setVAmount] = useState("");
  const [result, setResult] = useState<ValidationResult | null>(null);

  // Crear
  const [form, setForm] = useState<NewCouponInput>(EMPTY_FORM);
  const [errors, setErrors] = useState<CouponErrors>({});

  const today = todayISO();
  const vAmountNum = Number(vAmount.replace(/\D/g, "")) || 0;

  const list = useMemo(
    () =>
      [...coupons]
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
        .filter((c) => filter === "todos" || statusOf(c, today) === filter),
    [coupons, filter, today],
  );

  const setField = <K extends keyof NewCouponInput>(
    key: K,
    value: NewCouponInput[K],
  ) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const submitValidate = (e: React.FormEvent) => {
    e.preventDefault();
    setNotice("");
    setResult(validateCoupon(coupons, vCode, vAmountNum, today));
  };

  const applyCoupon = () => {
    if (!result?.ok) return;
    // Revalida justo antes de aplicar, por si el estado cambió.
    const fresh = validateCoupon(coupons, result.coupon.code, vAmountNum, today);
    if (!fresh.ok) {
      setResult(fresh);
      return;
    }
    setCoupons((prev) =>
      prev.map((c) => (c.id === fresh.coupon.id ? { ...c, uses: c.uses + 1 } : c)),
    );
    setNotice(
      `Cupón ${fresh.coupon.code} aplicado: descuento de ${formatCOP(fresh.discount)}.`,
    );
    setResult(null);
    setVCode("");
    setVAmount("");
  };

  const submitCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const { errors: errs, coupon } = validateNewCoupon(form, coupons, today);
    setErrors(errs);
    if (!coupon) return;
    setCoupons((prev) => [
      ...prev,
      { ...coupon, id: crypto.randomUUID(), createdAt: new Date().toISOString() },
    ]);
    setNotice(`Cupón ${coupon.code} creado.`);
    setForm(EMPTY_FORM);
  };

  const togglePause = (c: Coupon) =>
    setCoupons((prev) =>
      prev.map((x) => (x.id === c.id ? { ...x, paused: !x.paused } : x)),
    );

  const remove = (c: Coupon) => {
    setCoupons((prev) => prev.filter((x) => x.id !== c.id));
    setNotice(`Cupón ${c.code} eliminado.`);
    setDeleting(null);
  };

  const copy = async (c: Coupon) => {
    try {
      await navigator.clipboard.writeText(c.code);
      setNotice(`Código ${c.code} copiado.`);
    } catch {
      setNotice(`No se pudo copiar. Selecciona el código ${c.code} manualmente.`);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
      <div className="min-w-0 space-y-6">
        {/* Validar */}
        <section
          aria-labelledby="validar-title"
          className="rounded-lg border border-line bg-panel p-5"
        >
          <h2 id="validar-title" className="font-medium">
            Validar cupón
          </h2>
          <form onSubmit={submitValidate} className="mt-4 space-y-3">
            <div>
              <label htmlFor="v-code" className="mb-1 block text-sm text-muted">
                Código
              </label>
              <input
                id="v-code"
                value={vCode}
                onChange={(e) => {
                  setVCode(normalizeCode(e.target.value));
                  setResult(null);
                }}
                placeholder="Ej. SAT50K"
                autoComplete="off"
                className={inputCls}
              />
            </div>
            <div>
              <label htmlFor="v-amount" className="mb-1 block text-sm text-muted">
                Valor de la compra
              </label>
              <input
                id="v-amount"
                inputMode="numeric"
                value={vAmount}
                onChange={(e) => {
                  setVAmount(e.target.value.replace(/[^\d]/g, ""));
                  setResult(null);
                }}
                placeholder="Ej. 450000"
                className={inputCls}
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
                  Cupón válido: {describeDiscount(result.coupon.type, result.coupon.value)}
                </p>
                <dl className="mt-3 space-y-1 text-sm">
                  <div className="flex justify-between text-ink-soft">
                    <dt>Compra</dt>
                    <dd>{formatCOP(vAmountNum)}</dd>
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
                  onClick={applyCoupon}
                  className="mt-4 w-full rounded-md border border-line px-4 py-2.5 text-sm font-medium transition-colors hover:border-accent hover:text-accent"
                >
                  Aplicar cupón
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Crear */}
        <section
          aria-labelledby="crear-title"
          className="rounded-lg border border-line bg-panel p-5"
        >
          <h2 id="crear-title" className="font-medium">
            Crear cupón
          </h2>
          <form onSubmit={submitCreate} noValidate className="mt-4 space-y-4">
            <Field id="c-code" label="Código" error={errors.code}>
              <div className="flex gap-2">
                <input
                  id="c-code"
                  value={form.code}
                  onChange={(e) => setField("code", normalizeCode(e.target.value))}
                  placeholder="Ej. NAVIDAD25"
                  autoComplete="off"
                  aria-invalid={!!errors.code}
                  className={inputCls}
                />
                <button
                  type="button"
                  onClick={() => setField("code", generateCode())}
                  className="shrink-0 rounded-md border border-line px-3 text-sm text-ink-soft transition-colors hover:border-muted"
                >
                  Generar
                </button>
              </div>
            </Field>

            <div>
              <span className="mb-1 block text-sm text-muted">Tipo de descuento</span>
              <div role="group" aria-label="Tipo de descuento" className="grid grid-cols-2 gap-2">
                {(
                  [
                    ["porcentaje", "Porcentaje"],
                    ["fijo", "Valor fijo"],
                  ] as [DiscountType, string][]
                ).map(([t, label]) => (
                  <button
                    key={t}
                    type="button"
                    aria-pressed={form.type === t}
                    onClick={() => setField("type", t)}
                    className={`rounded-md border px-3 py-2 text-sm transition-colors ${
                      form.type === t
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
              label={form.type === "porcentaje" ? "Porcentaje (1 a 100)" : "Valor del descuento (COP)"}
              error={errors.value}
            >
              <input
                id="c-value"
                inputMode="numeric"
                value={form.value}
                onChange={(e) => setField("value", e.target.value.replace(/\D/g, ""))}
                placeholder={form.type === "porcentaje" ? "Ej. 15" : "Ej. 50000"}
                aria-invalid={!!errors.value}
                className={inputCls}
              />
            </Field>

            <Field id="c-min" label="Compra mínima en COP (opcional)">
              <input
                id="c-min"
                inputMode="numeric"
                value={form.minPurchase}
                onChange={(e) => setField("minPurchase", e.target.value.replace(/\D/g, ""))}
                placeholder="Sin mínimo"
                className={inputCls}
              />
            </Field>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              <Field id="c-exp" label="Vence (opcional)" error={errors.expiresAt}>
                <input
                  id="c-exp"
                  type="date"
                  min={today}
                  value={form.expiresAt}
                  onChange={(e) => setField("expiresAt", e.target.value)}
                  aria-invalid={!!errors.expiresAt}
                  className={inputCls}
                />
              </Field>
              <Field id="c-max" label="Usos máximos (opcional)" error={errors.maxUses}>
                <input
                  id="c-max"
                  inputMode="numeric"
                  value={form.maxUses}
                  onChange={(e) => setField("maxUses", e.target.value.replace(/\D/g, ""))}
                  placeholder="Ilimitados"
                  aria-invalid={!!errors.maxUses}
                  className={inputCls}
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
      </div>

      {/* Lista */}
      <section aria-labelledby="lista-title" className="min-w-0">
        <div className="rounded-lg border border-line bg-panel">
          <div className="flex flex-col gap-3 border-b border-line p-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <h2 id="lista-title" className="font-medium">
              Cupones ({coupons.length})
            </h2>
            <div role="group" aria-label="Filtrar por estado" className="flex flex-wrap gap-2">
              {FILTERS.map((f) => (
                <button
                  key={f.value}
                  type="button"
                  aria-pressed={filter === f.value}
                  onClick={() => setFilter(f.value)}
                  className={`rounded-full border px-3 py-1 text-sm transition-colors ${
                    filter === f.value
                      ? "border-primary bg-primary text-ink"
                      : "border-line text-ink-soft hover:border-muted"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <p role="status" aria-live="polite" className="min-h-5 px-4 pt-3 text-sm text-success sm:px-6">
            {notice}
          </p>

          {list.length === 0 ? (
            <p className="p-6 text-ink-soft">
              {coupons.length === 0
                ? "Aún no hay cupones. Crea el primero desde el formulario."
                : "No hay cupones con ese estado. Prueba con otro filtro."}
            </p>
          ) : (
            <ul className="divide-y divide-line">
              {list.map((c) => {
                const st = statusOf(c, today);
                const s = STATUS[st];
                const usePct =
                  c.maxUses !== null
                    ? Math.min(100, Math.round((c.uses / c.maxUses) * 100))
                    : null;
                return (
                  <li key={c.id} className="px-4 py-4 sm:px-6">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                      <span className="font-medium tracking-wide">{c.code}</span>
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${s.className}`}>
                        {s.label}
                      </span>
                      <span className="ml-auto text-sm font-medium">
                        {describeDiscount(c.type, c.value)}
                      </span>
                    </div>

                    <p className="mt-1 text-sm text-ink-soft">
                      {c.minPurchase > 0
                        ? `Compra mínima ${formatCOP(c.minPurchase)}`
                        : "Sin compra mínima"}
                      {" · "}
                      {c.expiresAt ? `Vence el ${formatDay(c.expiresAt)}` : "Sin vencimiento"}
                    </p>

                    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-3">
                      <div className="min-w-40 flex-1">
                        <p className="text-xs text-muted">
                          {c.uses} {c.maxUses !== null ? `de ${c.maxUses} usos` : "usos"}
                        </p>
                        {usePct !== null && (
                          <div
                            role="progressbar"
                            aria-valuemin={0}
                            aria-valuemax={100}
                            aria-valuenow={usePct}
                            aria-label={`Usos de ${c.code}`}
                            className="mt-1 h-1.5 overflow-hidden rounded-full bg-line"
                          >
                            <div
                              className="h-full rounded-full bg-primary-hover"
                              style={{ width: `${usePct}%` }}
                            />
                          </div>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => copy(c)}
                          className="rounded-md border border-line px-3 py-1.5 text-sm text-ink-soft transition-colors hover:border-muted"
                        >
                          Copiar
                        </button>
                        <button
                          type="button"
                          onClick={() => togglePause(c)}
                          className="rounded-md border border-line px-3 py-1.5 text-sm text-ink-soft transition-colors hover:border-muted"
                        >
                          {c.paused ? "Activar" : "Pausar"}
                        </button>
                        {deleting === c.id ? (
                          <>
                            <button
                              type="button"
                              onClick={() => remove(c)}
                              className="rounded-md bg-coral-soft px-3 py-1.5 text-sm font-medium text-coral"
                            >
                              Confirmar eliminación
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleting(null)}
                              className="rounded-md border border-line px-3 py-1.5 text-sm text-ink-soft hover:border-muted"
                            >
                              Cancelar
                            </button>
                          </>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setDeleting(c.id)}
                            className="rounded-md border border-line px-3 py-1.5 text-sm text-ink-soft transition-colors hover:border-coral hover:text-coral"
                          >
                            Eliminar
                          </button>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm text-muted">
        {label}
      </label>
      {children}
      {error && (
        <p role="alert" className="mt-1 text-sm text-coral">
          {error}
        </p>
      )}
    </div>
  );
}
