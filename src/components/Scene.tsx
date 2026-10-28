import { useId } from "react";
import type { MomentId } from "@/lib/schedule";

/**
 * Paisagem serena (céu, montanhas, lago) que muda com o momento do dia.
 * Ilustração vetorial própria do AURYA; as animações ficam em globals.css (.scene-*).
 */
type Palette = { sky: [string, string, string, string]; glow: string; body: string; mountains: [string, string, string]; lake: [string, string]; trees: string };

// Provisório até as fotografias aprovadas chegarem (docs/IMAGENS.md). Tons derivados da paleta do Brand Kit.
const PALETTES: Record<MomentId, Palette> = {
  wake: {
    sky: ["#0d1826", "#1e3a5f", "#7d6f5c", "#d8c6a2"],
    glow: "#e9dcc0",
    body: "#f4f0e8",
    mountains: ["#2b4565", "#1a2c44", "#0f1a29"],
    lake: ["#22374f", "#0b1420"],
    trees: "#0b1420",
  },
  commute: {
    sky: ["#101c2c", "#1e3a5f", "#4f6b88", "#b9bcb4"],
    glow: "#f4f0e8",
    body: "#f4f0e8",
    mountains: ["#3a5677", "#22395a", "#122236"],
    lake: ["#1e3a5f", "#0b1420"],
    trees: "#0e1a2a",
  },
  midday: {
    sky: ["#14253b", "#2a4d78", "#6e8aa8", "#d4cdbd"],
    glow: "#f4f0e8",
    body: "#f4f0e8",
    mountains: ["#45658a", "#28466b", "#15263c"],
    lake: ["#24446b", "#0d1828"],
    trees: "#101d2e",
  },
  sleep: {
    sky: ["#070d17", "#0b1420", "#101c2c", "#1e3a5f"],
    glow: "#c5b69a",
    body: "#f4f0e8",
    mountains: ["#1a2c44", "#121f31", "#0a111c"],
    lake: ["#101c2c", "#060b13"],
    trees: "#060b13",
  },
};

const SUN: Record<MomentId, { x: number; y: number; r: number }> = {
  wake: { x: 200, y: 186, r: 30 },
  commute: { x: 292, y: 104, r: 18 },
  midday: { x: 120, y: 62, r: 20 },
  sleep: { x: 296, y: 70, r: 16 },
};

const STARS = [
  [30, 30], [72, 58], [118, 22], [160, 48], [214, 18], [248, 52], [340, 26], [372, 60], [56, 96], [182, 92], [356, 112], [98, 128], [236, 120],
];

const MOUNTAINS = [
  "M0 160 L46 118 L88 146 L142 96 L196 150 L250 108 L304 140 L352 100 L400 132 L400 196 L0 196 Z",
  "M0 176 L60 138 L112 168 L170 128 L226 172 L286 132 L344 166 L400 142 L400 196 L0 196 Z",
  "M0 196 L0 184 L70 160 L130 188 L196 166 L262 190 L330 168 L400 186 L400 196 Z",
];

export function Scene({ moment = "wake", className, label }: { moment?: MomentId; className?: string; label?: string }) {
  const id = useId().replace(/:/g, "");
  const p = PALETTES[moment];
  const sun = SUN[moment];
  return (
    <svg
      className={`scene scene--${moment}${className ? ` ${className}` : ""}`}
      viewBox="0 0 400 300"
      preserveAspectRatio="xMidYMid slice"
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={p.sky[0]} />
          <stop offset=".45" stopColor={p.sky[1]} />
          <stop offset=".8" stopColor={p.sky[2]} />
          <stop offset="1" stopColor={p.sky[3]} />
        </linearGradient>
        <radialGradient id={`${id}-glow`} cx={sun.x / 400} cy={sun.y / 196} r=".55">
          <stop offset="0" stopColor={p.glow} stopOpacity=".75" />
          <stop offset="1" stopColor={p.glow} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}-lake`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={p.lake[0]} />
          <stop offset="1" stopColor={p.lake[1]} />
        </linearGradient>
        <linearGradient id={`${id}-fade`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity=".45" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <mask id={`${id}-reflect`}>
          <rect x="0" y="196" width="400" height="104" fill={`url(#${id}-fade)`} />
        </mask>
        <clipPath id={`${id}-sky-clip`}>
          <rect width="400" height="196" />
        </clipPath>
      </defs>

      {/* Céu */}
      <rect width="400" height="196" fill={`url(#${id}-sky)`} />
      <rect width="400" height="196" fill={`url(#${id}-glow)`} />

      {moment === "sleep" && (
        <g className="scene-stars" fill="#fff">
          {STARS.map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 1.4 : 0.9} style={{ animationDelay: `${(i % 5) * 0.7}s` }} />
          ))}
        </g>
      )}

      {/* Sol ou lua */}
      <g clipPath={`url(#${id}-sky-clip)`} className="scene-sun">
        <circle cx={sun.x} cy={sun.y} r={sun.r * 2.2} fill={p.glow} opacity=".18" />
        <circle cx={sun.x} cy={sun.y} r={sun.r} fill={p.body} />
        {moment === "sleep" && <circle cx={sun.x + 7} cy={sun.y - 5} r={sun.r} fill={p.sky[1]} />}
      </g>

      {/* Montanhas */}
      <g>
        <path d={MOUNTAINS[0]} fill={p.mountains[0]} opacity=".85" />
        <path d={MOUNTAINS[1]} fill={p.mountains[1]} />
        <path d={MOUNTAINS[2]} fill={p.mountains[2]} />
        <g fill={p.trees}>
          {[300, 312, 322, 334, 346, 356, 368, 380, 392].map((x, i) => (
            <path key={x} d={`M${x} ${196 - 10 - (i % 3) * 4} l5 ${10 + (i % 3) * 4} h-10 z`} />
          ))}
        </g>
      </g>

      {/* Lago com reflexo */}
      <rect y="196" width="400" height="104" fill={`url(#${id}-lake)`} />
      <g transform="translate(0 392) scale(1 -1)" mask={`url(#${id}-reflect)`} opacity=".55">
        <path d={MOUNTAINS[0]} fill={p.mountains[0]} />
        <path d={MOUNTAINS[1]} fill={p.mountains[1]} />
        <path d={MOUNTAINS[2]} fill={p.mountains[2]} />
      </g>
      <g className="scene-shimmer" stroke={p.glow} strokeLinecap="round">
        <line x1={sun.x - 34} y1="206" x2={sun.x + 34} y2="206" strokeWidth="2" opacity=".55" />
        <line x1={sun.x - 22} y1="216" x2={sun.x + 22} y2="216" strokeWidth="1.6" opacity=".4" />
        <line x1={sun.x - 12} y1="228" x2={sun.x + 12} y2="228" strokeWidth="1.2" opacity=".3" />
      </g>
    </svg>
  );
}
