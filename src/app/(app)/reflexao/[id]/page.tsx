import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Hero } from "@/components/ui/Hero";
import { findReflection, MOMENT_LABEL, REFLECTION_AMBIENCE_SRC } from "@/lib/content";
import { MOMENT_IMAGES } from "@/lib/images";
import { BackBar } from "./BackBar";
import { MomentHeading } from "./MomentHeading";
import { ReflectionPlayer } from "./ReflectionPlayer";

export const metadata: Metadata = { title: "Aprofundar" };

export default async function ReflexaoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = findReflection(id);
  if (!item) notFound();
  const { reflection } = item;

  return (
    <article>
      <Hero image={MOMENT_IMAGES[item.moment]} fallback={item.moment} size="tall" top={<BackBar />}>
        <MomentHeading moment={item.moment} label={MOMENT_LABEL[item.moment]} />
        <h1 className="home-affirmation reflection-affirmation">{item.text}</h1>
        {item.citation && (
          <p className="home-source">
            {item.citation.author}, tradução do original ·{" "}
            <a href={item.citation.url} target="_blank" rel="noopener noreferrer">
              fonte
            </a>
          </p>
        )}
      </Hero>

      <ReflectionPlayer chunks={[item.text, ...reflection.paragraphs]} ambienceSrc={REFLECTION_AMBIENCE_SRC} />

      <section className="reading" aria-labelledby="aprof-titulo">
        <p className="overline">Aprofundamento</p>
        <h2 id="aprof-titulo" className="reading-title">
          {reflection.title}
        </h2>
        <div className="reading-text">
          {reflection.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        <p className="reading-meta">
          {reflection.principle} · texto original AURYA{item.citation ? " (comentário editorial sobre a citação)" : ""} · {Math.max(1, Math.round(reflection.wordCount / 160))} min de leitura
        </p>
      </section>
    </article>
  );
}
