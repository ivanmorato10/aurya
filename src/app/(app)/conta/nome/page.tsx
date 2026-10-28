import type { Metadata } from "next";
import { AppHeader } from "@/components/ui/AppHeader";
import { NameForm } from "@/components/SettingsForms";

export const metadata: Metadata = { title: "Nome" };

export default function NomePage() {
  return (
    <>
      <AppHeader back="/conta" title="Nome" />
      <h1 className="large-title" style={{ marginTop: 24 }}>Nome</h1>
      <NameForm />
    </>
  );
}
