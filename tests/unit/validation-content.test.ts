import { describe, expect, it } from "vitest";
import { emailSchema, messagesSchema, nameSchema, onboardingSchema, otpSchema, safeNextPath, scheduleSchema } from "@/lib/validation";
import { AFFIRMATIONS, AUDIO, CATEGORIES, MOMENTS, REFLECTION_IDS, findReflection } from "@/lib/content";
import { pickForPrefs } from "@/lib/schedule";
import { existsSync } from "node:fs";
import path from "node:path";

const schedule = { timeZone: "America/Sao_Paulo", wake: "06:45", commute: "08:15", midday: "13:00", sleep: "23:00" };
const paths = (r: { error?: { issues: { path: PropertyKey[] }[] } }) => r.error?.issues.map((i) => String(i.path.at(-1)));

describe("validação no servidor", () => {
  it("horários: aceita válidos e recusa repetidos, inválidos e fuso desconhecido", () => {
    expect(scheduleSchema.safeParse(schedule).success).toBe(true);
    expect(paths(scheduleSchema.safeParse({ ...schedule, sleep: "06:45" }))).toContain("schedule");
    expect(paths(scheduleSchema.safeParse({ ...schedule, midday: "25:00" }))).toContain("midday");
    expect(paths(scheduleSchema.safeParse({ ...schedule, timeZone: "Lua/Base" }))).toContain("timeZone");
  });

  it("tipos de mensagem: pelo menos um, só valores conhecidos, sem repetição", () => {
    expect(messagesSchema.parse({ types: ["gratidao", "gratidao"], includeQuotes: false }).types).toEqual(["gratidao"]);
    expect(messagesSchema.safeParse({ types: [], includeQuotes: true }).success).toBe(false);
    expect(messagesSchema.safeParse({ types: ["loteria"], includeQuotes: true }).success).toBe(false);
  });

  it("nome: opcional, normalizado e limitado", () => {
    expect(nameSchema.parse({ displayName: " Ana " }).displayName).toBe("Ana");
    expect(nameSchema.parse({ displayName: "  " }).displayName).toBeNull();
    expect(nameSchema.safeParse({ displayName: "x".repeat(61) }).success).toBe(false);
  });

  it("onboarding valida tudo junto e ignora id enviado pelo navegador", () => {
    const r = onboardingSchema.parse({
      schedule,
      messages: { types: ["prosperidade"], includeQuotes: true },
      name: { displayName: "Ana" },
      id: "outra-pessoa",
    } as object);
    expect(r).not.toHaveProperty("id");
  });
});

describe("escolha por tipo de mensagem", () => {
  const day = { year: 2026, month: 10, day: 23 };
  it("respeita os tipos escolhidos quando o momento tem frases daquele tipo", () => {
    for (let d = 0; d < 10; d++) {
      const m = pickForPrefs(AFFIRMATIONS, "sleep", { ...day, day: day.day + d }, { types: ["gratidao"], includeQuotes: true });
      expect(m.category).toBe("gratidao");
    }
  });

  it("sem citações, nunca mostra citação", () => {
    for (let d = 0; d < 30; d++) {
      for (const moment of ["wake", "commute", "midday", "sleep"] as const) {
        const m = pickForPrefs(AFFIRMATIONS, moment, { year: 2026, month: 11, day: 1 + d }, { types: ["prosperidade", "confianca", "proposito", "gratidao"], includeQuotes: false });
        expect(m.citation).toBeNull();
      }
    }
  });

  it("momento sem frase do tipo escolhido cai para outra frase do mesmo momento", () => {
    const m = pickForPrefs(AFFIRMATIONS, "wake", day, { types: ["gratidao"], includeQuotes: true });
    expect(m.moment).toBe("wake");
  });

  it("catálogo: toda frase tem um dos quatro tipos", () => {
    const ids = CATEGORIES.map((c) => c.id);
    expect(ids).toEqual(["prosperidade", "confianca", "proposito", "gratidao"]);
    for (const a of AFFIRMATIONS) expect(ids).toContain(a.category);
  });
});

describe("login", () => {
  it("valida e-mail e código", () => {
    expect(emailSchema.parse("  Ana@Example.com ")).toBe("ana@example.com");
    expect(emailSchema.safeParse("ana@").success).toBe(false);
    expect(otpSchema.safeParse("123456").success).toBe(true);
    expect(otpSchema.safeParse("12a456").success).toBe(false);
    expect(otpSchema.safeParse("123").success).toBe(false);
  });

  it("impede redirecionamento aberto", () => {
    expect(safeNextPath("/reflexao/wake-prosperidade-01")).toBe("/reflexao/wake-prosperidade-01");
    for (const bad of ["https://evil.com", "//evil.com", "/\\evil.com", "javascript:alert(1)", undefined, 42]) {
      expect(safeNextPath(bad)).toBe("/hoje");
    }
  });
});

describe("catálogo", () => {
  it("tem quatro momentos com seis afirmações cada e ids únicos", () => {
    expect(MOMENTS.map((m) => m.id)).toEqual(["wake", "commute", "midday", "sleep"]);
    for (const m of MOMENTS) expect(AFFIRMATIONS.filter((a) => a.moment === m.id)).toHaveLength(6);
    expect(new Set(AFFIRMATIONS.map((a) => a.id)).size).toBe(AFFIRMATIONS.length);
  });

  it("toda afirmação tem reflexão; citações têm fonte", () => {
    expect(REFLECTION_IDS).toHaveLength(AFFIRMATIONS.length);
    for (const a of AFFIRMATIONS) {
      expect(findReflection(a.id)?.reflection.paragraphs.length).toBeGreaterThan(0);
      if (a.citation) expect(new URL(a.citation.url).protocol).toBe("https:");
    }
  });

  it("rejeita ids de reflexão desconhecidos ou malformados", () => {
    for (const bad of ["nada", "../secret", "WAKE-PROSPERIDADE-01", ""]) expect(findReflection(bad)).toBeNull();
  });

  it("todas as faixas de áudio existem em public/", () => {
    expect(AUDIO.tracks).toHaveLength(33);
    for (const t of AUDIO.tracks) expect(existsSync(path.join("public", t.src))).toBe(true);
    expect(existsSync("public/audio/reflection-piano-original.m4a")).toBe(true);
  });
});
