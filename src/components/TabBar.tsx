"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconMusic, IconSun, IconUser } from "./Icons";

const TABS = [
  { href: "/hoje", label: "Hoje", Icon: IconSun, match: (p: string) => p === "/hoje" || p.startsWith("/reflexao") },
  { href: "/audios", label: "Áudios", Icon: IconMusic, match: (p: string) => p === "/audios" },
  { href: "/conta", label: "Ajustes", Icon: IconUser, match: (p: string) => p.startsWith("/conta") },
];

export function TabBar() {
  const pathname = usePathname();
  return (
    <nav className="tabbar" aria-label="Navegação principal">
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
        <linearGradient id="tab-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FF2D87" />
          <stop offset="1" stopColor="#FFC23D" />
        </linearGradient>
      </svg>
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
