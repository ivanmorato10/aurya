import type { Metadata } from "next";
import { CATEGORIES } from "@/lib/content";
import { SettingsHome } from "./SettingsHome";

export const metadata: Metadata = { title: "Ajustes" };

export default function ContaPage() {
  return <SettingsHome categories={CATEGORIES} />;
}
