import { describe, expect, it } from "vitest";
import { emailSchema, otpSchema, profileSchema, safeNextPath } from "@/lib/validation";
import { AFFIRMATIONS, AUDIO, MOMENTS, REFLECTION_IDS, findReflection } from "@/lib/content";
import { existsSync } from "node:fs";
import path from "node:path";

const valid = { displayName: " Ana ", timeZone: "America/Sao_Paulo", wake: "06:45", commute: "08:15", midday: "13:00", sleep: "23:00" };

describe("validação do perfil (servidor)", () => {
  it("aceita dados válidos e normaliza o nome", () => {
    const r = profileSchema.parse(valid);
    expect(r.displayName).toBe("Ana");
    expect(profileSchema.parse({ ...valid, displayName: "   " }).displayName).toBeNull();
  });

  it("rejeita horários repetidos, inválidos, fuso e nome longo", () => {
    const issues = (v: object) => profileSchema.safeParse({ ...valid, ...v }).error?.issues.map((i) => i.path[0]);
    expect(issues({ sleep: "06:45" })).toContain("schedule");
    expect(issues({ midday: "25:00" })).toContain("midday");
    expect(issues({ timeZone: "Lua/Base" })).toContain("timeZone");
    expect(issues({ displayName: "x".repeat(61) })).toContain("displayName");
  });

  it("ignora campos extras como id enviado pelo navegador", () => {
    const r = profileSchema.parse({ ...valid, id: "outra-pessoa" } as object);
    expect(r).not.toHaveProperty("id");
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
