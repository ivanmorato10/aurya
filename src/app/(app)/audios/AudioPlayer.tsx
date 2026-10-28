"use client";

import { useEffect, useRef, useState } from "react";
import { AudioSession, type AudioStatus } from "@/lib/audio-session";
import type { AudioTheme, AudioTrack } from "@/lib/content";
import { IconPause, IconPlay, IconStop } from "@/components/Icons";
import { Scene } from "@/components/Scene";

const THEME_SCENE = { prosperity: "wake", wealth: "midday", gratitude: "sleep" } as const;

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
    <>
      <div className="segmented" role="group" aria-label="Tema">
        {themes.map((t) => (
          <button key={t.id} aria-pressed={theme === t.id} onClick={() => chooseTheme(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="artwork" data-playing={playing} aria-hidden="true">
        <Scene moment={THEME_SCENE[theme as keyof typeof THEME_SCENE] ?? "sleep"} />
        <span className="time">{mmss(view.remainingMs)}</span>
      </div>
      <p className="track-title">{track?.composition}</p>
      <p className="track-sub">
        Piano · afinação {track?.frequencyHz} Hz
      </p>

      <div className="controls">
        <button className="round round--ghost round--lg" onClick={() => session.current?.stop()} disabled={!(playing || view.status === "paused")} aria-label="Encerrar">
          <IconStop />
        </button>
        <button
          className="round round--xl"
          onClick={() => (playing ? session.current?.pause() : session.current?.play())}
          disabled={loading || !track}
          aria-label={playing ? "Pausar" : view.status === "paused" ? "Continuar" : "Reproduzir"}
        >
          {loading ? <span className="spinner" aria-hidden="true" /> : playing ? <IconPause /> : <IconPlay />}
        </button>
        <span style={{ width: 52 }} aria-hidden="true" />
      </div>
      <p className="caption player-status" role="status" style={{ textAlign: "center", whiteSpace: "normal" }}>
        {view.message}
      </p>

      <div className="field">
        <label htmlFor="volume">Volume · {Math.round(view.volume * 100)}%</label>
        <input id="volume" type="range" min={0} max={100} step={1} value={Math.round(view.volume * 100)} onChange={(e) => session.current?.setVolume(Number(e.target.value) / 100)} />
      </div>

      <h2 className="section-title">Sessão</h2>
      <ul className="list">
        <li>
          <label className="row" htmlFor="frequency">
            <span className="row-main row-title">Afinação</span>
            <select id="frequency" className="row-select" value={frequency} onChange={(e) => chooseFrequency(Number(e.target.value))}>
              {frequencies.map((hz) => (
                <option key={hz} value={hz}>
                  {hz} Hz
                </option>
              ))}
            </select>
          </label>
        </li>
        <li>
          <label className="row" htmlFor="melody">
            <span className="row-main row-title">Melodia</span>
            <select id="melody" className="row-select" value={trackId} onChange={(e) => setTrackId(e.target.value)}>
              {options.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.composition}
                </option>
              ))}
            </select>
          </label>
        </li>
        <li>
          <label className="row" htmlFor="timer">
            <span className="row-main row-title">Encerrar após</span>
            <select
              id="timer"
              className="row-select"
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
          </label>
        </li>
      </ul>
    </>
  );
}
