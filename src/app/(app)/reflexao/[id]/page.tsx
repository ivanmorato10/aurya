import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireReadyProfile } from "@/lib/auth";
import { findReflection, MOMENT_LABEL, REFLECTION_AMBIENCE_SRC } from "@/lib/content";
import { ReflectionPlayer } from "./ReflectionPlayer";

export const metadata: Metadata = { title: "Aprofundar" };

export default async function ReflexaoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await requireReadyProfile(`/reflexao/${id}`);
  const item = findReflection(id);
  if (!item) notFound();
  const { reflection } = item;

  return (
    <article data-moment={item.moment} className="stack">
      <Link href="/hoje" className="btn btn-quiet" style={{ paddingInline: 0 }}>
        ← Voltar
      </Link>
      <div>
        <span className="eyebrow">
          {MOMENT_LABEL[item.moment]} · {reflection.principle}
        </span>
        <h1>{reflection.title}</h1>
        <p className="lead" style={{ fontFamily: "var(--font-display)", fontSize: 22, color: "var(--ink)" }}>
          {item.text}
        </p>
        {item.citation && (
          <p className="small">
            Citação de {item.citation.author}, traduzida do original.{" "}
            <a href={item.citation.url} target="_blank" rel="noopener noreferrer">
              Fonte
            </a>
            . O texto abaixo é comentário editorial AURYA.
          </p>
        )}
      </div>

      <ReflectionPlayer chunks={[item.text, ...reflection.paragraphs]} ambienceSrc={REFLECTION_AMBIENCE_SRC} />

      <div className="reflection-text">
        {reflection.paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
      <p className="small">Texto original AURYA · cerca de {reflection.wordCount} palavras.</p>
      <Link href="/hoje" className="btn btn-block">
        Voltar à afirmação
      </Link>
    </article>
  );
}
