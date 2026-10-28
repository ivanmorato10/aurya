import { IconPause, IconPlay } from "../Icons";

/** Botão circular Ivory de reproduzir/pausar (Home e player). */
export function PlayButton({ playing, busy, onClick, label, size = "lg" }: { playing: boolean; busy?: boolean; onClick: () => void; label?: string; size?: "md" | "lg" }) {
  return (
    <button
      type="button"
      className={`play-btn${size === "md" ? " play-btn--md" : ""}`}
      onClick={onClick}
      disabled={busy}
      aria-label={label ?? (playing ? "Pausar" : "Reproduzir")}
      aria-pressed={playing}
    >
      {busy ? <span className="spinner" aria-hidden="true" /> : playing ? <IconPause /> : <IconPlay />}
    </button>
  );
}

/** Barra de progresso fina com tempos (decorrido / total), em milissegundos. */
export function ProgressBar({ elapsedMs, totalMs }: { elapsedMs: number; totalMs: number }) {
  const pct = totalMs > 0 ? Math.min(100, Math.max(0, (elapsedMs / totalMs) * 100)) : 0;
  const fmt = (ms: number) => {
    const s = Math.max(0, Math.round(ms / 1000));
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  };
  return (
    <div className="audio-progress">
      <div className="audio-progress-track" role="progressbar" aria-valuemin={0} aria-valuemax={Math.round(totalMs / 1000)} aria-valuenow={Math.round(elapsedMs / 1000)} aria-label="Progresso da sessão">
        <i style={{ width: `${pct}%` }} />
      </div>
      <div className="audio-progress-times">
        <span>{fmt(elapsedMs)}</span>
        <span>{fmt(totalMs)}</span>
      </div>
    </div>
  );
}
