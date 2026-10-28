"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AudioSession, type AudioStatus } from "@/lib/audio-session";
import type { AudioTheme, AudioTrack } from "@/lib/content";
import { PlayButton, ProgressBar } from "@/components/ui/AudioControls";

type View = { status: AudioStatus; message: string; remainingMs: number; volume: number };
const photos = ["/images/moments/commute.webp", "/images/moments/midday.webp", "/images/player.webp"];

export function AudioPlayer({ themes, tracks, timerMinutes, defaultTimerMinutes, defaultVolume }: {
  themes: AudioTheme[]; tracks: AudioTrack[]; timerMinutes: number[]; defaultTimerMinutes: number; defaultVolume: number;
}) {
  const session = useRef<AudioSession | null>(null);
  const [filter, setFilter] = useState("all");
  const [trackId, setTrackId] = useState(tracks[0]?.id);
  const [playerOpen, setPlayerOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [minutes, setMinutes] = useState(defaultTimerMinutes);
  const [view, setView] = useState<View>({ status:"idle", message:"Pronto para ouvir.", remainingMs:defaultTimerMinutes * 60000, volume:defaultVolume });

  useEffect(() => {
    const s = new AudioSession(new Audio(), x => setView({ status:x.status, message:x.message, remainingMs:x.remainingMs, volume:x.volume }), { volume:defaultVolume, minutes:defaultTimerMinutes });
    session.current = s;
    const onHide = () => { if (document.visibilityState === "hidden" && (s.status === "playing" || s.status === "loading")) s.pause("Pausado ao sair do app."); };
    document.addEventListener("visibilitychange", onHide);
    return () => { document.removeEventListener("visibilitychange", onHide); s.dispose(); session.current = null; };
  }, [defaultVolume, defaultTimerMinutes]);

  const track = tracks.find(t => t.id === trackId);
  const themeTracks = tracks.filter(t => t.theme === track?.theme);
  const frequencies = [...new Set(themeTracks.map(t => t.frequencyHz))];
  const melodies = themeTracks.filter(t => t.frequencyHz === track?.frequencyHz);
  const shown = tracks.filter(t => (filter === "all" || t.theme === filter) && t.composition === "Aurora");
  const library = shown.length ? shown : tracks.filter(t => filter === "all" || t.theme === filter).filter((t,i,a) => a.findIndex(x => x.frequencyHz === t.frequencyHz) === i);
  const playing = view.status === "playing";
  const imageFor = (t: AudioTrack) => photos[Math.max(0, themes.findIndex(x => x.id === t.theme)) % photos.length];
  const choose = (id: string) => { setTrackId(id); setPlayerOpen(true); setSettingsOpen(false); };
  const changeFrequency = (hz: number) => { const t = themeTracks.find(x => x.frequencyHz === hz); if (t) setTrackId(t.id); };
  const advance = (delta: number) => { const i = tracks.findIndex(t => t.id === trackId); setTrackId(tracks[(i + delta + tracks.length) % tracks.length]?.id); };

  useEffect(() => { if (track) session.current?.select(track.id, track.src); }, [track]);
  useEffect(() => {
    if (!playerOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { setSettingsOpen(false); setPlayerOpen(false); } };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [playerOpen]);

  return <div className="aurya-v2">
    <header className="aurya-v2-cover">
      <Image src="/images/moments/commute.webp" alt="Oceano ao entardecer" fill priority sizes="(max-width: 480px) 100vw, 480px" />
      <span className="aurya-v2-brand">A U R Y A</span>
      <div className="aurya-v2-cover-text"><h1>Áudios</h1><p>Sons para uma mente mais presente.</p></div>
    </header>
    <div className="aurya-v2-library">
      <div className="aurya-v2-filters" role="group" aria-label="Temas">
        <button type="button" aria-pressed={filter === "all"} onClick={() => setFilter("all")}>Todos</button>
        {themes.map(t => <button type="button" key={t.id} aria-pressed={filter === t.id} onClick={() => setFilter(t.id)}>{t.label}</button>)}
      </div>
      <div className="aurya-v2-list">{library.map(t => <button type="button" key={t.id} className="aurya-v2-item" onClick={() => choose(t.id)}>
        <span className="aurya-v2-thumb"><Image src={imageFor(t)} alt="" fill sizes="80px" /></span>
        <span className="aurya-v2-item-text"><strong>{themes.find(x => x.id === t.theme)?.label}</strong><small>{t.composition} · {t.frequencyHz} Hz</small></span>
        <span className="aurya-v2-play" aria-hidden="true">▶</span>
      </button>)}</div>
      <p className="aurya-v2-note">Músicas instrumentais originais AURYA.</p>
    </div>
    {playerOpen && track && <section className="aurya-v2-player" role="dialog" aria-modal="true" aria-label="Reprodutor de áudio">
      <Image src={imageFor(track)} alt="" fill priority sizes="100vw" className="aurya-v2-player-image" />
      <div className="aurya-v2-player-gradient" />
      <div className="aurya-v2-player-top"><button type="button" aria-label="Fechar player" onClick={() => {setSettingsOpen(false);setPlayerOpen(false);}}>⌄</button><span>A U R Y A</span><span /></div>
      <div className="aurya-v2-player-body">
        <p className="aurya-v2-kicker">{themes.find(x => x.id === track.theme)?.label}</p>
        <h2>{track.composition}</h2><p>{track.frequencyHz} Hz · Piano instrumental</p>
        <ProgressBar elapsedMs={minutes * 60000 - view.remainingMs} totalMs={minutes * 60000} />
        <div className="aurya-v2-controls">
          <button type="button" onClick={() => advance(-1)} aria-label="Faixa anterior">❮</button>
          <PlayButton playing={playing} busy={view.status === "loading"} onClick={() => playing ? session.current?.pause() : session.current?.play()} label={playing ? "Pausar" : "Reproduzir"} />
          <button type="button" onClick={() => advance(1)} aria-label="Próxima faixa">❯</button>
        </div>
        <div className="aurya-v2-actions">
          <button type="button" disabled={!(playing || view.status === "paused")} onClick={() => session.current?.stop()}>Encerrar</button>
          <button type="button" onClick={() => setSettingsOpen(true)}>Configurações de áudio ⌃</button>
        </div>
        <p className="aurya-v2-status" role="status">{view.message}</p>
      </div>
    </section>}
    {playerOpen && settingsOpen && track && <div className="aurya-v2-sheet-backdrop" onClick={() => setSettingsOpen(false)}>
      <section className="aurya-v2-sheet" role="dialog" aria-modal="true" aria-label="Configurações de áudio" onClick={e => e.stopPropagation()}>
        <button type="button" className="aurya-v2-sheet-close" onClick={() => setSettingsOpen(false)} aria-label="Fechar">⌄</button>
        <h2>Configurações</h2><p>Personalize sua experiência.</p>
        <div className="aurya-v2-setting"><h3>Frequência</h3><div>{frequencies.map(hz => <button type="button" key={hz} aria-pressed={track.frequencyHz === hz} onClick={() => changeFrequency(hz)}>{hz} Hz</button>)}</div></div>
        <div className="aurya-v2-setting"><h3>Melodia</h3><div>{melodies.map(t => <button type="button" key={t.id} aria-pressed={trackId === t.id} onClick={() => setTrackId(t.id)}>{t.composition}</button>)}</div></div>
        <div className="aurya-v2-setting"><h3>Temporizador</h3><div>{timerMinutes.map(m => <button type="button" key={m} aria-pressed={minutes === m} onClick={() => {setMinutes(m);session.current?.setTimer(m);}}>{m} min</button>)}</div></div>
        <div className="aurya-v2-setting"><label htmlFor="aurya-v2-volume">Volume · {Math.round(view.volume * 100)}%</label><input id="aurya-v2-volume" type="range" min={0} max={100} value={Math.round(view.volume * 100)} onChange={e => session.current?.setVolume(Number(e.target.value) / 100)} /></div>
        <details className="aurya-v2-disclosure"><summary>Sobre as frequências</summary><p>As frequências são referências musicais, sem efeitos terapêuticos ou financeiros comprovados.</p></details>
        <button type="button" className="aurya-v2-done" onClick={() => setSettingsOpen(false)}>Concluir</button>
      </section>
    </div>}
  </div>;
}
