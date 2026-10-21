const cop = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});
const dateFmt = new Intl.DateTimeFormat("es-CO", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

export const formatCOP = (n: number): string => cop.format(n);

/** Formatea "YYYY-MM-DD" como fecha local (evita el desfase por zona horaria). */
export const formatDay = (day: string): string => {
  const [y, m, d] = day.split("-").map(Number);
  return dateFmt.format(new Date(y, m - 1, d));
};
