import { useId } from "react";

/**
 * Símbolo solar AURYA — versão corrigida do Brand Kit (design/brand-kit/logos/sun-symbol-corrigido.svg):
 * arco duplo apoiado no horizonte, horizonte em dois segmentos e 13 raios alternando longo/curto.
 */
const CX = 100;
const CY = 104;
const RAYS = Array.from({ length: 13 }, (_, i) => {
  const a = ((200 + (140 * i) / 12) * Math.PI) / 180;
  const long = i % 2 === 0;
  const fade = Math.abs(i - 6) * 1.2;
  const r1 = 31;
  const r2 = (long ? 52 : 42) - fade;
  return { x1: CX + Math.cos(a) * r1, y1: CY + Math.sin(a) * r1, x2: CX + Math.cos(a) * r2, y2: CY + Math.sin(a) * r2, w: long ? 1.7 : 1.3 };
});

export function SunSymbol({ width = 64, className, title }: { width?: number; className?: string; title?: string }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg
      className={className}
      width={width}
      height={(width * 72) / 140}
      viewBox="30 40 140 72"
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      <defs>
        {/* userSpaceOnUse: linhas retas (bbox de largura/altura zero) também recebem o gradiente */}
        <linearGradient id={`${id}-g`} gradientUnits="userSpaceOnUse" x1="40" y1="40" x2="160" y2="110">
          <stop offset="0" stopColor="var(--aurya-champagne-light)" />
          <stop offset=".55" stopColor="var(--aurya-champagne)" />
          <stop offset="1" stopColor="var(--aurya-champagne-dark)" />
        </linearGradient>
      </defs>
      <g fill="none" stroke={`url(#${id}-g)`} strokeLinecap="round">
        <path d={`M${CX - 24} ${CY}A24 24 0 0 1 ${CX + 24} ${CY}`} strokeWidth="3.4" />
        <path d={`M${CX - 18.5} ${CY}A18.5 18.5 0 0 1 ${CX + 18.5} ${CY}`} strokeWidth="1.3" />
        <path d={`M${CX - 66} ${CY}H${CX - 30}M${CX + 30} ${CY}H${CX + 66}`} strokeWidth="1.7" />
        {RAYS.map((r, i) => (
          <line key={i} x1={r.x1.toFixed(2)} y1={r.y1.toFixed(2)} x2={r.x2.toFixed(2)} y2={r.y2.toFixed(2)} strokeWidth={r.w} />
        ))}
      </g>
    </svg>
  );
}

/** Nome AURYA em Cormorant Garamond, caixa alta espaçada, champagne. */
export function Wordmark({ size = 20, className }: { size?: number; className?: string }) {
  return (
    <span className={`aurya-wordmark${className ? ` ${className}` : ""}`} style={{ fontSize: size }}>
      AURYA
    </span>
  );
}

/** Assinatura completa: símbolo, nome e linha de apoio. */
export function Logo({ size = "lg" }: { size?: "md" | "lg" }) {
  const lg = size === "lg";
  return (
    <div className="aurya-logo" role="img" aria-label="AURYA — afirmações para uma vida extraordinária">
      <SunSymbol width={lg ? 132 : 92} />
      <Wordmark size={lg ? 60 : 40} />
      <span className="aurya-logo-tagline" aria-hidden="true">
        Afirmações para
        <br />
        uma vida extraordinária
      </span>
    </div>
  );
}
