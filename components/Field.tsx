import type { ReactNode } from "react";

interface FieldProps {
  id: string;
  label: string;
  error?: string;
  children: ReactNode;
}

export default function Field({
  id,
  label,
  error,
  children,
}: FieldProps) {
  return (
    <div className="min-w-0">
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
