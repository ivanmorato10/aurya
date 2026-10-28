"use client";

import { useEffect, useRef } from "react";

/** Folha inferior modal (referência: "Configurações · Personalize sua experiência"). */
export function Sheet({ open, onClose, title, subtitle, children }: { open: boolean; onClose: () => void; title: string; subtitle?: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const closeRef = useRef(onClose);
  useEffect(() => {
    closeRef.current = onClose;
  }, [onClose]);
  // Foca a folha só ao abrir (o conteúdo atrás pode atualizar várias vezes por segundo, como o player).
  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    ref.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeRef.current();
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      prev?.focus?.({ preventScroll: true });
    };
  }, [open]);
  if (!open) return null;
  return (
    <div className="sheet-layer">
      <button type="button" className="sheet-backdrop" aria-label="Fechar" onClick={onClose} />
      <div className="sheet" role="dialog" aria-modal="true" aria-labelledby="sheet-title" tabIndex={-1} ref={ref}>
        <button type="button" className="sheet-handle" aria-label="Fechar" onClick={onClose} />
        <h2 id="sheet-title" className="sheet-title">
          {title}
        </h2>
        {subtitle && <p className="sheet-subtitle">{subtitle}</p>}
        {children}
      </div>
    </div>
  );
}

/** Seção da folha: rótulo + (i) opcional + conteúdo. */
export function SheetSection({ label, info, children }: { label: string; info?: string; children: React.ReactNode }) {
  return (
    <section className="sheet-section">
      <h3 className="sheet-section-title">
        {label}
        {info && (
          <span className="info-dot" title={info} aria-label={info} role="img">
            i
          </span>
        )}
      </h3>
      {children}
    </section>
  );
}
