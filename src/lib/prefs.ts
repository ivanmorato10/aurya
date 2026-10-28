// Preferências da pessoa. Visitante: guardadas só neste aparelho (localStorage).
// Com conta: guardadas no Supabase e espelhadas aqui, para o app seguir igual ao sair.
import { onboardingSchema } from "./validation";
import type { CategoryId } from "./categories";
import type { Schedule } from "./schedule";

export type Prefs = {
  schedule: Schedule;
  timeZone: string;
  types: CategoryId[];
  includeQuotes: boolean;
  displayName: string | null;
};

const KEY = "aurya.prefs.v1";

/** Formato aceito pela validação do servidor (mesmo esquema do onboarding). */
export function toInput(p: Prefs) {
  return {
    schedule: { timeZone: p.timeZone, ...p.schedule },
    messages: { types: p.types, includeQuotes: p.includeQuotes },
    name: { displayName: p.displayName ?? "" },
  };
}

export function parsePrefs(raw: unknown): Prefs | null {
  const r = onboardingSchema.safeParse(raw);
  if (!r.success) return null;
  const { schedule, messages, name } = r.data;
  const { timeZone, ...times } = schedule;
  return { schedule: times, timeZone, types: messages.types as CategoryId[], includeQuotes: messages.includeQuotes, displayName: name.displayName };
}

export function readLocalPrefs(): Prefs | null {
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? parsePrefs(JSON.parse(raw)) : null;
  } catch {
    return null;
  }
}

export function writeLocalPrefs(p: Prefs): boolean {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(toInput(p)));
    return true;
  } catch {
    return false;
  }
}

export function clearLocalPrefs() {
  try {
    window.localStorage.removeItem(KEY);
  } catch {}
}
