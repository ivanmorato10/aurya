import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { AppHeader } from "@/components/ui/AppHeader";
import { findReflection, MOMENT_LABEL, REFLECTION_AMBIENCE_SRC } from "@/lib/content";
import { IMAGES } from "@/lib/images";
import { MomentHeading } from "./MomentHeading";
import { ReadMore } from "./ReadMore";
import { ReflectionPlayer } from "./ReflectionPlayer";

export const metadata: Metadata = { title: "Aprofundar" };

export default async function ReflexaoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = findReflection(id);
  if (!item) notFound();
  const { reflection } = item;
  const [first, ...rest] = reflection.paragraphs;

  return (
    <article className="reflection">
      {IMAGES.reflection.src && (
        <div className="reflection-backdrop" aria-hidden="true">
          <Image src={IMAGES.reflection.src} alt="" fill priority sizes="100vw" style={{ objectFit: "cover" }} />
        </div>
      )}
      <AppHeader back="/hoje" />

      <header className="reflection-head">
        <MomentHeading moment={item.moment} label={MOMENT_LABEL[item.moment]} />
        <h1 className="reflection-affirmation">{item.text}</h1>
        {item.citation && (
          <p className="home-source">
            {item.citation.author}, tradução do original ·{" "}
            <a href={item.citation.url} target="_blank" rel="noopener noreferrer">
              fonte
            </a>
          </p>
        )}
      </header>

      <section className="reflection-body" aria-labelledby="aprof-titulo">
        <p className="overline">Aprofundamento</p>
        <h2 id="aprof-titulo" className="reflection-title">
          {reflection.title}
        </h2>
        <div className="reflection-text">
          <p>{first}</p>
          <ReadMore paragraphs={rest} />
        </div>
        <p className="caption">
          {reflection.principle} · texto original AURYA{item.citation ? " (comentário editorial sobre a citação)" : ""} · {Math.max(1, Math.round(reflection.wordCount / 160))} min de leitura
        </p>
      </section>

      <ReflectionPlayer title={reflection.title} chunks={[item.text, ...reflection.paragraphs]} ambienceSrc={REFLECTION_AMBIENCE_SRC} />
    </article>
  );
}
