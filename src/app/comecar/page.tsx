import type { Metadata } from "next";
import { AppFrame } from "@/components/Screen";
import { CATEGORIES, MOMENTS } from "@/lib/content";
import { timeZoneList } from "@/lib/timezones";
import { safeNextPath } from "@/lib/validation";
import { OnboardingWizard } from "./OnboardingWizard";

export const metadata: Metadata = { title: "Seus momentos" };

export default async function ComecarPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const next = safeNextPath((await searchParams).next);
  return (
    <AppFrame>
      <OnboardingWizard next={next} moments={MOMENTS} categories={CATEGORIES} timeZones={timeZoneList()} />
    </AppFrame>
  );
}
