import catalog from "../../content/content.json";
import audioCatalog from "../../content/audio_catalog.json";
import { MOMENT_IDS, type MomentId } from "./schedule";

type Citation = { author: string; original: string; translation: string; url: string; source: string };
type Reflection = { title: string; principle: string; paragraphs: string[]; wordCount: number };
type RawMessage = {
  id: string;
  moment: string;
  theme: string;
  translations: { "pt-BR": { title: string; body: string; widget: string; reflection?: Reflection; citation?: Citation } };
};

/** O mínimo que a tela "Hoje" precisa no navegador. */
export type Affirmation = {
  id: string;
  moment: MomentId;
  theme: string;
  text: string;
  citation: { author: string; source: string; url: string; original: string } | null;
};

export type ReflectionContent = Affirmation & { reflection: Reflection };

const messages = (catalog.messages as RawMessage[]).filter((m): m is RawMessage & { moment: MomentId } =>
  (MOMENT_IDS as readonly string[]).includes(m.moment),
);

export const MOMENTS: { id: MomentId; label: string }[] = MOMENT_IDS.map((id) => ({
  id,
  label: catalog.moments.find((m) => m.id === id)?.label ?? id,
}));

export const MOMENT_LABEL: Record<MomentId, string> = Object.fromEntries(MOMENTS.map((m) => [m.id, m.label])) as Record<
  MomentId,
  string
>;

function toAffirmation(m: RawMessage & { moment: MomentId }): Affirmation {
  const t = m.translations["pt-BR"];
  return {
    id: m.id,
    moment: m.moment,
    theme: m.theme,
    text: t.body,
    citation: t.citation
      ? { author: t.citation.author, source: t.citation.source, url: t.citation.url, original: t.citation.original }
      : null,
  };
}

export const AFFIRMATIONS: Affirmation[] = messages.map(toAffirmation);

const MESSAGE_ID = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function findReflection(id: string): ReflectionContent | null {
  if (!MESSAGE_ID.test(id)) return null;
  const m = messages.find((x) => x.id === id);
  const reflection = m?.translations["pt-BR"].reflection;
  if (!m || !reflection) return null;
  return { ...toAffirmation(m), reflection };
}

export const REFLECTION_IDS = messages.filter((m) => m.translations["pt-BR"].reflection).map((m) => m.id);

export type AudioTheme = { id: string; label: string };
export type AudioTrack = { id: string; theme: string; frequencyHz: number; composition: string; src: string };

export const AUDIO = {
  themes: audioCatalog.themes as AudioTheme[],
  timerMinutes: audioCatalog.timerMinutes as number[],
  defaultTimerMinutes: audioCatalog.defaultTimerMinutes as number,
  defaultVolume: audioCatalog.defaultVolume as number,
  tracks: audioCatalog.tracks.map((t) => ({
    id: t.id,
    theme: t.theme,
    frequencyHz: t.frequencyHz,
    composition: t.composition,
    src: `/${t.asset}`,
  })) as AudioTrack[],
};

export const REFLECTION_AMBIENCE_SRC = "/audio/reflection-piano-original.m4a";
