import type { Metadata } from "next";
import { AppHeader } from "@/components/ui/AppHeader";
import { AUDIO } from "@/lib/content";
import { AudioPlayer } from "./AudioPlayer";

export const metadata: Metadata = { title: "Áudios" };

export default function AudiosPage() {
  return (
    <>
      
      <AudioPlayer
        themes={AUDIO.themes}
        tracks={AUDIO.tracks}
        timerMinutes={AUDIO.timerMinutes}
        defaultTimerMinutes={AUDIO.defaultTimerMinutes}
        defaultVolume={AUDIO.defaultVolume}
      />
      <p className="caption" style={{ margin: "18px 2px 0" }}>Músicas instrumentais originais AURYA.</p>
    </>
  );
}
