import Link from "next/link";
import { PublicFrame } from "@/components/PublicFrame";
import { Aury } from "@/components/Aury";
import { Aura } from "@/components/Decor";
import { MOMENTS } from "@/lib/content";
import type { MomentId } from "@/lib/schedule";

const MOMENT_HINT: Record<MomentId, string> = {
  wake: "comece com intenção",
  commute: "siga com confiança",
  midday: "renove o foco",
  sleep: "descanse em gratidão",
};

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
        <div className="hero-stage">
          <Aura rings={3} start={170} step={40} />
          <Aury moment="midday" size={150} title="Aury, o solzinho do AURYA" />
        </div>
        <span className="eyebrow anim-rise">Quatro momentos · uma frase</span>
        <h1 className="anim-rise-2">
          Uma frase.
          <br />O seu <span className="hl">momento</span>.
        </h1>
        <p className="lead anim-rise-3">
          Afirmações de prosperidade, gratidão e confiança no ritmo do seu dia — e um texto para aprofundar quando
          quiser.
        </p>
        <Link href="/entrar" className="btn btn-primary btn-block anim-rise-3">
          Começar com meu e-mail
        </Link>
        <p className="small" style={{ marginTop: 12 }}>
          Sem senha: você recebe um código por e-mail.
        </p>
      </section>

      <section className="section" aria-labelledby="momentos">
        <h2 id="momentos">
          Seu dia em <span className="grad-text">quatro luzes</span>
        </h2>
        <div className="moments-row">
          {MOMENTS.map((m) => (
            <div key={m.id} className="moment-card" data-moment={m.id}>
              <Aury moment={m.id} size={58} />
              <strong>{m.label}</strong>
              <span>{MOMENT_HINT[m.id]}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="section" aria-labelledby="como">
        <h2 id="como">Como funciona</h2>
        <ol className="steps">
          <li>
            <div>
              <h3>Escolha seus quatro horários</h3>
              <p className="note">Cada momento começa quando você quiser — rotinas noturnas também.</p>
            </div>
          </li>
          <li>
            <div>
              <h3>Leia a frase do momento</h3>
              <p className="note">Ela fica com você até o próximo horário. Sem notificações.</p>
            </div>
          </li>
          <li>
            <div>
              <h3>Aprofunde e escute</h3>
              <p className="note">Um texto curto, leitura em voz alta e músicas suaves de piano.</p>
            </div>
          </li>
        </ol>
      </section>
    </PublicFrame>
  );
}
