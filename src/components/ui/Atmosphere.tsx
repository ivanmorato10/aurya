import Image from "next/image";
import type { ImageSlot } from "@/lib/images";
import type { MomentId } from "@/lib/schedule";
import { Scene } from "../Scene";

/**
 * Imagem atmosférica de fundo, em tela cheia, com véu Midnight para legibilidade do texto.
 * Usa a fotografia aprovada quando existir; senão, a ilustração provisória do momento.
 */
export function Atmosphere({ image, fallback }: { image: ImageSlot; fallback: MomentId }) {
  return (
    <div className={`atmosphere atmosphere--${fallback}`} aria-hidden="true">
      {image.src ? <Image src={image.src} alt="" fill priority sizes="100vw" style={{ objectFit: "cover" }} /> : <Scene moment={fallback} align="bottom" />}
    </div>
  );
}
