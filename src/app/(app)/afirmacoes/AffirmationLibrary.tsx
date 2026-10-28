"use client";

import { useState } from "react";
import type { Affirmation } from "@/lib/content";
import { IMAGES, MOMENT_IMAGES } from "@/lib/images";
import type { MomentId } from "@/lib/schedule";
import { Hero } from "@/components/ui/Hero";
import { MediaRow } from "@/components/ui/MediaRow";
import { Tabs } from "@/components/ui/Tabs";
import { BrandBar } from "@/components/ui/TopBar";

/** As 24 afirmações do catálogo, por momento; cada uma abre seu aprofundamento. */
export function AffirmationLibrary({ affirmations, moments }: { affirmations: Affirmation[]; moments: { id: MomentId; label: string }[] }) {
  const [filter, setFilter] = useState<"all" | MomentId>("all");
  const label = Object.fromEntries(moments.map((m) => [m.id, m.label])) as Record<MomentId, string>;
  const list = filter === "all" ? affirmations : affirmations.filter((a) => a.moment === filter);
  return (
    <>
      <Hero image={IMAGES.reflection} fallback="wake" size="medium" position="center 35%" top={<BrandBar />}>
        <h1 className="screen-display">Afirmações</h1>
        <p className="screen-sub">Palavras para cada momento do seu dia.</p>
      </Hero>
      <Tabs label="Momentos" value={filter} onChange={setFilter} items={[{ id: "all" as const, label: "Todas" }, ...moments.map((m) => ({ id: m.id, label: m.label }))]} />
      <ul className="media-list" aria-label="Afirmações">
        {list.map((a) => (
          <MediaRow key={a.id} image={MOMENT_IMAGES[a.moment]} fallback={a.moment} title={a.text} meta={`${label[a.moment]} · ${a.theme}`} href={`/reflexao/${a.id}`} />
        ))}
      </ul>
    </>
  );
}
