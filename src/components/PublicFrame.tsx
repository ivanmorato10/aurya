import Link from "next/link";
import { Brand } from "./Logo";

export function PublicFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="shell">
      <header className="topbar">
        <Brand />
      </header>
      <main id="conteudo" tabIndex={-1}>
        {children}
      </main>
      <footer className="site-footer">
        <span>AURYA · afirmações originais e citações com fonte</span>
        <Link href="/privacidade">Privacidade</Link>
      </footer>
    </div>
  );
}
