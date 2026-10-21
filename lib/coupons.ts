import type {
  Coupon,
  CouponStatus,
  DiscountType,
  ValidationResult,
} from "./types";
import { formatCOP, formatDay } from "./format";

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // sin O/0/I/1

export const normalizeCode = (s: string): string =>
  s.toUpperCase().replace(/[^A-Z0-9-]/g, "");

export function generateCode(prefix = "SAT"): string {
  const buf = new Uint32Array(6);
  crypto.getRandomValues(buf);
  const body = Array.from(buf, (n) => ALPHABET[n % ALPHABET.length]).join("");
  return `${prefix}-${body}`;
}

const pad = (n: number) => String(n).padStart(2, "0");
export const todayISO = (d = new Date()): string =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export function statusOf(c: Coupon, today: string): CouponStatus {
  if (c.expiresAt && today > c.expiresAt) return "vencido";
  if (c.maxUses !== null && c.uses >= c.maxUses) return "agotado";
  if (c.paused) return "pausado";
  return "activo";
}

export const discountFor = (c: Coupon, amount: number): number =>
  c.type === "porcentaje"
    ? Math.round((amount * c.value) / 100)
    : Math.min(c.value, amount);

export const describeDiscount = (type: DiscountType, value: number): string =>
  type === "porcentaje"
    ? `${value}% de descuento`
    : `${formatCOP(value)} de descuento`;

export function validateCoupon(
  coupons: Coupon[],
  rawCode: string,
  amount: number,
  today: string,
): ValidationResult {
  const code = normalizeCode(rawCode);
  if (!code) return { ok: false, reason: "Escribe el código del cupón." };

  const coupon = coupons.find((c) => c.code === code);
  if (!coupon)
    return {
      ok: false,
      reason: `No existe el cupón ${code}. Revisa que el código esté bien escrito.`,
    };

  const status = statusOf(coupon, today);
  if (status === "vencido")
    return {
      ok: false,
      reason: `Este cupón venció el ${formatDay(coupon.expiresAt!)}.`,
    };
  if (status === "agotado")
    return { ok: false, reason: "Este cupón ya alcanzó su límite de usos." };
  if (status === "pausado")
    return {
      ok: false,
      reason: "Este cupón está pausado. Actívalo desde la lista para usarlo.",
    };

  if (amount <= 0)
    return {
      ok: false,
      reason: "Ingresa el valor de la compra para calcular el descuento.",
    };
  if (amount < coupon.minPurchase)
    return {
      ok: false,
      reason: `La compra mínima para este cupón es ${formatCOP(coupon.minPurchase)}.`,
    };

  const discount = discountFor(coupon, amount);
  return { ok: true, coupon, discount, total: amount - discount };
}

export interface NewCouponInput {
  code: string;
  type: DiscountType;
  value: string;
  minPurchase: string;
  expiresAt: string;
  maxUses: string;
}

export type CouponErrors = Partial<Record<keyof NewCouponInput, string>>;

const toInt = (s: string): number => Number(s.replace(/\D/g, "")) || 0;

export function validateNewCoupon(
  input: NewCouponInput,
  existing: Coupon[],
  today: string,
): { errors: CouponErrors; coupon?: Omit<Coupon, "id" | "createdAt"> } {
  const errors: CouponErrors = {};
  const code = normalizeCode(input.code);
  const value = toInt(input.value);
  const maxUses = toInt(input.maxUses);

  if (!code) errors.code = "Escribe un código o genera uno.";
  else if (code.length < 4) errors.code = "Usa al menos 4 caracteres.";
  else if (existing.some((c) => c.code === code))
    errors.code = "Ya existe un cupón con ese código.";

  if (value <= 0) errors.value = "Ingresa un valor mayor a 0.";
  else if (input.type === "porcentaje" && value > 100)
    errors.value = "El porcentaje no puede superar 100.";

  if (input.expiresAt && input.expiresAt < today)
    errors.expiresAt = "La fecha de vencimiento ya pasó.";

  if (input.maxUses && maxUses <= 0)
    errors.maxUses = "Ingresa un número mayor a 0 o deja el campo vacío.";

  if (Object.keys(errors).length) return { errors };

  return {
    errors,
    coupon: {
      code,
      type: input.type,
      value,
      minPurchase: toInt(input.minPurchase),
      expiresAt: input.expiresAt || null,
      maxUses: input.maxUses ? maxUses : null,
      uses: 0,
      paused: false,
    },
  };
}
