"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AudioSession, type AudioStatus } from "@/lib/audio-session";
import type { AudioTheme, AudioTrack } from "@/lib/content";
import { IMAGES, MELODY_IMAGES, trackImage, type ImageSlot } from "@/lib/images";
import { IconMore, IconNext, IconPrev, IconTimer, IconVolume, IconVolumeLow, IconWaves } from "@/components/Icons";
import { ProgressBar, RingButton } from "@/components/ui/AudioControls";
import { ChipGroup } from "@/components/ui/Chip";
import { Hero } from "@/components/ui/Hero";
import { MediaRow } from "@/components/ui/MediaRow";
import { Sheet, SheetSection } from "@/components/ui/Sheet";
import { Tabs } from "@/components/ui/Tabs";
import { BrandBar, CloseBar } from "@/components/ui/TopBar";
import { Scene } from "@/components/Scene";

type View = { status: AudioStatus; message: string; remainingMs: number; volume: number };
/** Uma entrada da biblioteca: tema + frequência; as melodias são escolhidas no player. */
type Entry = { key: string; theme: string; hz: number; image: ImageSlot };

const FREQUENCY_NOTE =
  "A frequência indica a afinação de referência da música, que contém várias notas. Os temas são uma escolha editorial, sem efeito financeiro, emocional ou terapêutico atribuído.";

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
  const [filter, setFilter] = useState<string>("all");
  const [current, setCurrent] = useState<{ entry: Entry; melody: string } | null>(null);
  const [playerOpen, setPlayerOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [minutes, setMinutes] = useState(defaultTimerMinutes);
  const [view, setView] = useState<View>({ status: "idle", message: "", remainingMs: defaultTimerMinutes * 60_000, volume: defaultVolume });

  const themeLabel = useMemo(() => Object.fromEntries(themes.map((t) => [t.id, t.label])), [themes]);
  const melodies = useMemo(() => [...new Set(tracks.map((t) => t.composition))], [tracks]);

  // Biblioteca: uma linha por tema × frequência (dados reais do catálogo).
  const entries = useMemo(() => {
    const seen = new Map<string, Entry>();
    const perTheme: Record<string, number> = {};
    for (const t of tracks) {
      const key = `${t.theme}-${t.frequencyHz}`;
      if (seen.has(key)) continue;
      const i = (perTheme[t.theme] = (perTheme[t.theme] ?? -1) + 1);
      seen.set(key, { key, theme: t.theme, hz: t.frequencyHz, image: trackImage(t.theme, i) });
    }
    const order = themes.map((t) => t.id);
    return [...seen.values()].sort((a, b) => order.indexOf(a.theme) - order.indexOf(b.theme) || a.hz - b.hz);
  }, [tracks, themes]);
  const visible = filter === "all" ? entries : entries.filter((e) => e.theme === filter);

  useEffect(() => {
    const s = new AudioSession(new Audio(), (x) => setView({ status: x.status, message: x.message, remainingMs: x.remainingMs, volume: x.volume }), {
      volume: defaultVolume,
      minutes: defaultTimerMinutes,
    });
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

  const trackFor = useCallback(
    (entry: Entry, melody: string) =>
      tracks.find((t) => t.theme === entry.theme && t.frequencyHz === entry.hz && t.composition === melody) ??
      tracks.find((t) => t.theme === entry.theme && t.frequencyHz === entry.hz)!,
    [tracks],
  );

  const load = (entry: Entry, melody: string, autoplay: boolean) => {
    const track = trackFor(entry, melody);
    setCurrent({ entry, melody: track.composition });
    session.current?.select(track.id, track.src);
    if (autoplay) void session.current?.play();
  };

  const playing = view.status === "playing";
  const loading = view.status === "loading";
  const isCurrent = (e: Entry) => current?.entry.key === e.key;
  const togglePlay = () => (playing ? session.current?.pause() : session.current?.play());

  const listOfCurrent = current ? entries.filter((e) => e.theme === current.entry.theme) : [];
  const indexOfCurrent = current ? listOfCurrent.findIndex((e) => e.key === current.entry.key) : -1;
  const step = (dir: 1 | -1) => {
    if (!current) return;
    const next = listOfCurrent[indexOfCurrent + dir];
    if (next) load(next, current.melody, playing);
  };

  const durationMs = minutes * 60_000;
  const volumePct = Math.round(view.volume * 100);

  return (
    <>
      <Hero image={IMAGES.opening} fallback="sleep" size="library" position="center 62%" top={<BrandBar />}>
        <h1 className="screen-display">Áudios</h1>
        <p className="screen-sub">Sons para uma mente mais presente.</p>
      </Hero>

      <Tabs label="Temas" value={filter} onChange={setFilter} items={[{ id: "all", label: "Todos" }, ...themes.map((t) => ({ id: t.id, label: t.label }))]} />

      <ul className="media-list" aria-label="Biblioteca de áudios">
        {visible.map((e) => (
          <MediaRow
            key={e.key}
            image={e.image}
            title={`Frequência ${e.hz} Hz`}
            meta={`${themeLabel[e.theme]} · ${melodies.length} melodias`}
            current={isCurrent(e)}
            onSelect={() => {
              if (!isCurrent(e)) load(e, current?.melody ?? melodies[0], false);
              setPlayerOpen(true);
            }}
            trailing={
              <RingButton
                playing={isCurrent(e) && playing}
                busy={isCurrent(e) && loading}
                label={isCurrent(e) && playing ? `Pausar ${e.hz} Hz` : `Ouvir ${e.hz} Hz`}
                onClick={() => (isCurrent(e) ? togglePlay() : load(e, current?.melody ?? melodies[0], true))}
              />
            }
          />
        ))}
      </ul>
      <p className="caption" style={{ margin: "16px 0 0" }}>
        Músicas instrumentais originais AURYA, em piano.
      </p>

      {/* O player vai direto para o <body>: fica acima da navegação inferior e de qualquer camada da tela. */}
      {playerOpen &&
        current &&
        createPortal(
        <div className="player" role="dialog" aria-modal="true" aria-label={`Player: ${current.melody}, ${current.entry.hz} Hz`}>
          <div className="player-inner">
            <div className="player-media" aria-hidden="true">
              {current.entry.image.src ? (
                <Image src={current.entry.image.src} alt="" fill sizes="(max-width: 480px) 100vw, 480px" style={{ objectFit: "cover" }} />
              ) : (
                <Scene moment="sleep" />
              )}
            </div>
            <CloseBar onClose={() => setPlayerOpen(false)} label="Fechar player" />

            <div className="player-info">
              <p className="overline">{themeLabel[current.entry.theme]}</p>
              <h2 className="player-title">{current.melody}</h2>
              <p className="player-meta">
                {current.entry.hz} Hz <span aria-hidden="true">·</span> {minutes} {minutes === 1 ? "minuto" : "minutos"}
              </p>
              <ProgressBar elapsedMs={durationMs - view.remainingMs} totalMs={durationMs} />
            </div>

            <div className="player-controls">
              <span style={{ width: 48 }} aria-hidden="true" />
              <button type="button" className="player-btn" onClick={() => step(-1)} disabled={indexOfCurrent <= 0} aria-label="Frequência anterior">
                <IconPrev />
              </button>
              <RingButton size="lg" playing={playing} busy={loading} onClick={togglePlay} label={playing ? "Pausar" : view.status === "paused" ? "Continuar" : "Reproduzir"} />
              <button type="button" className="player-btn" onClick={() => step(1)} disabled={indexOfCurrent >= listOfCurrent.length - 1} aria-label="Próxima frequência">
                <IconNext />
              </button>
              <span style={{ width: 48 }} aria-hidden="true" />
            </div>

            <div className="player-tools">
              <button type="button" className="player-btn" onClick={() => setSheetOpen(true)} aria-label="Temporizador">
                <IconTimer />
              </button>
              <button type="button" className="player-btn" onClick={() => setSheetOpen(true)} aria-label="Melodia">
                <IconWaves />
              </button>
              <button type="button" className="player-btn" onClick={() => setSheetOpen(true)} aria-label="Volume">
                <IconVolume />
              </button>
              <button type="button" className="player-btn" onClick={() => setSheetOpen(true)} aria-label="Configurações">
                <IconMore />
              </button>
            </div>
            <p className="player-status" role="status">
              {view.status === "error" || view.status === "ended" || view.status === "paused" ? view.message : ""}
            </p>
            <button type="button" className="player-handle" onClick={() => setSheetOpen(true)} aria-label="Abrir configurações">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" aria-hidden="true">
                <path d="M5.5 9l6.5 6.5L18.5 9" />
              </svg>
            </button>
          </div>

          <Sheet open={sheetOpen} onClose={() => setSheetOpen(false)} title="Configurações" subtitle="Personalize sua experiência.">
            <SheetSection label="Frequência" info={FREQUENCY_NOTE}>
              <ChipGroup
                grid
                label="Frequência"
                value={current.entry.hz}
                options={listOfCurrent.map((e) => ({ value: e.hz, label: `${e.hz} Hz` }))}
                onChange={(hz) => {
                  const e = listOfCurrent.find((x) => x.hz === hz);
                  if (e) load(e, current.melody, playing);
                }}
              />
            </SheetSection>
            <SheetSection label="Melodia" info="Composições originais em piano, com melodias e harmonias diferentes.">
              <div className="tiles" role="radiogroup" aria-label="Melodia">
                {melodies.map((m) => (
                  <button key={m} type="button" className="tile" role="radio" aria-checked={current.melody === m} onClick={() => load(current.entry, m, playing)}>
                    <span className="tile-media" aria-hidden="true">
                      {MELODY_IMAGES[m]?.src ? <Image src={MELODY_IMAGES[m].src!} alt="" fill sizes="120px" style={{ objectFit: "cover" }} /> : <Scene moment="sleep" />}
                    </span>
                    {m}
                  </button>
                ))}
              </div>
            </SheetSection>
            <SheetSection label="Temporizador" info="A reprodução termina sozinha ao fim do tempo escolhido.">
              <ChipGroup
                grid
                label="Temporizador"
                value={minutes}
                options={timerMinutes.map((m) => ({ value: m, label: `${m} min` }))}
                onChange={(m) => {
                  setMinutes(m);
                  session.current?.setTimer(m);
                }}
              />
            </SheetSection>
            <SheetSection label="Volume" info="Comece em volume baixo e ajuste com conforto.">
              <div className="volume">
                <IconVolumeLow />
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={1}
                  value={volumePct}
                  aria-label={`Volume ${volumePct}%`}
                  style={{ "--pct": `${volumePct}%` } as React.CSSProperties}
                  onChange={(e) => session.current?.setVolume(Number(e.target.value) / 100)}
                />
                <IconVolume />
              </div>
            </SheetSection>
            <button type="button" className="btn btn-primary btn-block" onClick={() => setSheetOpen(false)}>
              Salvar configurações
            </button>
          </Sheet>
        </div>,
          document.body,
        )}
    </>
  );
}
