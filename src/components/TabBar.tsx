"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  {
    href: "/hoje",
    label: "Hoje",
    icon: <path d="M4 15a8 8 0 0 1 16 0M2 15h20M12 3v3M4.9 7.9l2 2M19.1 7.9l-2 2" />,
  },
  {
    href: "/audios",
    label: "Áudios",
    icon: <path d="M9 18V6l11-2v12M9 18a3 3 0 1 1-3-3 3 3 0 0 1 3 3Zm11-2a3 3 0 1 1-3-3 3 3 0 0 1 3 3Z" />,
  },
  {
    href: "/conta",
    label: "Conta",
    icon: <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 9a7 7 0 0 1 14 0" />,
  },
];

export function TabBar() {
  const pathname = usePathname();
  return (
    <nav className="tabbar" aria-label="Navegação principal">
      <ul>
        {TABS.map((tab) => {
          const active = pathname === tab.href || (tab.href === "/hoje" && pathname.startsWith("/reflexao"));
          return (
            <li key={tab.href}>
              <Link href={tab.href} aria-current={active ? "page" : undefined}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  {tab.icon}
                </svg>
                {tab.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
