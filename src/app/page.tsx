import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { Hero } from "@/components/ui/Hero";
import { BrandBar } from "@/components/ui/TopBar";
import { IMAGES } from "@/lib/images";
import { WelcomeGate } from "./WelcomeGate";

export default async function Welcome({ searchParams }: { searchParams: Promise<{ conta?: string }> }) {
  const { conta } = await searchParams;
  const deleted = conta === "excluida";
  return (
    <div className="app">
      <WelcomeGate deleted={deleted} />
      <Hero image={IMAGES.opening} fallback="sleep" size="full" position="center 58%" />
      <main id="conteudo" tabIndex={-1} className="screen welcome">
        <BrandBar action={<span />} />
        {deleted && (
          <p className="alert alert-success" role="status">
            Sua conta e seus dados foram excluídos.
          </p>
        )}
        <div className="welcome-copy">
          <p className="overline">Afirmações para uma vida extraordinária</p>
          <h1 className="welcome-title" style={{ marginTop: 16 }}>
            A prosperidade também é um estado de presença.
          </h1>
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
