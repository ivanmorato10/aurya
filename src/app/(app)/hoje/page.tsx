import type { Metadata } from "next";
import { AFFIRMATIONS, MOMENT_LABEL } from "@/lib/content";
import { TodayView } from "./TodayView";

export const metadata: Metadata = { title: "Hoje" };

export default function HojePage() {
  return <TodayView affirmations={AFFIRMATIONS} labels={MOMENT_LABEL} />;
}
