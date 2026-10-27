import Link from "next/link";
import { PublicFrame } from "@/components/PublicFrame";
import { AuraMark } from "@/components/Logo";
import { MOMENTS } from "@/lib/content";

export default async function Landing({ searchParams }: { searchParams: Promise<{ conta?: string }> }) {
  const { conta } = await searchParams;
  return (
    <PublicFrame>
      {conta === "excluida" && (
        <p className="alert alert-success" role="status">
          Sua conta e seus dados foram excluídos.
        </p>
      )}
      <section className="hero">
        <div className="hero-mark">
          <AuraMark size={64} />
        </div>
        <span className="eyebrow">Quatro momentos · uma frase</span>
        <h1>
          Uma frase.
          <br />O seu momento.
        </h1>
        <p className="lead">
          O AURYA acompanha o ritmo do seu dia com afirmações de prosperidade, gratidão e confiança — e um texto para
          aprofundar quando você quiser.
        </p>
        <Link href="/entrar" className="btn btn-primary btn-block">
          Começar com meu e-mail
        </Link>
        <p className="small" style={{ textAlign: "center" }}>
          Sem senha: você recebe um código de acesso por e-mail.
        </p>
      </section>

      <section className="section" aria-labelledby="como">
        <h2 id="como">Como funciona</h2>
        <ol className="steps">
          <li>
            <div>
              <h3>Defina seus quatro horários</h3>
              <p className="note">Cada momento começa no horário que você escolher — inclusive em rotinas noturnas.</p>
            </div>
          </li>
          <li>
            <div>
              <h3>Leia a frase do momento</h3>
              <p className="note">Uma afirmação por momento, que permanece até o próximo. Sem notificações.</p>
            </div>
          </li>
          <li>
            <div>
              <h3>Aprofunde ou escute</h3>
              <p className="note">Um texto curto para refletir, leitura em voz alta e músicas suaves.</p>
            </div>
          </li>
        </ol>
      </section>

      <section className="section" aria-label="Os quatro momentos">
        <div className="moment-strip">
          {MOMENTS.map((m) => (
            <span key={m.id} data-moment={m.id}>
              <span className="dot" aria-hidden="true" />
              {m.label}
            </span>
          ))}
        </div>
      </section>
    </PublicFrame>
  );
}
