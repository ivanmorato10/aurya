import type { Metadata } from "next";
import { AFFIRMATIONS, MOMENTS } from "@/lib/content";
import { AffirmationLibrary } from "./AffirmationLibrary";

export const metadata: Metadata = { title: "Afirmações" };

export default function AfirmacoesPage() {
  return <AffirmationLibrary affirmations={AFFIRMATIONS} moments={MOMENTS} />;
}
