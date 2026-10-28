import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Showcase } from "./Showcase";

export const metadata: Metadata = { title: "Design System", robots: { index: false } };

// Vitrine interna para revisão do Design System. Não existe em produção.
export default function DesignSystemPage() {
  if (process.env.NODE_ENV === "production" && process.env.SHOW_DESIGN_SYSTEM !== "1") notFound();
  return <Showcase />;
}
