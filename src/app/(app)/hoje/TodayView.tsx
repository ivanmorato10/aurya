"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Affirmation } from "@/lib/content";
import { Aury } from "@/components/Aury";
import { Burst } from "@/components/Decor";
import {
  activeOccurrence,
  localNow,
  nextOccurrence,
  parseTime,
  pickDaily,
  type MomentId,
  type Schedule,
} from "@/lib/schedule";

export function TodayView({
  name,
  schedule,
  timeZone,
  affirmations,
  labels,
  serverNow,
}: {
  name: string | null;
  schedule: Schedule;
  timeZone: string;
  affirmations: Affirmation[];
  labels: Record<MomentId, string>;
  serverNow: number;
}) {
  const [now, setNow] = useState(serverNow);
  const [selected, setSelected] = useState<MomentId | null>(null);

  const local = localNow(timeZone, new Date(now));
  const active = activeOccurrence(schedule, local);
  const next = nextOccurrence(schedule, local);
  const shownMoment = selected ?? active.moment;
  const shownDay = shownMoment === active.moment ? active.day : local;
  const message = pickDaily(affirmations, shownMoment, shownDay);
  const ordered = (Object.keys(schedule) as MomentId[]).sort((a, b) => parseTime(schedule[a])! - parseTime(schedule[b])!);

  // Um único disparo na próxima troca; ao voltar para a aba, recalcula.
  useEffect(() => {
    const refresh = () => setNow(Date.now());
    const timer = setTimeout(refresh, next.inMs + 500);
    const onVisible = () => document.visibilityState === "visible" && refresh();
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", refresh);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focus", refresh);
    };
  }, [next.inMs, now]);

  // Corrige uma eventual diferença entre o relógio do servidor e o do aparelho.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sincroniza com o relógio do aparelho após hidratar
    setNow(Date.now());
  }, []);

  // O fundo do app acompanha a cor do momento ativo.
  useEffect(() => {
    document.documentElement.dataset.moment = active.moment;
    return () => {
      delete document.documentElement.dataset.moment;
    };
  }, [active.moment]);

  const previewing = Boolean(selected && selected !== active.moment);

  return (
    <div data-moment={shownMoment}>
      <div className="greet">
        <div>
          <span className="eyebrow">{previewing ? "Prévia de outro momento" : "Agora"}</span>
          <h1>{name ? `Olá, ${name}!` : "Seu momento."}</h1>
        </div>
      </div>

      <article className="affirmation" aria-live="polite" key={message.id}>
        <Burst seed={message.id} />
        <div className="affirmation-top">
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            <span className="tag">{labels[shownMoment]}</span>
            <span className="tag">{message.theme}</span>
          </div>
          <Aury moment={shownMoment} size={96} />
        </div>
        <p className="affirmation-text">{message.text}</p>
        {message.citation ? (
          <>
            <p className="source">{message.citation.author} · tradução do original</p>
            <details>
              <summary>Ver fonte</summary>
              <blockquote lang="en">{message.citation.original}</blockquote>
              <p>{message.citation.source}</p>
              <a href={message.citation.url} target="_blank" rel="noopener noreferrer">
                Abrir fonte
              </a>
            </details>
          </>
        ) : (
          <p className="source">Afirmação original AURYA</p>
        )}
        <div style={{ marginTop: 20 }}>
          <Link className="btn btn-on-card btn-block" href={`/reflexao/${message.id}`}>
            Aprofundar →
          </Link>
        </div>
      </article>

      {previewing ? (
        <button className="btn btn-quiet" style={{ marginTop: 12 }} onClick={() => setSelected(null)}>
          ← Voltar ao momento atual
        </button>
      ) : (
        <p className="next-change" data-moment={next.moment}>
          <span className="dot" aria-hidden="true" />
          <span>
            Próxima troca: <strong>{labels[next.moment]}</strong> às {schedule[next.moment]}.
          </span>
        </p>
      )}

      <section className="section" aria-labelledby="seu-dia">
        <h2 id="seu-dia">
          Seu <span className="grad-text">dia</span>
        </h2>
        <ul className="timeline">
          {ordered.map((id) => (
            <li key={id} data-moment={id}>
              <button aria-pressed={shownMoment === id} onClick={() => setSelected(id === active.moment ? null : id)}>
                <span className="tl-head">
                  <Aury moment={id} size={40} animated={false} />
                  {id === active.moment && <span className="now">agora</span>}
                </span>
                <span className="tl-name">{labels[id]}</span>
                <time>{schedule[id]}</time>
              </button>
            </li>
          ))}
        </ul>
        <p className="small" style={{ marginTop: 14 }}>
          Horários no fuso {timeZone.replaceAll("_", " ")}. <Link href="/conta">Ajustar</Link>
        </p>
      </section>
    </div>
  );
}
