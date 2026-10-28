import type { Metadata } from "next";
import { AppHeader } from "@/components/ui/AppHeader";
import { ScheduleForm } from "@/components/SettingsForms";
import { MomentNotifications } from "@/components/MomentNotifications";
import { AFFIRMATIONS, MOMENTS } from "@/lib/content";
import { timeZoneList } from "@/lib/timezones";

export const metadata: Metadata = { title: "Horários" };

export default function HorariosPage() {
  return (
    <>
      <AppHeader back="/conta" title="Meus horários" />
      <h1 className="large-title" style={{ marginTop: 24 }}>Quatro momentos do seu dia</h1>
      <p className="body-2" style={{ marginBottom: 24 }}>
        Defina os horários em que deseja receber suas afirmações. Cada frase fica com você até o próximo momento.
      </p>
      <ScheduleForm moments={MOMENTS} timeZones={timeZoneList()} />
      <MomentNotifications affirmations={AFFIRMATIONS} showSettings />
    </>
  );
}
