/**
 * Marca AURYA: "aurya" em serifada, com um pequeno sol nascendo sobre o "y".
 * O ícone do app (src/app/icon.svg) usa a mesma ideia num quadrado azul-noite.
 */
export function Wordmark({ size = 28, className }: { size?: number; className?: string }) {
  return (
    <span className={`wordmark${className ? ` ${className}` : ""}`} style={{ fontSize: size }} aria-label="AURYA">
      <span aria-hidden="true">aurya</span>
      <svg className="wordmark-sun" viewBox="0 0 20 12" aria-hidden="true" focusable="false">
        <path d="M3 11a7 7 0 0 1 14 0" fill="#ffd6a6" />
        <path d="M0 11.2h20" stroke="#fff" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    </span>
  );
}

/** Ícone compacto (cabeçalho do app). */
export function AppMark({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="appmark-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1f2a5c" />
          <stop offset=".7" stopColor="#5d5aa6" />
          <stop offset="1" stopColor="#ef9a92" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="16" fill="url(#appmark-sky)" />
      <path d="M18 44a14 14 0 0 1 28 0" fill="#ffe2b8" />
      <path d="M10 44.5h44" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M20 51h24M26 56h12" stroke="#fff" strokeOpacity=".45" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
