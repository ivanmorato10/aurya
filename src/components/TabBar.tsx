"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconAudioTab, IconHomeThin, IconLeaf, IconUserThin } from "./Icons";

const TABS = [
  { href: "/hoje", label: "Início", Icon: IconHomeThin, match: (p: string) => p === "/hoje" },
  { href: "/audios", label: "Áudios", Icon: IconAudioTab, match: (p: string) => p.startsWith("/audios") },
  { href: "/afirmacoes", label: "Afirmações", Icon: IconLeaf, match: (p: string) => p.startsWith("/afirmacoes") || p.startsWith("/reflexao") },
  { href: "/conta", label: "Perfil", Icon: IconUserThin, match: (p: string) => p.startsWith("/conta") },
];

export function TabBar() {
  const pathname = usePathname();
  return (
    <nav className="tabbar" aria-label="Navegação principal">
      <ul>
        {TABS.map(({ href, label, Icon, match }) => (
          <li key={href}>
            <Link href={href} aria-current={match(pathname) ? "page" : undefined}>
              <Icon />
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
