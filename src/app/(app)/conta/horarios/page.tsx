import type { Metadata } from "next";
import { NavBar } from "@/components/Screen";
import { ScheduleForm } from "@/components/SettingsForms";
import { MOMENTS } from "@/lib/content";
import { timeZoneList } from "@/lib/timezones";

export const metadata: Metadata = { title: "Horários" };

export default function HorariosPage() {
  return (
    <>
      <NavBar back="/conta" />
      <h1 className="large-title">Horários</h1>
      <p className="body-2" style={{ marginBottom: 20 }}>
        Cada frase aparece no início do momento e fica até o próximo.
      </p>
      <ScheduleForm moments={MOMENTS} timeZones={timeZoneList()} />
    </>
  );
}
