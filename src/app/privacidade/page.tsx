import type { Metadata } from "next";
import { AppFrame, NavBar } from "@/components/Screen";

export const metadata: Metadata = { title: "Privacidade" };

// Descreve o que o app realmente faz. Identificação do responsável e canal de
// contato vêm de variáveis de ambiente e devem ser informados pelo cliente.
export default function PrivacidadePage() {
  const controller = process.env.NEXT_PUBLIC_PRIVACY_CONTROLLER;
  const contact = process.env.NEXT_PUBLIC_PRIVACY_CONTACT;
  return (
    <AppFrame>
      <NavBar back="/" title="Privacidade" />
      <h1 className="large-title">Seus dados no AURYA</h1>
      <div className="legal">
        <h2>O que guardamos</h2>
        <ul>
          <li>Seu e-mail, para enviar o código de acesso e identificar a conta.</li>
          <li>Nome opcional, se você informar.</li>
          <li>Os quatro horários, o fuso horário e os tipos de mensagem escolhidos, para selecionar a frase de cada momento.</li>
        </ul>
        <p>
          Não pedimos senha, localização, microfone ou contatos. Não usamos anúncios nem ferramentas de rastreamento.
          A leitura em voz alta usa a voz instalada no seu aparelho.
        </p>

        <h2>Onde ficam</h2>
        <p>
          Conta e preferências ficam no Supabase (banco de dados e autenticação). O aplicativo é hospedado na Vercel.
          O acesso aos dados é restrito à própria conta. Cookies são usados apenas para manter sua sessão.
        </p>

        <h2>Seus controles</h2>
        <p>
          Em Ajustes, você altera horários, tipos de mensagem e nome a qualquer momento. O botão “Excluir minha conta” apaga
          imediatamente a conta, o e-mail e as preferências do banco de dados.
        </p>

        <h2>Responsável e contato</h2>
        <p>
          {controller && contact
            ? `${controller} · ${contact}`
            : "Os dados do responsável pelo tratamento e o canal de contato serão publicados aqui antes do lançamento público."}
        </p>
      </div>
    </AppFrame>
  );
}
