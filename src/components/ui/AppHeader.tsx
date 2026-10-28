import Link from "next/link";
import { IconBack } from "../Icons";

/**
 * Cabeçalho de tela: três colunas (ação à esquerda, título ou marca ao centro, ação à direita).
 * Sem menu hambúrguer: as ações são sempre explícitas.
 */
export function AppHeader({ back, title, center, right }: { back?: string; title?: string; center?: React.ReactNode; right?: React.ReactNode }) {
  return (
    <header className="app-header">
      {back ? (
        <Link href={back} className="icon-btn" aria-label="Voltar">
          <IconBack />
        </Link>
      ) : (
        <span aria-hidden="true" />
      )}
      <div className="app-header-center">{center ?? (title ? <span className="navbar-title">{title}</span> : null)}</div>
      {right ?? <span aria-hidden="true" />}
    </header>
  );
}
