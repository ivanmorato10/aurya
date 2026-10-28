"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Affirmation } from "@/lib/content";
import { IconChevron, IconSun } from "@/components/Icons";
import { AppMark } from "@/components/Logo";
import { usePrefs } from "@/components/PrefsProvider";
import { Scene } from "@/components/Scene";
import type { Prefs } from "@/lib/prefs";
import { activeOccurrence, localNow, nextOccurrence, parseTime, pickForPrefs, type MomentId } from "@/lib/schedule";

const GREETING: Record<MomentId, string> = { wake: "Bom dia", commute: "Bom caminho", midday: "Boa tarde", sleep: "Boa noite" };

export function TodayView({ affirmations, labels }: { affirmations: Affirmation[]; labels: Record<MomentId, string> }) {
  const { ready, prefs, imported } = usePrefs();
  const router = useRouter();

  useEffect(() => {
    if (ready && !prefs) router.replace("/comecar?next=/hoje");
  }, [ready, prefs, router]);

  if (!ready || !prefs) {
    return (
      <div aria-busy="true">
        <span className="sr-only">Carregando…</span>
        <div className="skeleton" style={{ height: 52, width: 200, marginTop: 14 }} />
        <div className="skeleton" style={{ height: 420, marginTop: 14, borderRadius: 24 }} />
      </div>
    );
  }
  return <Today prefs={prefs} affirmations={affirmations} labels={labels} imported={imported} />;
}

function Today({ prefs, affirmations, labels, imported }: { prefs: Prefs; affirmations: Affirmation[]; labels: Record<MomentId, string>; imported: boolean }) {
  const [now, setNow] = useState(() => Date.now());
  const [selected, setSelected] = useState<MomentId | null>(null);
  const { schedule, timeZone } = prefs;

  const local = localNow(timeZone, new Date(now));
  const active = activeOccurrence(schedule, local);
  const next = nextOccurrence(schedule, local);
  const shownMoment = selected ?? active.moment;
  const shownDay = shownMoment === active.moment ? active.day : local;
  const message = pickForPrefs(affirmations, shownMoment, shownDay, { types: prefs.types, includeQuotes: prefs.includeQuotes });
  const ordered = (Object.keys(schedule) as MomentId[]).sort((a, b) => parseTime(schedule[a])! - parseTime(schedule[b])!);
  const previewing = shownMoment !== active.moment;

  // Um único disparo na próxima troca; ao voltar para o app, recalcula.
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

  return (
    <>
      <header className="appbar">
        <div>
          <p className="caption" style={{ margin: 0 }}>
            {GREETING[active.moment]}
            {prefs.displayName ? `, ${prefs.displayName}` : ""}
          </p>
          <h1 className="screen-title">{previewing ? labels[shownMoment] : "Seu momento"}</h1>
        </div>
        <AppMark size={36} />
      </header>

      {imported && (
        <p className="alert alert-success" role="status">
          Suas preferências deste aparelho foram salvas na sua conta.
        </p>
      )}

      <article className="today-card" aria-live="polite" key={message.id}>
        <div className="today-art">
          <Scene moment={shownMoment} />
          <span className="pill">
            {!previewing && <span className="live" aria-hidden="true" />}
            {previewing ? "Prévia" : "Agora"} · {labels[shownMoment]}
          </span>
        </div>
        <div className="today-body">
          <p className="kicker">{message.theme}</p>
          <p className="affirmation-text">{message.text}</p>
          {message.citation ? (
            <>
              <p className="affirmation-source">{message.citation.author} · tradução do original</p>
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
            <p className="affirmation-source">Afirmação AURYA</p>
          )}
          <Link className="btn btn-primary btn-block" href={`/reflexao/${message.id}`}>
            Aprofundar
          </Link>
        </div>
      </article>

      <div className="next-row">
        {previewing ? (
          <button className="btn btn-text" style={{ paddingLeft: 0 }} onClick={() => setSelected(null)}>
            ← Voltar ao momento atual
          </button>
        ) : (
          <span>
            Próxima troca: <strong>{labels[next.moment]}</strong> às {schedule[next.moment]}
          </span>
        )}
      </div>

      <h2 className="section-title" id="seu-dia">
        <IconSun /> Seu dia
      </h2>
      <ul className="list timeline" aria-labelledby="seu-dia">
        {ordered.map((id) => (
          <li key={id}>
            <button className="row" aria-pressed={shownMoment === id} onClick={() => setSelected(id === active.moment ? null : id)}>
              <span className="thumb" aria-hidden="true">
                <Scene moment={id} />
              </span>
              <span className="row-main">
                <span className="row-title">{labels[id]}</span>
                {id === active.moment && <span className="badge">agora</span>}
              </span>
              <time className="row-value">{schedule[id]}</time>
              <IconChevron className="chev" />
            </button>
          </li>
        ))}
      </ul>
      <p className="caption" style={{ margin: "12px 2px 0" }}>
        Fuso {timeZone.replaceAll("_", " ")} · <Link href="/conta/horarios">Ajustar horários</Link>
      </p>
    </>
  );
}
