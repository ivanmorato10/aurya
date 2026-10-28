import Image from "next/image";
import type { ImageSlot } from "@/lib/images";
import type { MomentId } from "@/lib/schedule";
import { Scene } from "../Scene";

/**
 * Fotografia em sangria total no topo da tela, esmaecendo para o fundo (referência "Serenidade").
 * `size="full"` ocupa a tela inteira (abertura, player). O conteúdo filho fica no rodapé da imagem.
 */
export function Hero({
  image,
  fallback,
  size = "tall",
  position = "center",
  top,
  children,
}: {
  image: ImageSlot;
  fallback: MomentId;
  size?: "tall" | "medium" | "library" | "full";
  position?: string;
  top?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <section className={`hero hero--${size}`}>
      <div className="hero-media" aria-hidden="true">
        {image.src ? (
          <Image src={image.src} alt="" fill priority sizes="(max-width: 480px) 100vw, 480px" style={{ objectFit: "cover", objectPosition: position }} />
        ) : (
          <Scene moment={fallback} />
        )}
      </div>
      {top && <div className="hero-top">{top}</div>}
      {children && <div className="hero-content">{children}</div>}
    </section>
  );
}
