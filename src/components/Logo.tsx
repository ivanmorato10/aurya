import Link from "next/link";

/** Marca AURYA: um sol nascente dentro de um halo — "aura" + "aurora". */
export function AuraMark({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id="aura-core" cx="50%" cy="58%" r="50%">
          <stop offset="0" stopColor="#f3d6a8" />
          <stop offset="1" stopColor="#e8a87c" />
        </radialGradient>
      </defs>
      <circle cx="24" cy="24" r="22" fill="none" stroke="#e8c48e" strokeOpacity=".35" />
      <circle cx="24" cy="24" r="15.5" fill="none" stroke="#e8c48e" strokeOpacity=".6" />
      <path d="M13 29a11 11 0 0 1 22 0Z" fill="url(#aura-core)" />
      <path d="M9 29h30" stroke="#f4efe6" strokeOpacity=".8" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function Brand({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="brand" aria-label="AURYA, página inicial">
      <AuraMark />
      <span>
        <span className="brand-word">AURYA</span>
        <span className="brand-tag">um instante de presença</span>
      </span>
    </Link>
  );
}
