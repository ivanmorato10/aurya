"use client";

import { useEffect, useRef, useState } from "react";
import { NarrationSession, type NarrationStatus } from "@/lib/narration";

const AMBIENCE_VOLUME = 0.16;

export function ReflectionPlayer({ chunks, ambienceSrc }: { chunks: string[]; ambienceSrc: string }) {
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

  return (
    <section className="player stack" aria-label="Ouvir a reflexão">
      <div className="btn-row">
        <button className="btn btn-primary" onClick={listen} disabled={busy || status === "speaking"}>
          {busy ? <span className="spinner" aria-hidden="true" /> : null}
          {status === "paused" ? "Continuar" : busy ? "Preparando…" : "Ouvir"}
        </button>
        <button className="btn" onClick={() => session.current?.pause()} disabled={status !== "speaking"}>
          Pausar
        </button>
        <button className="btn" onClick={() => session.current?.stop()} disabled={!active}>
          Parar
        </button>
      </div>
      <p className="note player-status" role="status">
        {message}
      </p>
      <label className="note" style={{ display: "flex", gap: 10, alignItems: "center", margin: 0 }}>
        <input
          type="checkbox"
          checked={music}
          onChange={(e) => {
            setMusic(e.target.checked);
            if (!e.target.checked) fadeTo(0, true);
            else if (status === "speaking") {
              ambience.current ??= Object.assign(new Audio(ambienceSrc), { loop: true, volume: 0 });
              ambience.current.play().catch(() => undefined);
              fadeTo(AMBIENCE_VOLUME);
            }
          }}
          style={{ width: 20, height: 20, minHeight: 0, accentColor: "var(--gold)" }}
        />
        Piano suave durante a leitura
      </label>
    </section>
  );
}
