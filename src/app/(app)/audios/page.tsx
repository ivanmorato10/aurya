import type { Metadata } from "next";
import { AUDIO } from "@/lib/content";
import { AudioPlayer } from "./AudioPlayer";

export const metadata: Metadata = { title: "Áudios" };

export default function AudiosPage() {
  return (
    <>
      <header className="appbar">
        <h1 className="screen-title">Áudios</h1>
      </header>
      <AudioPlayer
        themes={AUDIO.themes}
        tracks={AUDIO.tracks}
        timerMinutes={AUDIO.timerMinutes}
        defaultTimerMinutes={AUDIO.defaultTimerMinutes}
        defaultVolume={AUDIO.defaultVolume}
      />
      <p className="caption" style={{ margin: "18px 4px 0" }}>
        Músicas instrumentais originais. A frequência indica a afinação de referência; os temas são uma escolha editorial, sem efeito
        financeiro ou terapêutico atribuído.
      </p>
    </>
  );
}
