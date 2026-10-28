import type { Metadata } from "next";
import { AppHeader } from "@/components/ui/AppHeader";
import { MessagesForm } from "@/components/SettingsForms";
import { CATEGORIES } from "@/lib/content";

export const metadata: Metadata = { title: "Tipos de mensagem" };

export default function MensagensPage() {
  return (
    <>
      <AppHeader back="/conta" title="Tipos de mensagem" />
      <h1 className="large-title" style={{ marginTop: 24 }}>Tipos de mensagem</h1>
      <p className="body-2" style={{ marginBottom: 20 }}>
        Escolha o que você quer receber ao longo do dia.
      </p>
      <MessagesForm categories={CATEGORIES} />
    </>
  );
}
