import type { Metadata } from "next";
import { requireReadyProfile } from "@/lib/auth";
import { AFFIRMATIONS, MOMENT_LABEL } from "@/lib/content";
import { TodayView } from "./TodayView";

const requestTime = () => Date.now();

export const metadata: Metadata = { title: "Hoje" };

export default async function HojePage() {
  const profile = await requireReadyProfile("/hoje");
  // Página dinâmica (lê a sessão): o horário do pedido define a frase inicial.
  const serverNow = requestTime();
  return (
    <TodayView
      name={profile.displayName}
      schedule={profile.schedule}
      timeZone={profile.timeZone}
      affirmations={AFFIRMATIONS}
      labels={MOMENT_LABEL}
      serverNow={serverNow}
    />
  );
}
