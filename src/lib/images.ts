// Fotografias das telas (verticais, sem texto). Status e especificações: docs/IMAGENS.md.
// PROVISÓRIAS: recortes da prancha de direção artística (~250–340 px de largura),
// sem upscale. Substituir pelos arquivos em alta resolução mantendo os mesmos caminhos.
import type { MomentId } from "./schedule";

export type ImageSlot = { src: string | null; alt: string };

export const IMAGES = {
  opening: { src: "/images/opening.webp", alt: "Costa à noite com a luz do sol no horizonte" },
  player: { src: "/images/player.webp", alt: "Lua cheia refletida no mar" },
  reflection: { src: "/images/reflection.webp", alt: "Montanhas sobre nuvens com luz suave" },
} satisfies Record<string, ImageSlot>;

export const MOMENT_IMAGES: Record<MomentId, ImageSlot> = {
  wake: { src: "/images/moments/wake.webp", alt: "Montanhas ao amanhecer" },
  // Sem imagem própria na prancha: usa "Fim de tarde" até existir uma imagem de manhã clara.
  commute: { src: "/images/moments/commute.webp", alt: "Sol baixo sobre o mar e as montanhas" },
  midday: { src: "/images/moments/midday.webp", alt: "Oceano iluminado pelo sol" },
  sleep: { src: "/images/moments/sleep.webp", alt: "Lua sobre o oceano à noite" },
};

const ALL = [MOMENT_IMAGES.wake, IMAGES.opening, IMAGES.reflection, MOMENT_IMAGES.commute, MOMENT_IMAGES.midday, MOMENT_IMAGES.sleep, IMAGES.player];

/** Imagens das faixas por tema (miniatura e fundo do player). */
const THEME_IMAGES: Record<string, ImageSlot[]> = {
  prosperity: [MOMENT_IMAGES.wake, IMAGES.reflection, IMAGES.opening, MOMENT_IMAGES.commute],
  wealth: [MOMENT_IMAGES.commute, MOMENT_IMAGES.midday, MOMENT_IMAGES.wake],
  gratitude: [MOMENT_IMAGES.sleep, IMAGES.player, IMAGES.opening, IMAGES.reflection],
};

export function trackImage(theme: string, index: number): ImageSlot {
  const list = THEME_IMAGES[theme] ?? ALL;
  return list[index % list.length];
}

/** Imagem de cada melodia (blocos da folha de configurações). */
export const MELODY_IMAGES: Record<string, ImageSlot> = {
  Aurora: MOMENT_IMAGES.wake,
  Horizonte: MOMENT_IMAGES.midday,
  Acolhimento: MOMENT_IMAGES.sleep,
};
