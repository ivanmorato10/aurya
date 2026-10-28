import Image from "next/image";
import Link from "next/link";
import type { ImageSlot } from "@/lib/images";
import type { MomentId } from "@/lib/schedule";
import { IconChevron } from "../Icons";
import { Scene } from "../Scene";

/** Miniatura arredondada + título + detalhes + ação à direita, com divisor sutil. */
export function MediaRow({
  image,
  fallback = "sleep",
  title,
  meta,
  href,
  onSelect,
  trailing,
  current,
}: {
  image?: ImageSlot;
  fallback?: MomentId;
  title: React.ReactNode;
  meta?: React.ReactNode;
  href?: string;
  onSelect?: () => void;
  trailing?: React.ReactNode;
  current?: boolean;
}) {
  const body = (
    <>
      {image && (
        <span className="media-thumb" aria-hidden="true">
          {image.src ? <Image src={image.src} alt="" fill sizes="96px" style={{ objectFit: "cover" }} /> : <Scene moment={fallback} />}
        </span>
      )}
      <span className="media-text">
        <span className="media-title">{title}</span>
        {meta && <span className="media-meta">{meta}</span>}
      </span>
    </>
  );
  return (
    <li className={`media-row${current ? " is-current" : ""}`}>
      {href ? (
        <Link href={href} className="media-main">
          {body}
          {!trailing && <IconChevron className="media-chev" />}
        </Link>
      ) : onSelect ? (
        <button type="button" className="media-main" onClick={onSelect}>
          {body}
        </button>
      ) : (
        <div className="media-main">{body}</div>
      )}
      {trailing}
    </li>
  );
}
