// Fotografias de produção (verticais, sem texto). Enquanto um arquivo não existir,
// a tela usa a ilustração provisória correspondente (src/components/Scene.tsx).
// Lista, especificações e status: docs/IMAGENS.md.
import type { MomentId } from "./schedule";

export type ImageSlot = { src: string | null; alt: string };

export const IMAGES = {
  opening: { src: null, alt: "Costa à noite com a luz do sol no horizonte" },
  player: { src: null, alt: "Lua cheia refletida no mar" },
  reflection: { src: null, alt: "Montanhas sobre nuvens com luz suave" },
} satisfies Record<string, ImageSlot>;

export const MOMENT_IMAGES: Record<MomentId, ImageSlot> = {
  wake: { src: null, alt: "Montanhas ao amanhecer" },
  commute: { src: null, alt: "Paisagem na luz da manhã" },
  midday: { src: null, alt: "Oceano iluminado pelo sol" },
  sleep: { src: null, alt: "Lua sobre o oceano à noite" },
};
