"use client";

import { useState } from "react";
import { IconBook, IconChevron } from "@/components/Icons";

/** Mostra o restante do aprofundamento sob demanda, como na referência. */
export function ReadMore({ paragraphs }: { paragraphs: string[] }) {
  const [open, setOpen] = useState(false);
  if (!paragraphs.length) return null;
  if (open) return paragraphs.map((p, i) => <p key={i}>{p}</p>);
  return (
    <button type="button" className="read-more" onClick={() => setOpen(true)} aria-expanded={false}>
      <IconBook className="read-more-icon" />
      <span>Ler aprofundamento completo</span>
      <IconChevron className="chev" />
    </button>
  );
}
