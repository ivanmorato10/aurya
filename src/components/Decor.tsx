/** Orbes de luz que flutuam ao fundo. Puramente decorativos. */
export function Orbs() {
  return (
    <div className="orbs" aria-hidden="true">
      <span className="orb orb--1" />
      <span className="orb orb--2" />
      <span className="orb orb--3" />
    </div>
  );
}

const SPARKS = [
  [-70, -60, -30], [60, -70, 40], [-90, 10, 80], [90, 0, -60], [-40, 70, 20],
  [50, 64, -20], [0, -90, 0], [-100, -30, 120], [100, -36, -120], [20, 90, 60],
];

/** Explosão de brilhos ao revelar uma frase. Some sozinha (CSS). */
export function Burst({ seed }: { seed: string }) {
  return (
    <span className="burst" aria-hidden="true" key={seed}>
      {SPARKS.map(([dx, dy, rot], i) => (
        <span key={i} style={{ "--dx": `${dx}px`, "--dy": `${dy}px`, "--rot": `${rot}deg`, "--i": i } as React.CSSProperties} />
      ))}
    </span>
  );
}

/** Aura: anéis concêntricos que respiram em volta do personagem. */
export function Aura({ rings = 4, start = 130, step = 46 }: { rings?: number; start?: number; step?: number }) {
  return (
    <span className="aura" aria-hidden="true">
      {Array.from({ length: rings }, (_, k) => (
        <span key={k} style={{ "--s": `${start + k * step}px`, "--k": k } as React.CSSProperties} />
      ))}
    </span>
  );
}
