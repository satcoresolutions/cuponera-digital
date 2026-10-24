import type { CouponStatus, DiscountType } from "./types";

/** Tipos de descuento disponibles */
export const DISCOUNT_TYPE_META: Record<
  DiscountType,
  { label: string; description: string }
> = {
  porcentaje: {
    label: "Porcentaje",
    description: "Descuento porcentual sobre la compra",
  },
  fijo: {
    label: "Valor fijo",
    description: "Descuento de un valor fijo en pesos colombianos",
  },
};

/** Opciones para seleccionar el tipo de descuento */
export const DISCOUNT_TYPES = (
  Object.keys(DISCOUNT_TYPE_META) as DiscountType[]
).map((id) => ({
  id,
  ...DISCOUNT_TYPE_META[id],
}));

/** Metadatos de los estados de los cupones */
export const COUPON_STATUS_META: Record<
  CouponStatus,
  { label: string }
> = {
  activo: { label: "Activo" },
  pausado: { label: "Pausado" },
  vencido: { label: "Vencido" },
  agotado: { label: "Agotado" },
};

/** Estados disponibles para filtrar cupones */
export const COUPON_STATUSES = (
  Object.keys(COUPON_STATUS_META) as CouponStatus[]
).map((id) => ({
  id,
  ...COUPON_STATUS_META[id],
}));

/** Clave de almacenamiento del tema */
export const THEME_KEY = "satcore-cuponera-theme";

/** Clave de almacenamiento de cupones, si la app utiliza persistencia local */
export const STORAGE_KEYS = {
  coupons: "satcore:cuponera:cupones",
  settings: "satcore:cuponera:ajustes",
} as const;

/** Clases reutilizables de la interfaz */
export { ui } from "./ui";