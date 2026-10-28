"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { Affirmation } from "@/lib/content";
import { IconChevron, MomentIcon } from "@/components/Icons";
import { usePrefs } from "@/components/PrefsProvider";
import { RingButton } from "@/components/ui/AudioControls";
import { Hero } from "@/components/ui/Hero";
import { MediaRow } from "@/components/ui/MediaRow";
import { LoadingState } from "@/components/ui/StateMessage";
import { BrandBar } from "@/components/ui/TopBar";
import { MOMENT_IMAGES } from "@/lib/images";
import { NarrationSession, type NarrationStatus } from "@/lib/narration";
import type { Prefs } from "@/lib/prefs";
import { activeOccurrence, localNow, nextOccurrence, parseTime, pickForPrefs, type MomentId } from "@/lib/schedule";

export function TodayView({ affirmations, labels }: { affirmations: Affirmation[]; labels: Record<MomentId, string> }) {
  const { ready, prefs, imported } = usePrefs();
  const router = useRouter();

  useEffect(() => {
    if (ready && !prefs) router.replace("/comecar?next=/hoje");
  }, [ready, prefs, router]);

  if (!ready || !prefs) return <LoadingState height={480} />;
  return <Home prefs={prefs} affirmations={affirmations} labels={labels} imported={imported} />;
}

function Home({ prefs, affirmations, labels, imported }: { prefs: Prefs; affirmations: Affirmation[]; labels: Record<MomentId, string>; imported: boolean }) {
  const [now, setNow] = useState(() => Date.now());
  const [selected, setSelected] = useState<MomentId | null>(null);
  const { schedule, timeZone } = prefs;

  const local = localNow(timeZone, new Date(now));
  const active = activeOccurrence(schedule, local);
  const next = nextOccurrence(schedule, local);
  const shown = selected ?? active.moment;
  const shownDay = shown === active.moment ? active.day : local;
  const message = pickForPrefs(affirmations, shown, shownDay, { types: prefs.types, includeQuotes: prefs.includeQuotes });
  const ordered = (Object.keys(schedule) as MomentId[]).sort((a, b) => parseTime(schedule[a])! - parseTime(schedule[b])!);
  const previewing = shown !== active.moment;

  // Um único disparo na próxima troca de momento; ao voltar para o app, recalcula.
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
      <Hero
        image={MOMENT_IMAGES[shown]}
        fallback={shown}
        size="tall"
        top={<BrandBar />}
      >
        <div className="moment-line" key={`m-${shown}`}>
          <MomentIcon moment={shown} />
          <p className="overline">
            {previewing ? "Prévia · " : ""}
            {labels[shown]} · {schedule[shown]}
          </p>
        </div>
        <Link href={`/reflexao/${message.id}`} className="home-affirmation-link" aria-label={`${message.text} — abrir aprofundamento`}>
          <h1 id="afirmacao" className="home-affirmation" key={message.id}>
            {message.text}
          </h1>
        </Link>
        {message.citation && <p className="home-source">{message.citation.author}, tradução do original</p>}
      </Hero>

      {imported && (
        <p className="alert alert-success" role="status">
          Suas preferências deste aparelho foram salvas na sua conta.
        </p>
      )}

      <div className="now-actions">
        <NarrationButton text={message.text} />
        <Link href={`/reflexao/${message.id}`} className="deepen-link">
          Aprofundar <IconChevron />
        </Link>
      </div>

      <h2 className="section-title">Seu dia</h2>
      <ul className="media-list" aria-label="Momentos do dia">
        {ordered.map((id) => (
          <MediaRow
            key={id}
            image={MOMENT_IMAGES[id]}
            fallback={id}
            title={labels[id]}
            meta={
              <>
                {schedule[id]}
                {id === active.moment && <span className="badge">agora</span>}
              </>
            }
            current={shown === id}
            onSelect={() => setSelected(id === active.moment ? null : id)}
          />
        ))}
      </ul>
    </>
  );
}

/** Lê a afirmação com a voz do aparelho (mesmo mecanismo do aprofundamento). */
function NarrationButton({ text }: { text: string }) {
  const session = useRef<NarrationSession | null>(null);
  const [status, setStatus] = useState<NarrationStatus>("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const s = new NarrationSession((x) => {
      setStatus(x.status);
      setMessage(x.message);
    });
    session.current = s;
    const stop = () => s.stop();
    const onHide = () => document.visibilityState === "hidden" && stop();
    document.addEventListener("visibilitychange", onHide);
    window.addEventListener("pagehide", stop);
    return () => {
      document.removeEventListener("visibilitychange", onHide);
      window.removeEventListener("pagehide", stop);
      s.stop(false);
    };
  }, []);

  // Trocar de frase interrompe a leitura anterior.
  useEffect(() => {
    session.current?.stop();
  }, [text]);

  const speaking = status === "speaking";
  const onClick = () => {
    const s = session.current;
    if (!s) return;
    if (speaking) s.pause();
    else if (status === "paused") s.resume();
    else void s.play([text]);
  };

  const visible = status === "unavailable" || status === "paused" ? message : "Voz do aparelho";
  return (
    <>
      <RingButton
        playing={speaking}
        busy={status === "preparing"}
        onClick={onClick}
        label={speaking ? "Pausar leitura da afirmação" : status === "paused" ? "Continuar leitura" : "Ouvir a afirmação"}
      />
      <span className="play-label">
        <strong>{speaking ? "Ouvindo" : "Ouvir"}</strong>
        <span className="play-status" role="status">
          {visible}
        </span>
      </span>
    </>
  );
}
