"use client";

import { MomentIcon } from "@/components/Icons";
import { usePrefs } from "@/components/PrefsProvider";
import type { MomentId } from "@/lib/schedule";

/** Ícone, nome e horário do momento (o horário vem das preferências da pessoa). */
export function MomentHeading({ moment, label }: { moment: MomentId; label: string }) {
  const { prefs } = usePrefs();
  return (
    <div className="home-moment" style={{ marginTop: 0 }}>
      <MomentIcon moment={moment} className="moment-icon" />
      <p className="home-moment-name">{label}</p>
      {prefs && <p className="home-moment-time">{prefs.schedule[moment]}</p>}
    </div>
  );
}
