"use client";

import { useEffect, useRef, useState } from "react";
import { NarrationSession, type NarrationStatus } from "@/lib/narration";
import { IconPause, IconPlay, IconStop } from "@/components/Icons";

const AMBIENCE_VOLUME = 0.16;

export function ReflectionPlayer({ title, chunks, ambienceSrc }: { title: string; chunks: string[]; ambienceSrc: string }) {
  const session = useRef<NarrationSession | null>(null);
  const ambience = useRef<HTMLAudioElement | null>(null);
  const fade = useRef<ReturnType<typeof setInterval> | null>(null);
  const [status, setStatus] = useState<NarrationStatus>("idle");
  const [message, setMessage] = useState("Leitura pela voz do aparelho. Nada começa sozinho.");
  const [music, setMusic] = useState(true);
  const musicRef = useRef(music);

  useEffect(() => {
    musicRef.current = music;
  }, [music]);

  // Fundo musical acompanha a voz: sobe suave ao falar, desce ao pausar/parar.
  const fadeTo = (target: number, pauseAtEnd = false) => {
    const audio = ambience.current;
    if (!audio) return;
    if (fade.current) clearInterval(fade.current);
    const start = performance.now();
    const from = audio.volume;
    fade.current = setInterval(() => {
      const p = Math.min(1, (performance.now() - start) / 450);
      audio.volume = from + (target - from) * p;
      if (p === 1) {
        if (fade.current) clearInterval(fade.current);
        if (pauseAtEnd) audio.pause();
      }
    }, 30);
  };

  useEffect(() => {
    const narration = new NarrationSession((s) => {
      setStatus(s.status);
      setMessage(s.message);
      const audio = ambience.current;
      if (!audio) return;
      if (s.status === "speaking" && musicRef.current) {
        audio.play().catch(() => undefined);
        fadeTo(AMBIENCE_VOLUME);
      } else {
        fadeTo(0, true);
      }
    });
    session.current = narration;
    const stopAll = () => narration.stop();
    const onHide = () => document.visibilityState === "hidden" && stopAll();
    document.addEventListener("visibilitychange", onHide);
    window.addEventListener("pagehide", stopAll);
    return () => {
      document.removeEventListener("visibilitychange", onHide);
      window.removeEventListener("pagehide", stopAll);
      narration.stop(false);
      if (fade.current) clearInterval(fade.current);
      ambience.current?.pause();
    };
  }, []);

  const listen = () => {
    const narration = session.current;
    if (!narration) return;
    if (status === "paused") return narration.resume();
    // Prepara o áudio dentro do toque (exigência dos navegadores móveis), em silêncio.
    if (music && !ambience.current) {
      const audio = new Audio(ambienceSrc);
      audio.loop = true;
      audio.volume = 0;
      ambience.current = audio;
    }
    if (music) ambience.current?.play().then(() => {
      if (narration.status !== "speaking") ambience.current?.pause();
    }).catch(() => undefined);
    void narration.play(chunks);
  };

  const busy = status === "preparing";
  const active = status === "speaking" || status === "paused" || status === "preparing";

  const toggleMusic = (on: boolean) => {
    setMusic(on);
    if (!on) fadeTo(0, true);
    else if (status === "speaking") {
      ambience.current ??= Object.assign(new Audio(ambienceSrc), { loop: true, volume: 0 });
      ambience.current.play().catch(() => undefined);
      fadeTo(AMBIENCE_VOLUME);
    }
  };

  return (
    <>
      <label className="inline-toggle" htmlFor="music">
        <span>
          <span style={{ display: "block" }}>Piano durante a leitura</span>
          <span className="caption">Música instrumental suave ao fundo.</span>
        </span>
        <span className="switch">
          <input id="music" type="checkbox" role="switch" checked={music} onChange={(e) => toggleMusic(e.target.checked)} />
          <span />
        </span>
      </label>
      <section className="player-bar" aria-label="Ouvir a reflexão">
        <div className="player-info">
          <p className="row-title" style={{ margin: 0 }}>
            {title}
          </p>
          <p className="player-status" role="status">
            {status === "speaking" && (
              <span className="wave" aria-hidden="true">
                <span />
                <span />
                <span />
              </span>
            )}
            {message}
          </p>
        </div>
        {active && (
          <button className="round round--ghost" onClick={() => session.current?.stop()} aria-label="Parar">
            <IconStop />
          </button>
        )}
        {status === "speaking" ? (
          <button className="round" onClick={() => session.current?.pause()} aria-label="Pausar">
            <IconPause />
          </button>
        ) : (
          <button className="round" onClick={listen} disabled={busy} aria-label={status === "paused" ? "Continuar" : "Ouvir"}>
            {busy ? <span className="spinner" aria-hidden="true" /> : <IconPlay />}
          </button>
        )}
      </section>
    </>
  );
}
