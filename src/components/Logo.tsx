import Link from "next/link";

/** Squircle (superelipse) 64×64, o formato do ícone. */
const SQUIRCLE = "M32 0C55 0 64 9 64 32S55 64 32 64 0 55 0 32 9 0 32 0Z";
const SPARK = "M0-7 1.6-1.6 7 0 1.6 1.6 0 7-1.6 1.6-7 0-1.6-1.6Z";

/**
 * Ícone do AURYA: o Aury (solzinho) sorrindo dentro da sua aura,
 * sobre o gradiente do amanhecer (magenta → coral → âmbar).
 */
export function AppIcon({ size = 46, className = "app-icon", idPrefix = "ai" }: { size?: number; className?: string; idPrefix?: string }) {
  const g = `${idPrefix}-sky`;
  const s = `${idPrefix}-sun`;
  const h = `${idPrefix}-hi`;
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={g} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FF2E7E" />
          <stop offset=".5" stopColor="#FF6A3D" />
          <stop offset="1" stopColor="#FFC23D" />
        </linearGradient>
        <radialGradient id={h} cx=".25" cy=".15" r=".7">
          <stop offset="0" stopColor="#fff" stopOpacity=".45" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={s} cx=".4" cy=".35" r=".75">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#FFF1D6" />
        </radialGradient>
      </defs>
      <path d={SQUIRCLE} fill={`url(#${g})`} />
      <path d={SQUIRCLE} fill={`url(#${h})`} />
      {/* Aura */}
      <g fill="none" stroke="#fff">
        <circle cx="32" cy="35" r="27" strokeOpacity=".16" strokeWidth="1.6" />
        <circle cx="32" cy="35" r="21.5" strokeOpacity=".26" strokeWidth="1.6" />
      </g>
      {/* Raios */}
      <g stroke="#fff" strokeWidth="3" strokeLinecap="round">
        {[-90, -45, -135, 0, 180].map((deg) => {
          const a = (deg * Math.PI) / 180;
          return <line key={deg} x1={32 + Math.cos(a) * 18.5} y1={35 + Math.sin(a) * 18.5} x2={32 + Math.cos(a) * 22.5} y2={35 + Math.sin(a) * 22.5} />;
        })}
      </g>
      {/* Aury */}
      <circle cx="32" cy="35" r="14" fill={`url(#${s})`} />
      <path d="M25.6 33.4q2.4-3 4.8 0M33.6 33.4q2.4-3 4.8 0" stroke="#2B1650" strokeWidth="2.4" strokeLinecap="round" fill="none" />
      <path d="M27.5 39q4.5 4.6 9 0" stroke="#2B1650" strokeWidth="2.4" strokeLinecap="round" fill="none" />
      <ellipse cx="23.8" cy="38" rx="2.4" ry="1.6" fill="#FF4F8B" opacity=".55" />
      <ellipse cx="40.2" cy="38" rx="2.4" ry="1.6" fill="#FF4F8B" opacity=".55" />
      {/* Brilho */}
      <path d={SPARK} transform="translate(51 13) scale(.9)" fill="#fff" />
    </svg>
  );
}

/** Assinatura: ícone + nome "aurya" com a estrela do amanhecer. */
export function Brand({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="brand" aria-label="AURYA, página inicial">
      <AppIcon />
      <span className="brand-text">
        <span className="brand-word">
          aurya
          <svg className="brand-spark" viewBox="-8 -8 16 16" width="12" height="12" aria-hidden="true">
            <path d={SPARK} fill="url(#brand-spark-g)" />
            <defs>
              <linearGradient id="brand-spark-g" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#FF2E7E" />
                <stop offset="1" stopColor="#FFB23D" />
              </linearGradient>
            </defs>
          </svg>
        </span>
        <span className="brand-tag">um instante de presença</span>
      </span>
    </Link>
  );
}
