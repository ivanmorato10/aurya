import type { Metadata } from "next";
import { NavBar } from "@/components/Screen";
import { MessagesForm } from "@/components/SettingsForms";
import { CATEGORIES } from "@/lib/content";

export const metadata: Metadata = { title: "Tipos de mensagem" };

export default function MensagensPage() {
  return (
    <>
      <NavBar back="/conta" />
      <h1 className="large-title">Tipos de mensagem</h1>
      <p className="body-2" style={{ marginBottom: 20 }}>
        Escolha o que você quer receber ao longo do dia.
      </p>
      <MessagesForm categories={CATEGORIES} />
    </>
  );
}
