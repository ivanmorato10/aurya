"use client";

import Link from "next/link";
import { signOut } from "@/app/actions";
import { IconChevron, IconClock, IconInfo, IconLogout, IconShield, IconSpark, IconTrash, IconUser } from "@/components/Icons";
import { usePrefs } from "@/components/PrefsProvider";
import { SubmitButton } from "@/components/SubmitButton";
import { CATEGORY_IDS } from "@/lib/categories";

function Row({ href, icon, title, value, danger }: { href: string; icon: React.ReactNode; title: string; value?: string; danger?: boolean }) {
  return (
    <li>
      <Link href={href} className={`row${danger ? " row--danger" : ""}`}>
        <span className="row-icon" aria-hidden="true">
          {icon}
        </span>
        <span className="row-main">
          <span className="row-title">{title}</span>
          {value && <span className="row-sub">{value}</span>}
        </span>
        <IconChevron className="chev" />
      </Link>
    </li>
  );
}

export function SettingsHome({ categories }: { categories: { id: string; label: string }[] }) {
  const { ready, prefs, account } = usePrefs();
  const typeLabel = !prefs
    ? undefined
    : prefs.types.length === CATEGORY_IDS.length
      ? "Todos os tipos"
      : prefs.types.map((t) => categories.find((c) => c.id === t)?.label).join(", ");

  return (
    <>
      <header className="appbar">
        <h1 className="screen-title">Ajustes</h1>
      </header>

      <h2 className="section-title">Sua rotina</h2>
      {ready && !prefs ? (
        <Link href="/comecar?next=/conta" className="btn btn-primary btn-block">
          Configurar meus momentos
        </Link>
      ) : (
        <ul className="list">
          <Row href="/conta/horarios" icon={<IconClock />} title="Horários" value={prefs ? Object.values(prefs.schedule).join(" · ") : " "} />
          <Row href="/conta/mensagens" icon={<IconSpark />} title="Tipos de mensagem" value={prefs ? `${typeLabel}${prefs.includeQuotes ? " · com citações" : ""}` : " "} />
          <Row href="/conta/nome" icon={<IconUser />} title="Nome" value={prefs?.displayName ?? "Não informado"} />
        </ul>
      )}

      <h2 className="section-title">Conta</h2>
      {account ? (
        <ul className="list">
          <li className="row" style={{ cursor: "default" }}>
            <span className="row-icon" aria-hidden="true">
              <IconUser />
            </span>
            <span className="row-main">
              <span className="row-title">{account.email}</span>
              <span className="row-sub">Preferências salvas na sua conta</span>
            </span>
          </li>
          <li>
            <form action={signOut}>
              <SubmitButton className="row" pendingLabel="Saindo…">
                <span className="row-icon" aria-hidden="true">
                  <IconLogout />
                </span>
                <span className="row-main row-title">Sair</span>
              </SubmitButton>
            </form>
          </li>
          <Row href="/conta/excluir" icon={<IconTrash />} title="Excluir conta" danger />
        </ul>
      ) : (
        <div className="card" style={{ padding: 18 }}>
          <p className="row-title" style={{ margin: 0 }}>
            Você está usando sem cadastro
          </p>
          <p className="caption" style={{ margin: "4px 0 14px" }}>
            Suas escolhas ficam só neste aparelho. Crie uma conta para guardá-las e usar em outros aparelhos.
          </p>
          <Link href="/entrar?next=/conta" className="btn btn-primary btn-block">
            Entrar ou criar conta
          </Link>
        </div>
      )}

      <h2 className="section-title">Sobre</h2>
      <ul className="list">
        <Row href="/como-funciona" icon={<IconInfo />} title="Como funciona" />
        <Row href="/privacidade" icon={<IconShield />} title="Privacidade" />
      </ul>
    </>
  );
}
