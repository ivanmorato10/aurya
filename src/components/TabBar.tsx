"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconHome, IconMusic, IconProfile } from "./Icons";

const TABS = [
  { href: "/hoje", label: "Início", Icon: IconHome, match: (p: string) => p === "/hoje" || p.startsWith("/reflexao") },
  { href: "/audios", label: "Áudio", Icon: IconMusic, match: (p: string) => p === "/audios" },
  { href: "/conta", label: "Perfil", Icon: IconProfile, match: (p: string) => p.startsWith("/conta") },
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
