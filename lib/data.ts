import type { Coupon } from "./types";

// Datos de ejemplo. Reemplaza por tu API o base de datos.
export const coupons: Coupon[] = [
  {
    id: "k1", code: "BIENVENIDA10", type: "porcentaje", value: 10,
    minPurchase: 0, expiresAt: "2026-12-31", maxUses: null, uses: 128,
    paused: false, createdAt: "2026-01-10T10:00:00Z",
  },
  {
    id: "k2", code: "SAT50K", type: "fijo", value: 50000,
    minPurchase: 300000, expiresAt: "2026-11-30", maxUses: 100, uses: 37,
    paused: false, createdAt: "2026-09-01T10:00:00Z",
  },
  {
    id: "k3", code: "CORE20", type: "porcentaje", value: 20,
    minPurchase: 500000, expiresAt: "2026-10-31", maxUses: 50, uses: 50,
    paused: false, createdAt: "2026-09-15T10:00:00Z",
  },
  {
    id: "k4", code: "VERANO15", type: "porcentaje", value: 15,
    minPurchase: 0, expiresAt: "2026-09-30", maxUses: null, uses: 64,
    paused: false, createdAt: "2026-07-01T10:00:00Z",
  },
  {
    id: "k5", code: "SOPORTE5", type: "porcentaje", value: 5,
    minPurchase: 0, expiresAt: null, maxUses: 200, uses: 12,
    paused: true, createdAt: "2026-08-05T10:00:00Z",
  },
];
