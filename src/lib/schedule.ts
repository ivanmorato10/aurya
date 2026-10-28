// Quatro momentos do dia, calculados no relógio de parede do fuso da pessoa.
// A mensagem ativa é a da última ocorrência e permanece até a próxima,
// inclusive depois da meia-noite. A escolha diária usa a data em que o
// momento começou, não a data da consulta.

export const MOMENT_IDS = ["wake", "commute", "midday", "sleep"] as const;
export type MomentId = (typeof MOMENT_IDS)[number];
export type Schedule = Record<MomentId, string>; // "HH:MM"

export type LocalDay = { year: number; month: number; day: number };
export type LocalNow = LocalDay & { minute: number; second: number; ms: number };
export type Occurrence = { moment: MomentId; minute: number; day: LocalDay };

export const EXAMPLE_SCHEDULE: Schedule = { wake: "07:00", commute: "08:30", midday: "12:30", sleep: "22:00" };

export function isMomentId(value: unknown): value is MomentId {
  return typeof value === "string" && (MOMENT_IDS as readonly string[]).includes(value);
}

export function parseTime(value: string): number | null {
  const match = /^(\d{2}):(\d{2})$/.exec(value);
  if (!match) return null;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  return hours < 24 && minutes < 60 ? hours * 60 + minutes : null;
}

export function formatTime(minute: number): string {
  return `${String(Math.floor(minute / 60)).padStart(2, "0")}:${String(minute % 60).padStart(2, "0")}`;
}

export function isValidSchedule(schedule: Partial<Record<MomentId, string>>): schedule is Schedule {
  const values = MOMENT_IDS.map((id) => parseTime(schedule[id] ?? ""));
  return values.every((v) => v !== null) && new Set(values).size === MOMENT_IDS.length;
}

export function isValidTimeZone(timeZone: string): boolean {
  if (!timeZone || timeZone.length > 64) return false;
  try {
    new Intl.DateTimeFormat("en-US", { timeZone });
    return true;
  } catch {
    return false;
  }
}

const formatters = new Map<string, Intl.DateTimeFormat>();

/** Data e hora de parede no fuso informado. */
export function localNow(timeZone: string, at: Date = new Date()): LocalNow {
  let formatter = formatters.get(timeZone);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat("en-US", {
      timeZone,
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hourCycle: "h23",
    });
    formatters.set(timeZone, formatter);
  }
  const parts = Object.fromEntries(formatter.formatToParts(at).map((p) => [p.type, p.value]));
  return {
    year: Number(parts.year),
    month: Number(parts.month),
    day: Number(parts.day),
    minute: (Number(parts.hour) % 24) * 60 + Number(parts.minute),
    second: Number(parts.second),
    ms: at.getMilliseconds(),
  };
}

export function addDays(day: LocalDay, delta: number): LocalDay {
  const d = new Date(Date.UTC(day.year, day.month - 1, day.day + delta));
  return { year: d.getUTCFullYear(), month: d.getUTCMonth() + 1, day: d.getUTCDate() };
}

/** Dias desde 01/01/2026 — mesma âncora da prévia original, para manter a distribuição. */
export function dayNumber(day: LocalDay): number {
  return Math.round((Date.UTC(day.year, day.month - 1, day.day) - Date.UTC(2026, 0, 1)) / 86_400_000);
}

function sortedMoments(schedule: Schedule) {
  return MOMENT_IDS.map((moment) => ({ moment, minute: parseTime(schedule[moment])! })).sort(
    (a, b) => a.minute - b.minute,
  );
}

export function activeOccurrence(schedule: Schedule, now: LocalNow): Occurrence {
  if (!isValidSchedule(schedule)) throw new Error("Horários inválidos");
  const sorted = sortedMoments(schedule);
  const today = sorted.filter((m) => m.minute <= now.minute).at(-1);
  if (today) return { ...today, day: { year: now.year, month: now.month, day: now.day } };
  const last = sorted.at(-1)!;
  return { ...last, day: addDays(now, -1) };
}

export function nextOccurrence(schedule: Schedule, now: LocalNow): Occurrence & { inMs: number } {
  if (!isValidSchedule(schedule)) throw new Error("Horários inválidos");
  const sorted = sortedMoments(schedule);
  const later = sorted.find((m) => m.minute > now.minute);
  const target = later ?? sorted[0];
  const minutesAhead = later ? target.minute - now.minute : target.minute + 1440 - now.minute;
  const inMs = minutesAhead * 60_000 - now.second * 1000 - now.ms;
  return { ...target, day: later ? now : addDays(now, 1), inMs: Math.max(0, inMs) };
}

export function pickDaily<T extends { moment: string }>(items: T[], moment: MomentId, day: LocalDay): T {
  const pool = items.filter((item) => item.moment === moment);
  if (!pool.length) throw new Error(`Sem conteúdo para o momento ${moment}`);
  const n = dayNumber(day);
  return pool[((n % pool.length) + pool.length) % pool.length];
}

export type MessagePrefs = { types: readonly string[]; includeQuotes: boolean };

/**
 * Frase do dia respeitando os tipos escolhidos. Se um momento não tiver frase
 * dos tipos escolhidos, usa as demais frases do mesmo momento (nunca fica vazio).
 */
export function pickForPrefs<T extends { moment: string; category: string; citation: unknown }>(
  items: T[],
  moment: MomentId,
  day: LocalDay,
  prefs: MessagePrefs,
): T {
  const ofMoment = items.filter((i) => i.moment === moment);
  const allowedQuote = (i: T) => prefs.includeQuotes || !i.citation;
  const preferred = ofMoment.filter((i) => prefs.types.includes(i.category) && allowedQuote(i));
  if (preferred.length) return pickDaily(preferred, moment, day);
  const noQuotes = ofMoment.filter(allowedQuote);
  return pickDaily(noQuotes.length ? noQuotes : ofMoment, moment, day);
}
