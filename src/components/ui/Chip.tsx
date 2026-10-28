"use client";

/** Chips em pílula: contorno fino; selecionado em champagne com texto escuro. */
export function ChipGroup<T extends string | number>({
  options,
  value,
  onChange,
  label,
  multiple = false,
  grid = false,
}: {
  options: { value: T; label: string }[];
  value: T | T[];
  onChange: (v: T) => void;
  label: string;
  multiple?: boolean;
  grid?: boolean;
}) {
  const selected = (v: T) => (Array.isArray(value) ? value.includes(v) : value === v);
  return (
    <div className={`chips${grid ? " chips--grid" : ""}`} role={multiple ? "group" : "radiogroup"} aria-label={label}>
      {options.map((o) => (
        <button
          key={String(o.value)}
          type="button"
          className="chip"
          role={multiple ? "checkbox" : "radio"}
          aria-checked={selected(o.value)}
          onClick={() => onChange(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
