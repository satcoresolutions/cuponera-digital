/**
 * Configuración central de SEO.
 * Define NEXT_PUBLIC_SITE_URL en producción.
 */
export const SITE = {
  name: "Cuponera Digital",
  brand: "SatCore Solutions",
  description:
    "Crea, administra y valida cupones de descuento para tu negocio. Gestiona descuentos porcentuales o de valor fijo, establece compras mínimas, fechas de vencimiento y límites de uso desde una interfaz sencilla.",
  shortDescription:
    "Crea y valida cupones de descuento para gestionar promociones de tu negocio.",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(
    /\/+$/,
    "",
  ),
  locale: "es_CO",
  language: "es-CO",
  themeColor: "#132a8e",
  keywords: [
    "cuponera digital",
    "generador de cupones",
    "cupones de descuento",
    "gestión de promociones",
    "validar cupones",
    "descuentos para negocios",
    "descuentos porcentuales",
    "descuentos en pesos colombianos",
    "control de cupones",
    "herramienta para pequeños negocios",
    "SatCore Solutions",
  ],
} as const;

export const absoluteUrl = (path = "/") =>
  `${SITE.url}${path.startsWith("/") ? path : `/${path}`}`;
