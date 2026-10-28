import Link from "next/link";
import { IconBack } from "./Icons";

/** Tela de app sem abas (boas-vindas, login, onboarding, páginas de apoio). */
export function AppFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="app">
      <main id="conteudo" tabIndex={-1} className="screen">
        {children}
      </main>
    </div>
  );
}

/** Barra superior com voltar e título curto. */
export function NavBar({ back, title, right }: { back?: string; title?: string; right?: React.ReactNode }) {
  return (
    <div className="navbar">
      {back ? (
        <Link href={back} className="icon-btn" aria-label="Voltar">
          <IconBack />
        </Link>
      ) : (
        <span />
      )}
      <span className="navbar-title">{title}</span>
      {right ?? <span />}
    </div>
  );
}
