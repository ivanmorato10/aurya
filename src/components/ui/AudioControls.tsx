import { IconPauseThin, IconPlayThin } from "../Icons";

/**
 * Botão de anel (referência): pequeno com contorno marfim nas listas; grande com anel champagne no player.
 */
export function RingButton({
  playing,
  busy,
  onClick,
  label,
  size = "sm",
}: {
  playing: boolean;
  busy?: boolean;
  onClick: () => void;
  label?: string;
  size?: "sm" | "lg";
}) {
  return (
    <button
      type="button"
      className={`ring ring--${size}`}
      onClick={onClick}
      disabled={busy}
      aria-label={label ?? (playing ? "Pausar" : "Reproduzir")}
      aria-pressed={playing}
    >
      {busy ? <span className="spinner" aria-hidden="true" /> : playing ? <IconPauseThin /> : <IconPlayThin />}
    </button>
  );
}

/** Mantido para compatibilidade: botão grande de play. */
export const PlayButton = ({ playing, busy, onClick, label }: { playing: boolean; busy?: boolean; onClick: () => void; label?: string; size?: "md" | "lg" }) => (
  <RingButton playing={playing} busy={busy} onClick={onClick} label={label} size="lg" />
);

/** Progresso champagne com marcador e tempos (decorrido / total do temporizador). */
export function ProgressBar({ elapsedMs, totalMs }: { elapsedMs: number; totalMs: number }) {
  const pct = totalMs > 0 ? Math.min(100, Math.max(0, (elapsedMs / totalMs) * 100)) : 0;
  const fmt = (ms: number) => {
    const s = Math.max(0, Math.round(ms / 1000));
    return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
  };
  return (
    <div className="progress-block">
      <div className="progress-track" role="progressbar" aria-valuemin={0} aria-valuemax={Math.round(totalMs / 1000)} aria-valuenow={Math.round(elapsedMs / 1000)} aria-label="Progresso da sessão">
        <i style={{ width: `${pct}%` }} />
        <b style={{ left: `${pct}%` }} />
      </div>
      <div className="progress-times">
        <span>{fmt(elapsedMs)}</span>
        <span>{fmt(totalMs)}</span>
      </div>
    </div>
  );
}
