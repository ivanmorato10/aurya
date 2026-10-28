// Ícones de linha, traço 2px, 24×24.
type P = { className?: string };
const S = ({ children, className }: P & { children: React.ReactNode }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    {children}
  </svg>
);

export const IconBack = (p: P) => <S {...p}><path d="M15 18l-6-6 6-6" /></S>;
export const IconChevron = (p: P) => <S {...p}><path d="M9 18l6-6-6-6" /></S>;
export const IconSun = (p: P) => <S {...p}><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></S>;
export const IconSunrise = (p: P) => <S {...p}><path d="M17 18a5 5 0 0 0-10 0M12 2v7M4.2 10.2l1.4 1.4M1 18h2M21 18h2M18.4 11.6l1.4-1.4M23 22H1M8 6l4-4 4 4" /></S>;
export const IconMoon = (p: P) => <S {...p}><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" /></S>;
export const IconMusic = (p: P) => <S {...p}><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></S>;
export const IconUser = (p: P) => <S {...p}><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></S>;
export const IconClock = (p: P) => <S {...p}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></S>;
export const IconSpark = (p: P) => <S {...p}><path d="M12 3l1.9 5.6L19.5 10l-5.6 1.9L12 17.5l-1.9-5.6L4.5 10l5.6-1.4z" /></S>;
export const IconText = (p: P) => <S {...p}><path d="M4 6h16M4 12h16M4 18h10" /></S>;
export const IconGlobe = (p: P) => <S {...p}><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" /></S>;
export const IconInfo = (p: P) => <S {...p}><circle cx="12" cy="12" r="9" /><path d="M12 16v-4M12 8h.01" /></S>;
export const IconShield = (p: P) => <S {...p}><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" /></S>;
export const IconLogout = (p: P) => <S {...p}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" /></S>;
export const IconTrash = (p: P) => <S {...p}><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" /></S>;
export const IconCoin = (p: P) => <S {...p}><circle cx="12" cy="12" r="9" /><path d="M14.5 9a2.5 2.5 0 0 0-2.5-1.5c-1.5 0-2.5.8-2.5 2s1 1.7 2.5 2 2.5.8 2.5 2-1 2-2.5 2A2.5 2.5 0 0 1 9.5 15M12 6v1.5M12 16.5V18" /></S>;
export const IconBolt = (p: P) => <S {...p}><path d="M13 2L4 14h7l-1 8 9-12h-7z" /></S>;
export const IconTarget = (p: P) => <S {...p}><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1" /></S>;
export const IconHeart = (p: P) => <S {...p}><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8z" /></S>;
export const IconQuote = (p: P) => <S {...p}><path d="M7 7h4v4c0 3-2 5-4 6M15 7h4v4c0 3-2 5-4 6" /></S>;

