import type { Metadata } from "next";
import { PublicFrame } from "@/components/PublicFrame";
import { ProfileForm } from "@/components/ProfileForm";
import { requireProfile } from "@/lib/auth";
import { MOMENTS } from "@/lib/content";
import { EXAMPLE_SCHEDULE } from "@/lib/schedule";
import { timeZoneList } from "@/lib/timezones";
import { safeNextPath } from "@/lib/validation";

export const metadata: Metadata = { title: "Seus momentos" };

export default async function ComecarPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const next = safeNextPath((await searchParams).next);
  const profile = await requireProfile("/comecar");
  const schedule = profile.schedule ?? EXAMPLE_SCHEDULE;
  return (
    <PublicFrame>
      <span className="eyebrow">Primeiro passo</span>
      <h1>
        Quatro momentos.
        <br />
        Um ritmo seu.
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
