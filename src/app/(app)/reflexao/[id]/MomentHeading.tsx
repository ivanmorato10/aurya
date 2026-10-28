"use client";

import { MomentIcon } from "@/components/Icons";
import { usePrefs } from "@/components/PrefsProvider";
import type { MomentId } from "@/lib/schedule";

/** Ícone, nome e horário do momento (o horário vem das preferências da pessoa). */
export function MomentHeading({ moment, label }: { moment: MomentId; label: string }) {
  const { prefs } = usePrefs();
  return (
    <div className="moment-line">
      <MomentIcon moment={moment} />
      <p className="overline">
        {label}
        {prefs ? ` · ${prefs.schedule[moment]}` : ""}
      </p>
    </div>
  );
}