export const IconPlay = (p: P) => (
  <svg className={p.className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.5v13a1 1 0 0 0 1.5.9l10-6.5a1 1 0 0 0 0-1.8l-10-6.5A1 1 0 0 0 8 5.5z" /></svg>
);
export const IconPause = (p: P) => (
  <svg className={p.className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1.5" /><rect x="14" y="5" width="4" height="14" rx="1.5" /></svg>
);
export const IconStop = (p: P) => (
  <svg className={p.className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6" y="6" width="12" height="12" rx="2.5" /></svg>
);

// Linguagem "Serenidade" (referência AURYA_Serenidade_em_Audio.png)
export const IconChevronDown = (p: P) => <S {...p}><path d="M5.5 9l6.5 6.5L18.5 9" /></S>;
export const IconInfo2 = (p: P) => <S {...p}><circle cx="12" cy="12" r="8.5" /><path d="M12 11v5M12 8h.01" /></S>;
export const IconTimer = (p: P) => <S {...p}><circle cx="12" cy="13.5" r="7.5" /><path d="M12 13.5V9.5M10 2.5h4M18.2 6.8l1.3-1.3" /></S>;
export const IconWaves = (p: P) => <S {...p}><path d="M4 10.5v3M7.5 8v8M11 5v14M14.5 8.5v7M18 6.5v11M21 10.5v3" /></S>;
export const IconVolume = (p: P) => <S {...p}><path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" /><path d="M15.5 9a4.2 4.2 0 0 1 0 6M18.3 6.5a7.8 7.8 0 0 1 0 11" /></S>;
export const IconVolumeLow = (p: P) => <S {...p}><path d="M5 9.5h3.5L13 5.5v13l-4.5-4H5z" /><path d="M16.5 9a4.2 4.2 0 0 1 0 6" /></S>;
export const IconMore = (p: P) => (
  <svg className={p.className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="5" cy="12" r="1.6" /><circle cx="12" cy="12" r="1.6" /><circle cx="19" cy="12" r="1.6" /></svg>
);
export const IconPrev = (p: P) => <S {...p}><path d="M6.5 5v14M18.5 5.5 9.5 12l9 6.5z" /></S>;
export const IconNext = (p: P) => <S {...p}><path d="M17.5 5v14M5.5 5.5l9 6.5-9 6.5z" /></S>;
export const IconPlayThin = (p: P) => (
  <svg className={p.className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8.5 6.2v11.6c0 .7.8 1.2 1.4.8l8.6-5.8a1 1 0 0 0 0-1.6L9.9 5.4c-.6-.4-1.4.1-1.4.8z" /></svg>
);
export const IconPauseThin = (p: P) => (
  <svg className={p.className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6.8" y="5.5" width="3.4" height="13" rx="1.2" /><rect x="13.8" y="5.5" width="3.4" height="13" rx="1.2" /></svg>
);
export const IconLeaf = (p: P) => <S {...p}><path d="M12 20.5c-4.5-2-7-5.2-7-9.3 0-2 .5-4 1.4-5.7 2.4 1 4.3 2.6 5.6 4.6 1.3-2 3.2-3.6 5.6-4.6.9 1.7 1.4 3.7 1.4 5.7 0 4.1-2.5 7.3-7 9.3z" /><path d="M12 10.1v10.4" /></S>;
export const IconAudioTab = (p: P) => <S {...p}><circle cx="12" cy="12" r="8.5" /><path d="M12 3.5a8.5 8.5 0 0 0 0 17 5 8.5 0 0 1 0-17z" fill="currentColor" stroke="none" /></S>;
export const IconUserThin = (p: P) => <S {...p}><circle cx="12" cy="8" r="3.8" /><path d="M4.5 20.5a7.5 7.5 0 0 1 15 0" /></S>;
export const IconHomeThin = (p: P) => <S {...p}><path d="M4.5 10.2 12 4l7.5 6.2V20h-5v-5.5h-5V20h-5z" /></S>;
export const IconSunHorizon = (p: P) => <S {...p}><path d="M6.5 15a5.5 5.5 0 0 1 11 0" /><path d="M2.5 15h19M5 18.5h14M12 4v3M5.6 6.6l1.8 1.8M18.4 6.6l-1.8 1.8M2.8 11h2.4M18.8 11h2.4" /></S>;

import type { MomentId } from "@/lib/schedule";
// Ícones dos momentos, no traço fino da referência aprovada.
export const IconDawn = (p: P) => <S {...p}><path d="M5.5 17.5a6.5 6.5 0 0 1 13 0" /><path d="M2.5 17.5h5M16.5 17.5h5M12 6.5v2.5M6.3 9.3l1.6 1.6M17.7 9.3l-1.6 1.6M3.6 13.4l2 .6M20.4 13.4l-2 .6" /><path d="M8 20.5h8" /></S>;
export const IconMorning = (p: P) => <S {...p}><circle cx="12" cy="12" r="3.6" /><path d="M12 4.5v2M12 17.5v2M4.5 12h2M17.5 12h2M6.7 6.7l1.4 1.4M15.9 15.9l1.4 1.4M6.7 17.3l1.4-1.4M15.9 8.1l1.4-1.4" /></S>;
export const IconNoon = (p: P) => <S {...p}><circle cx="12" cy="12" r="4.4" /><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1" /></S>;
export const IconNight = (p: P) => <S {...p}><path d="M19.5 14.6A8 8 0 1 1 9.4 4.5a6.4 6.4 0 0 0 10.1 10.1z" /></S>;
export const IconBook = (p: P) => <S {...p}><path d="M12 6.5C10.5 5.3 8.2 4.8 4 5v13c4.2-.2 6.5.3 8 1.5M12 6.5c1.5-1.2 3.8-1.7 8-1.5v13c-4.2-.2-6.5.3-8 1.5M12 6.5v13" /></S>;
export const IconHome = (p: P) => <S {...p}><path d="M4 10.5 12 4l8 6.5V20h-5.5v-5.5h-5V20H4z" /></S>;
export const IconProfile = (p: P) => <S {...p}><circle cx="12" cy="12" r="9.25" /><circle cx="12" cy="10" r="3.2" /><path d="M6.2 18.4a6.8 6.8 0 0 1 11.6 0" /></S>;

export function MomentIcon({ moment, className }: { moment: MomentId; className?: string }) {
  if (moment === "wake") return <IconDawn className={className} />;
  if (moment === "commute") return <IconMorning className={className} />;
  if (moment === "midday") return <IconNoon className={className} />;
  return <IconNight className={className} />;
}

export function CategoryIcon({ id, className }: { id: string; className?: string }) {
  if (id === "prosperidade") return <IconCoin className={className} />;
  if (id === "confianca") return <IconBolt className={className} />;
  if (id === "proposito") return <IconTarget className={className} />;
  return <IconHeart className={className} />;
}
