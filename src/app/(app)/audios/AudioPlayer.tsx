"use client";

import { useEffect, useRef, useState } from "react";
import { AudioSession, type AudioStatus } from "@/lib/audio-session";
import type { AudioTheme, AudioTrack } from "@/lib/content";

type View = { status: AudioStatus; message: string; remainingMs: number; volume: number };

const mmss = (ms: number) => {
  const total = Math.ceil(ms / 1000);
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
};

export function AudioPlayer({
  themes,
  tracks,
  timerMinutes,
  defaultTimerMinutes,
  defaultVolume,
}: {
  themes: AudioTheme[];
  tracks: AudioTrack[];
  timerMinutes: number[];
  defaultTimerMinutes: number;
  defaultVolume: number;
}) {
  const session = useRef<AudioSession | null>(null);
  const [theme, setTheme] = useState(themes[0].id);
  const themeTracks = tracks.filter((t) => t.theme === theme);
  const frequencies = [...new Set(themeTracks.map((t) => t.frequencyHz))];
  const [frequency, setFrequency] = useState(frequencies[0]);
  const options = themeTracks.filter((t) => t.frequencyHz === frequency);
  const [trackId, setTrackId] = useState<string | undefined>(options[0]?.id);
  const [minutes, setMinutes] = useState(defaultTimerMinutes);
  const [view, setView] = useState<View>({
    status: "idle",
    message: "Escolha uma faixa e toque em Reproduzir.",
    remainingMs: defaultTimerMinutes * 60_000,
    volume: defaultVolume,
  });

  useEffect(() => {
    const s = new AudioSession(
      new Audio(),
      (x) => setView({ status: x.status, message: x.message, remainingMs: x.remainingMs, volume: x.volume }),
      { volume: defaultVolume, minutes: defaultTimerMinutes },
    );
    session.current = s;
    const onHide = () => {
      if (document.visibilityState === "hidden" && (s.status === "playing" || s.status === "loading")) s.pause("Pausado ao sair do app.");
    };
    document.addEventListener("visibilitychange", onHide);
    return () => {
      document.removeEventListener("visibilitychange", onHide);
      s.dispose();
    };
  }, [defaultVolume, defaultTimerMinutes]);

  const track = tracks.find((t) => t.id === trackId);
  useEffect(() => {
    if (track) session.current?.select(track.id, track.src);
  }, [track]);

  const chooseTheme = (id: string) => {
    const first = tracks.find((t) => t.theme === id);
    setTheme(id);
    if (first) {
      setFrequency(first.frequencyHz);
      setTrackId(first.id);
    }
  };
  const chooseFrequency = (hz: number) => {
    setFrequency(hz);
    setTrackId(themeTracks.find((t) => t.frequencyHz === hz)?.id);
  };

  const playing = view.status === "playing";
  const loading = view.status === "loading";

  return (
    <div className="stack">
      <div className="chips" role="group" aria-label="Tema">
        {themes.map((t) => (
          <button key={t.id} className="chip" aria-pressed={theme === t.id} onClick={() => chooseTheme(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      <section className="card stack" aria-label="Player">
        <div style={{ textAlign: "center" }}>
          <div className="disc-wrap" data-playing={playing} aria-hidden="true">
            <span className="ripple" />
            <span className="ripple" />
            <div className="disc" data-playing={playing} />
          </div>
          <div className="countdown" aria-hidden="true">
            {mmss(view.remainingMs)}
          </div>
          <p className="small" style={{ margin: 0 }}>
            {track ? `${track.composition} · ${track.frequencyHz} Hz` : ""}
          </p>
        </div>

        <div className="btn-row">
          <button
            className="btn btn-primary"
            onClick={() => (playing ? session.current?.pause() : session.current?.play())}
            disabled={loading || !track}
          >
            {loading ? <span className="spinner" aria-hidden="true" /> : null}
            {playing ? "Pausar" : view.status === "paused" ? "Continuar" : loading ? "Carregando…" : "Reproduzir"}
          </button>
          <button className="btn" onClick={() => session.current?.stop()} disabled={!(playing || view.status === "paused")}>
            Encerrar
          </button>
        </div>
        <p className="note player-status" role="status" style={{ margin: 0 }}>
          {view.message}
        </p>

        <div className="field">
          <label htmlFor="volume">Volume · {Math.round(view.volume * 100)}%</label>
          <input
            id="volume"
            type="range"
            min={0}
            max={100}
            step={1}
            value={Math.round(view.volume * 100)}
            onChange={(e) => session.current?.setVolume(Number(e.target.value) / 100)}
          />
        </div>

        <div className="field">
          <label htmlFor="frequency">Afinação de referência</label>
          <select id="frequency" value={frequency} onChange={(e) => chooseFrequency(Number(e.target.value))}>
            {frequencies.map((hz) => (
              <option key={hz} value={hz}>
                {hz} Hz
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="melody">Melodia</label>
          <select id="melody" value={trackId} onChange={(e) => setTrackId(e.target.value)}>
            {options.map((t) => (
              <option key={t.id} value={t.id}>
                {t.composition}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="timer">Encerrar após</label>
          <select
            id="timer"
            value={minutes}
            onChange={(e) => {
              const m = Number(e.target.value);
              setMinutes(m);
              session.current?.setTimer(m);
            }}
          >
            {timerMinutes.map((m) => (
              <option key={m} value={m}>
                {m} {m === 1 ? "minuto" : "minutos"}
              </option>
            ))}
          </select>
        </div>
      </section>
    </div>
  );
}
