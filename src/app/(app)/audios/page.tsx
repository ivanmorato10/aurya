import type { Metadata } from "next";
import { requireReadyProfile } from "@/lib/auth";
import { AUDIO } from "@/lib/content";
import { AudioPlayer } from "./AudioPlayer";

export const metadata: Metadata = { title: "Áudios" };

export default async function AudiosPage() {
  await requireReadyProfile("/audios");
  return (
    <div>
      <span className="eyebrow">Áudios</span>
      <h1>
        Ouça no seu <span className="hl">ritmo</span>.
      </h1>
      <p className="lead">
        Músicas instrumentais originais de piano, organizadas pelos temas prosperidade, riqueza e gratidão. Comece com
        volume baixo.
      </p>
      <AudioPlayer
        themes={AUDIO.themes}
        tracks={AUDIO.tracks}
        timerMinutes={AUDIO.timerMinutes}
        defaultTimerMinutes={AUDIO.defaultTimerMinutes}
        defaultVolume={AUDIO.defaultVolume}
      />
      <p className="small section">
        A frequência indica a afinação de referência da música, que contém várias notas. Os temas são uma escolha
        editorial — não há efeito financeiro ou terapêutico atribuído a uma frequência.
      </p>
    </div>
  );
}
