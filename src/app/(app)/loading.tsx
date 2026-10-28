export default function Loading() {
  return (
    <div aria-busy="true" aria-live="polite">
      <span className="sr-only">Carregando…</span>
      <div className="skeleton" style={{ height: 44, width: 180, marginTop: 10 }} />
      <div className="skeleton" style={{ height: 400, marginTop: 14, borderRadius: 28 }} />
      <div className="skeleton" style={{ height: 240, marginTop: 24 }} />
    </div>
  );
}
