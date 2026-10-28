import type { Metadata } from "next";
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
    </>
  );
}
