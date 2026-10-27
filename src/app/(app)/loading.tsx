export default function Loading() {
  return (
    <div aria-busy="true" aria-live="polite">
      <span className="sr-only">Carregando…</span>
      <div className="skeleton" style={{ height: 20, width: 140 }} />
      <div className="skeleton" style={{ height: 260, marginTop: 18, borderRadius: 32 }} />
      <div className="skeleton" style={{ height: 56, marginTop: 18 }} />
      <div className="skeleton" style={{ height: 56, marginTop: 8 }} />
    </div>
  );
}
