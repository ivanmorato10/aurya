import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { ButtonLink } from "@/components/ui/Button";
import { Atmosphere } from "@/components/ui/Atmosphere";
import { IMAGES } from "@/lib/images";
import { WelcomeGate } from "./WelcomeGate";

export default async function Welcome({ searchParams }: { searchParams: Promise<{ conta?: string }> }) {
  const { conta } = await searchParams;
  const deleted = conta === "excluida";
  return (
    <div className="app">
      <WelcomeGate deleted={deleted} />
      <Atmosphere image={IMAGES.opening} fallback="sleep" className="atmosphere--opening" />
      <main id="conteudo" tabIndex={-1} className="screen welcome">
        {deleted && (
          <p className="alert alert-success" role="status">
            Sua conta e seus dados foram excluídos.
          </p>
        )}
        <h1 className="welcome-brand">
          <Logo size="md" />
        </h1>
        <div className="welcome-copy">
          <p className="welcome-title">A prosperidade também é um estado de presença.</p>
          <p className="welcome-text">Quatro afirmações diárias, reflexões e experiências sonoras para uma vida mais plena.</p>
        </div>
        <div className="welcome-actions">
          <ButtonLink href="/comecar" block>
            Começar agora
          </ButtonLink>
          <div className="welcome-links">
            <Link href="/entrar?next=/hoje" className="btn btn-text">
              Já tenho uma conta
            </Link>
            <Link href="/como-funciona" className="btn btn-text">
              Como funciona
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
