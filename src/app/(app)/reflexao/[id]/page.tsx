import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NavBar } from "@/components/Screen";
import { Scene } from "@/components/Scene";
import { findReflection, MOMENT_LABEL, REFLECTION_AMBIENCE_SRC } from "@/lib/content";
import { ReflectionPlayer } from "./ReflectionPlayer";

export const metadata: Metadata = { title: "Aprofundar" };

export default async function ReflexaoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = findReflection(id);
  if (!item) notFound();
  const { reflection } = item;

  return (
    <article style={{ display: "contents" }}>
      <NavBar back="/hoje" title="Aprofundar" />
      <header className="reflection-art">
        <Scene moment={item.moment} />
        <p className="quote">{item.text}</p>
      </header>

      <p className="kicker" style={{ marginTop: 22 }}>
        {MOMENT_LABEL[item.moment]} · {reflection.principle}
      </p>
      <h1 className="reflection-title">{reflection.title}</h1>
      {item.citation && (
        <p className="caption" style={{ margin: "0 0 14px" }}>
          Citação de {item.citation.author}, traduzida do original ·{" "}
          <a href={item.citation.url} target="_blank" rel="noopener noreferrer">
            fonte
          </a>
          . O texto abaixo é comentário editorial AURYA.
        </p>
      )}
      <div className="reflection-text">
        {reflection.paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
      <p className="caption">
        Texto original AURYA · {Math.max(1, Math.round(reflection.wordCount / 160))} min de leitura
      </p>

      <ReflectionPlayer title={reflection.title} chunks={[item.text, ...reflection.paragraphs]} ambienceSrc={REFLECTION_AMBIENCE_SRC} />
    </article>
  );
}
