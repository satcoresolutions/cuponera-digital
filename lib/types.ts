export type DiscountType = "porcentaje" | "fijo";

export type CouponStatus = "activo" | "pausado" | "vencido" | "agotado";

export interface Coupon {
  id: string;
  code: string;
  type: DiscountType;
  value: number; // % (1–100) o COP según el tipo
  minPurchase: number; // COP, 0 = sin mínimo
  expiresAt: string | null; // "YYYY-MM-DD", vigente hasta el final de ese día
  maxUses: number | null; // null = ilimitado
  uses: number;
  paused: boolean;
  createdAt: string; // ISO 8601
}

export type ValidationResult =
  | { ok: true; coupon: Coupon; discount: number; total: number }
  | { ok: false; reason: string };
