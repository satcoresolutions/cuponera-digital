import type { CouponStatus } from "@/lib/types";

export type CouponFilter = CouponStatus | "todos";

interface CouponFiltersProps {
  filter: CouponFilter;
  onChange: (filter: CouponFilter) => void;
}

const FILTERS: { value: CouponFilter; label: string }[] = [
  { value: "todos", label: "Todos" },
  { value: "activo", label: "Activos" },
  { value: "pausado", label: "Pausados" },
  { value: "vencido", label: "Vencidos" },
  { value: "agotado", label: "Agotados" },
];

export default function CouponFilters({
  filter,
  onChange,
}: CouponFiltersProps) {
  return (
    <div
      role="group"
      aria-label="Filtrar por estado"
      className="flex flex-wrap gap-2"
    >
      {FILTERS.map((item) => (
        <button
          key={item.value}
          type="button"
          aria-pressed={filter === item.value}
          onClick={() => onChange(item.value)}
          className={`rounded-full border px-3 py-1 text-sm transition-colors ${
            filter === item.value
              ? "border-primary bg-primary text-ink"
              : "border-line text-ink-soft hover:border-muted"
          }`}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
