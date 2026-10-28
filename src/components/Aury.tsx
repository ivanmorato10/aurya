import { useId } from "react";
import type { MomentId } from "@/lib/schedule";

/**
 * Aury — o personagem do AURYA. Um solzinho que acompanha o dia:
 * nasce ao acordar, corre no trajeto, brilha ao meio-dia e vira lua antes de dormir.
 * Desenhado em SVG; as animações ficam em globals.css (.aury-*).
 */
const FILL: Record<MomentId, [string, string]> = {
  wake: ["#FFC36B", "#FF5E62"],
  commute: ["#8FDCFF", "#2F8BFF"],
  midday: ["#FFE66E", "#FFAA1F"],
  sleep: ["#E2D9FF", "#9B7CFF"],
};

const INK = "#2B1650";

export function Aury({ moment = "midday", size = 120, animated = true, title }: { moment?: MomentId; size?: number; animated?: boolean; title?: string }) {
  const id = `aury-${useId().replace(/:/g, "")}`;
  const [from, to] = FILL[moment];
  const anim = animated ? " is-animated" : "";
  return (
    <svg
      className={`aury aury--${moment}${anim}`}
      width={size}
      height={size}
      viewBox="0 0 120 120"
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      <defs>
        <radialGradient id={`${id}-g`} cx="38%" cy="32%" r="75%">
          <stop offset="0" stopColor={from} />
          <stop offset="1" stopColor={to} />
        </radialGradient>
        {moment === "sleep" && (
          <mask id={`${id}-m`}>
            <rect width="120" height="120" fill="#fff" />
            <circle cx="82" cy="46" r="30" fill="#000" />
          </mask>
        )}
        {moment === "wake" && (
          <clipPath id={`${id}-c`}>
            <rect x="0" y="0" width="120" height="88" />
          </clipPath>
        )}
      </defs>

      {/* Raios */}
      {(moment === "midday" || moment === "commute" || moment === "wake") && (
        <g className="aury-rays" stroke={to} strokeWidth="6" strokeLinecap="round" opacity={moment === "midday" ? 1 : 0.85} clipPath={moment === "wake" ? `url(#${id}-c)` : undefined}>
          {Array.from({ length: moment === "midday" ? 10 : 7 }, (_, i) => {
            const count = moment === "midday" ? 10 : 7;
            const start = moment === "wake" ? Math.PI : 0;
            const span = moment === "wake" ? Math.PI : Math.PI * 2;
            const a = start + (span / (moment === "wake" ? count - 1 : count)) * i;
            const cx = 60;
            const cy = moment === "wake" ? 80 : 62;
            const r1 = 44;
            const r2 = moment === "midday" ? 55 : 52;
            return <line key={i} x1={cx + Math.cos(a) * r1} y1={cy + Math.sin(a) * r1} x2={cx + Math.cos(a) * r2} y2={cy + Math.sin(a) * r2} />;
          })}
        </g>
      )}

      {/* Rastros de velocidade (trajeto) */}
      {moment === "commute" && (
        <g className="aury-speed" stroke={INK} strokeWidth="4" strokeLinecap="round" opacity=".35">
          <line x1="4" y1="52" x2="18" y2="52" />
          <line x1="0" y1="64" x2="14" y2="64" />
          <line x1="6" y1="76" x2="18" y2="76" />
        </g>
      )}

      {/* Estrelas (noite) */}
      {moment === "sleep" && (
        <g className="aury-stars" fill="#FFD66B">
          <path d="M96 22l2.5 6 6 2.5-6 2.5-2.5 6-2.5-6-6-2.5 6-2.5z" />
          <path d="M104 64l1.6 3.8 3.8 1.6-3.8 1.6-1.6 3.8-1.6-3.8-3.8-1.6 3.8-1.6z" />
          <path d="M20 26l1.6 3.8 3.8 1.6-3.8 1.6-1.6 3.8-1.6-3.8-3.8-1.6 3.8-1.6z" />
        </g>
      )}

      {/* Corpo */}
      <g className="aury-body">
        {moment === "wake" ? (
          <g clipPath={`url(#${id}-c)`}>
            <circle cx="60" cy="80" r="36" fill={`url(#${id}-g)`} />
          </g>
        ) : (
          <circle cx="60" cy="62" r="36" fill={`url(#${id}-g)`} mask={moment === "sleep" ? `url(#${id}-m)` : undefined} />
        )}

        {/* Rosto */}
        {moment === "wake" && (
          <g stroke={INK} strokeWidth="4" strokeLinecap="round" fill="none">
            <path className="aury-eye" d="M45 70q5 4 10 0" />
            <path className="aury-eye" d="M65 70q5 4 10 0" />
            <path d="M54 80q6 4 12 0" />
          </g>
        )}
        {(moment === "commute" || moment === "midday") && (
          <g>
            <ellipse className="aury-eye" cx="50" cy="58" rx="4" ry="5.5" fill={INK} />
            <ellipse className="aury-eye" cx="70" cy="58" rx="4" ry="5.5" fill={INK} />
            <circle cx="51.6" cy="56" r="1.5" fill="#fff" />
            <circle cx="71.6" cy="56" r="1.5" fill="#fff" />
            <path d={moment === "midday" ? "M49 70q11 11 22 0" : "M51 71q9 7 18 0"} stroke={INK} strokeWidth="4" strokeLinecap="round" fill="none" />
          </g>
        )}
        {moment === "sleep" && (
          <g stroke={INK} strokeWidth="4" strokeLinecap="round" fill="none">
            <path d="M36 60q5 4 10 0" />
            <path d="M42 76q5 3 10 0" />
          </g>
        )}
        {/* Bochechas */}
        {moment !== "sleep" && (
          <g fill="#FF4F8B" opacity=".45">
            <ellipse cx={moment === "wake" ? 41 : 42} cy={moment === "wake" ? 78 : 67} rx="5" ry="3.5" />
            <ellipse cx={moment === "wake" ? 79 : 78} cy={moment === "wake" ? 78 : 67} rx="5" ry="3.5" />
          </g>
        )}
        {moment === "sleep" && <ellipse cx="34" cy="70" rx="4.5" ry="3" fill="#FF4F8B" opacity=".45" />}
      </g>

      {/* Horizonte (acordar) */}
      {moment === "wake" && <path d="M10 88q25-6 50 0t50 0" stroke={INK} strokeWidth="4" strokeLinecap="round" fill="none" />}
    </svg>
  );
}
