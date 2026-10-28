"use client";

/** Abas de texto com sublinhado champagne (referência: Todos · Prosperidade · Riqueza · Gratidão). */
export function Tabs<T extends string>({ items, value, onChange, label }: { items: { id: T; label: string }[]; value: T; onChange: (id: T) => void; label: string }) {
  return (
    <div className="tabs" role="tablist" aria-label={label}>
      {items.map((it) => (
        <button key={it.id} type="button" role="tab" aria-selected={value === it.id} className="tab" onClick={() => onChange(it.id)}>
          {it.label}
        </button>
      ))}
    </div>
  );
}
