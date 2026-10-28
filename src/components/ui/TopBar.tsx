import Link from "next/link";
import { IconChevronDown, IconSunHorizon } from "../Icons";

/** "AURYA" espaçado à esquerda e ícone de sol à direita, sobre a fotografia. */
export function BrandBar({ action }: { action?: React.ReactNode }) {
  return (
    <div className="topbar">
      <Link href="/hoje" className="topbar-brand" aria-label="AURYA, início">
        AURYA
      </Link>
      {action ?? (
        <Link href="/conta" className="topbar-icon" aria-label="Perfil e preferências">
          <IconSunHorizon />
        </Link>
      )}
    </div>
  );
}

/** Barra com seta de fechar/voltar (⌄) à esquerda, como no player da referência. */
export function CloseBar({ href, onClose, label = "Voltar", right }: { href?: string; onClose?: () => void; label?: string; right?: React.ReactNode }) {
  return (
    <div className="topbar">
      {href ? (
        <Link href={href} className="topbar-icon" aria-label={label}>
          <IconChevronDown />
        </Link>
      ) : (
        <button type="button" className="topbar-icon" aria-label={label} onClick={onClose}>
          <IconChevronDown />
        </button>
      )}
      {right ?? <span />}
    </div>
  );
}
