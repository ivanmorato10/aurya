import type { Metadata } from "next";
import { NavBar } from "@/components/Screen";
import { requireProfile } from "@/lib/auth";
import { DeleteAccount } from "./DeleteAccount";

export const metadata: Metadata = { title: "Excluir conta" };

export default async function ExcluirPage() {
  await requireProfile("/conta/excluir");
  return (
    <>
      <NavBar back="/conta" />
      <h1 className="large-title">Excluir conta</h1>
      <p className="body-2" style={{ marginBottom: 20 }}>
        Apaga sua conta, e-mail, nome, horários e preferências — inclusive as guardadas neste aparelho. Não é possível desfazer.
      </p>
      <DeleteAccount />
    </>
  );
}
