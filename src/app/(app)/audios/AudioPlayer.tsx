"use client";

import { useEffect, useRef, useState } from "react";
import { AudioSession, type AudioStatus } from "@/lib/audio-session";
import type { AudioTheme, AudioTrack } from "@/lib/content";
import Image from "next/image";
import { IconStop } from "@/components/Icons";
import { PlayButton, ProgressBar } from "@/components/ui/AudioControls";
import { Scene } from "@/components/Scene";
import { IMAGES } from "@/lib/images";

type View = { status: AudioStatus; message: string; remainingMs: number; volume: number };

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
  const durationMs = minutes * 60_000;
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
        {IMAGES.player.src ? <Image src={IMAGES.player.src} alt="" fill sizes="(max-width: 480px) 90vw, 420px" style={{ objectFit: "cover" }} /> : <Scene moment="sleep" />}
      </div>

      <div className="track">
        <p className="track-title">Frequência {track?.frequencyHz} Hz</p>
        <p className="track-sub">{track?.composition} · piano instrumental</p>
      </div>

      <ProgressBar elapsedMs={durationMs - view.remainingMs} totalMs={durationMs} />

      <div className="controls">
        <button className="round round--ghost round--lg" onClick={() => session.current?.stop()} disabled={!(playing || view.status === "paused")} aria-label="Encerrar">
          <IconStop />
        </button>
        <PlayButton
          playing={playing}
          busy={loading || !track}
          onClick={() => (playing ? session.current?.pause() : session.current?.play())}
          label={playing ? "Pausar" : view.status === "paused" ? "Continuar" : "Reproduzir"}
        />
        <span className="round--lg" aria-hidden="true" />
      </div>
      <p className="caption player-status" role="status" style={{ textAlign: "center", whiteSpace: "normal" }}>
        {view.message}
      </p>

      <details className="about">
        <summary>Sobre esta frequência</summary>
        <p>
          {track?.frequencyHz} Hz indica a afinação de referência desta música, que contém várias notas. Os temas são uma escolha
          editorial: não atribuímos efeito financeiro, emocional ou terapêutico a uma frequência.
        </p>
      </details>

      <h2 className="section-title">Sessão</h2>
      <ul className="list">
        <li>
          <label className="row" htmlFor="frequency">
            <span className="row-main row-title">Frequência</span>
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
        <li>
          <div className="row" style={{ display: "grid", gap: 4 }}>
            <label htmlFor="volume" className="row-title">
              Volume · {Math.round(view.volume * 100)}%
            </label>
            <input id="volume" type="range" min={0} max={100} step={1} value={Math.round(view.volume * 100)} onChange={(e) => session.current?.setVolume(Number(e.target.value) / 100)} />
          </div>
        </li>
      </ul>
    </>
  );
}
