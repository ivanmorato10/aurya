import type { Metadata } from "next";
import Link from "next/link";
import { AppFrame, NavBar } from "@/components/Screen";

export const metadata: Metadata = { title: "Como funciona" };

const STEPS = [
  { title: "Escolha seus quatro horários", text: "Ao acordar, a caminho do trabalho, no meio do dia e antes de dormir. Rotinas noturnas também funcionam." },
  { title: "Use sem cadastro", text: "Suas escolhas ficam neste aparelho. Se quiser, crie uma conta depois para guardá-las com segurança." },
  { title: "Diga o que quer receber", text: "Prosperidade e riqueza, confiança e ação, foco e propósito ou gratidão — e se quer citações de Napoleon Hill." },
  { title: "Uma frase por momento", text: "A frase aparece quando o momento começa e fica com você até o próximo. Sem notificações, sem excesso." },
  { title: "Aprofunde e escute", text: "Cada frase tem um texto curto para refletir, leitura em voz alta e músicas instrumentais para acompanhar." },
];

export default function ComoFuncionaPage() {
  return (
    <AppFrame>
      <NavBar back="/" />
      <p className="kicker">Como funciona</p>
      <h1 className="large-title">Quatro pausas. Um dia mais presente.</h1>
      <ol className="steps">
        {STEPS.map((s, i) => (
          <li className="step" key={s.title}>
            <span className="step-num" aria-hidden="true">
              {i + 1}
            </span>
            <div>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </div>
          </li>
        ))}
      </ol>
      <div className="footer-cta">
        <Link href="/comecar" className="btn btn-primary btn-block">
          Começar agora
        </Link>
      </div>
    </AppFrame>
  );
}
