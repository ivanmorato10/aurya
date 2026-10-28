import Link from "next/link";
import { AppFrame } from "@/components/Screen";
import { Wordmark } from "@/components/Logo";
import { Scene } from "@/components/Scene";
import { WelcomeGate } from "./WelcomeGate";

export default async function Welcome({ searchParams }: { searchParams: Promise<{ conta?: string }> }) {
  const { conta } = await searchParams;
  const deleted = conta === "excluida";
  return (
    <>
    <div className="splash" aria-hidden="true">
      <Scene moment="wake" />
    </div>
    <AppFrame>
      <WelcomeGate deleted={deleted} />
      <div className="welcome">
        {deleted && (
          <p className="alert alert-success" role="status" style={{ marginTop: 16 }}>
            Sua conta e seus dados foram excluídos.
          </p>
        )}
        <div className="welcome-brand">
          <h1 style={{ margin: 0 }}>
            <Wordmark size={64} />
          </h1>
          <p>Afirmações diárias</p>
        </div>
        <div className="welcome-copy">
          <p className="display">Quatro pausas para um dia mais próspero.</p>
          <p className="body-2">Uma afirmação ao acordar, no caminho, no meio do dia e antes de dormir — no seu horário.</p>
        </div>
        <div className="footer-cta" style={{ background: "none" }}>
          <Link href="/comecar" className="btn btn-light btn-block">
            Começar
          </Link>
          <Link href="/como-funciona" className="btn btn-glass btn-block">
            Como funciona
          </Link>
          <Link href="/entrar?next=/hoje" className="btn btn-text" style={{ justifySelf: "center" }}>
            Já tenho conta · Entrar
          </Link>
        </div>
      </div>
    </AppFrame>
    </>
  );
}
