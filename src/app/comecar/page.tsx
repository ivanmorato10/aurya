import type { Metadata } from "next";
import { PublicFrame } from "@/components/PublicFrame";
import { ProfileForm } from "@/components/ProfileForm";
import { requireProfile } from "@/lib/auth";
import { MOMENTS } from "@/lib/content";
import { EXAMPLE_SCHEDULE } from "@/lib/schedule";
import { timeZoneList } from "@/lib/timezones";
import { safeNextPath } from "@/lib/validation";
import { Aury } from "@/components/Aury";
import { Aura } from "@/components/Decor";

export const metadata: Metadata = { title: "Seus momentos" };

export default async function ComecarPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const next = safeNextPath((await searchParams).next);
  const profile = await requireProfile("/comecar");
  const schedule = profile.schedule ?? EXAMPLE_SCHEDULE;
  return (
    <PublicFrame>
      <div className="hero-stage" style={{ height: 170 }}>
        <Aura rings={3} start={130} step={36} />
        <Aury moment="wake" size={120} />
      </div>
      <span className="eyebrow">Primeiro passo</span>
      <h1>
        Quatro momentos.
        <br />
        Um ritmo <span className="hl">seu</span>.
      </h1>
      <p className="lead">
        Os horários abaixo são sugestões. Ajuste ao seu dia: são as trocas de frase, não alarmes nem notificações.
      </p>
      <ProfileForm
        intent="onboarding"
        next={next}
        moments={MOMENTS}
        timeZones={timeZoneList(profile.timeZone)}
        detectTimeZone={!profile.schedule}
        initial={{ displayName: profile.displayName ?? "", timeZone: profile.timeZone, ...schedule }}
      />
    </PublicFrame>
  );
}
