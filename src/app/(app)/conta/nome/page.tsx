import type { Metadata } from "next";
import { NavBar } from "@/components/Screen";
import { NameForm } from "@/components/SettingsForms";

export const metadata: Metadata = { title: "Nome" };

export default function NomePage() {
  return (
    <>
      <NavBar back="/conta" />
      <h1 className="large-title">Nome</h1>
      <NameForm />
    </>
  );
}
