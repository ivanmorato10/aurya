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
