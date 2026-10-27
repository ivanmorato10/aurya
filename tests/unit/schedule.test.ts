import { describe, expect, it } from "vitest";
import {
  EXAMPLE_SCHEDULE,
  activeOccurrence,
  addDays,
  isValidSchedule,
  isValidTimeZone,
  localNow,
  nextOccurrence,
  parseTime,
  pickDaily,
  type LocalNow,
  type MomentId,
} from "@/lib/schedule";
import { AFFIRMATIONS } from "@/lib/content";

const at = (year: number, month: number, day: number, h: number, m: number, s = 0): LocalNow => ({
  year,
  month,
  day,
  minute: h * 60 + m,
  second: s,
  ms: 0,
});

describe("horários", () => {
  it("aceita quatro horários válidos e diferentes, inclusive 00:00", () => {
    expect(isValidSchedule(EXAMPLE_SCHEDULE)).toBe(true);
    expect(isValidSchedule({ ...EXAMPLE_SCHEDULE, wake: "00:00" })).toBe(true);
    expect(parseTime("23:59")).toBe(1439);
  });

  it("rejeita repetidos, vazios e fora do intervalo", () => {
    for (const bad of [
      { ...EXAMPLE_SCHEDULE, commute: "07:00" },
      { ...EXAMPLE_SCHEDULE, sleep: "24:00" },
      { ...EXAMPLE_SCHEDULE, wake: "" },
      { ...EXAMPLE_SCHEDULE, midday: "12:60" },
      { ...EXAMPLE_SCHEDULE, midday: "7:00" },
    ]) {
      expect(isValidSchedule(bad)).toBe(false);
    }
  });

  it("valida fusos horários", () => {
    expect(isValidTimeZone("America/Sao_Paulo")).toBe(true);
    expect(isValidTimeZone("Lua/Base")).toBe(false);
    expect(isValidTimeZone("")).toBe(false);
  });
});

describe("momento ativo", () => {
  it("respeita as fronteiras exatas", () => {
    const cases: [number, number, MomentId][] = [
      [6, 59, "sleep"],
      [7, 0, "wake"],
      [8, 29, "wake"],
      [8, 30, "commute"],
      [12, 29, "commute"],
      [12, 30, "midday"],
      [21, 59, "midday"],
      [22, 0, "sleep"],
    ];
    for (const [h, m, id] of cases) expect(activeOccurrence(EXAMPLE_SCHEDULE, at(2026, 10, 23, h, m)).moment).toBe(id);
  });

  it("mantém a mesma frase após a meia-noite até o próximo momento", () => {
    const before = activeOccurrence(EXAMPLE_SCHEDULE, at(2026, 10, 23, 23, 59));
    const after = activeOccurrence(EXAMPLE_SCHEDULE, at(2026, 10, 24, 0, 0));
    const dawn = activeOccurrence(EXAMPLE_SCHEDULE, at(2026, 10, 24, 6, 59));
    expect(after.moment).toBe("sleep");
    expect(after.day).toEqual({ year: 2026, month: 10, day: 23 });
    const pick = (o: typeof before) => pickDaily(AFFIRMATIONS, o.moment, o.day).id;
    expect(pick(after)).toBe(pick(before));
    expect(pick(dawn)).toBe(pick(before));
  });

  it("aceita rotina noturna sem impor ordem das categorias", () => {
    const night = { wake: "20:00", commute: "22:00", midday: "02:00", sleep: "08:00" };
    expect(isValidSchedule(night)).toBe(true);
    expect(activeOccurrence(night, at(2026, 10, 23, 3, 0)).moment).toBe("midday");
    expect(nextOccurrence(night, at(2026, 10, 23, 23, 0)).moment).toBe("midday");
  });

  it("calcula o tempo até a próxima troca, atravessando a meia-noite", () => {
    expect(nextOccurrence(EXAMPLE_SCHEDULE, at(2026, 10, 23, 8, 29, 30)).inMs).toBe(30_000);
    const late = nextOccurrence(EXAMPLE_SCHEDULE, at(2026, 10, 23, 23, 0));
    expect(late.moment).toBe("wake");
    expect(late.day).toEqual({ year: 2026, month: 10, day: 24 });
    expect(late.inMs).toBe(8 * 3_600_000);
  });

  it("vira mês e ano corretamente", () => {
    expect(addDays({ year: 2026, month: 12, day: 31 }, 1)).toEqual({ year: 2027, month: 1, day: 1 });
    expect(addDays({ year: 2026, month: 3, day: 1 }, -1)).toEqual({ year: 2026, month: 2, day: 28 });
  });
});

describe("fuso horário", () => {
  it("usa o relógio de parede do fuso da pessoa, não o do servidor", () => {
    const instant = new Date("2026-10-24T02:30:00Z");
    expect(localNow("America/Sao_Paulo", instant)).toMatchObject({ year: 2026, month: 10, day: 23, minute: 23 * 60 + 30 });
    expect(localNow("Asia/Tokyo", instant)).toMatchObject({ day: 24, minute: 11 * 60 + 30 });
  });

  it("no horário de verão (Los Angeles) o dia civil mantém as quatro trocas na hora local", () => {
    // 08/03/2026: relógios saltam de 02:00 para 03:00 em Los Angeles.
    const morning = localNow("America/Los_Angeles", new Date("2026-03-08T15:00:00Z"));
    expect(morning).toMatchObject({ day: 8, minute: 8 * 60 });
    expect(activeOccurrence(EXAMPLE_SCHEDULE, morning).moment).toBe("wake");
    // 01/11/2026: 01:00–02:00 se repete; a hora de parede continua a mesma.
    const fall = localNow("America/Los_Angeles", new Date("2026-11-01T08:30:00Z"));
    expect(fall).toMatchObject({ day: 1, minute: 60 + 30 });
    expect(activeOccurrence(EXAMPLE_SCHEDULE, fall)).toMatchObject({ moment: "sleep", day: { day: 31 } });
  });
});

describe("frase diária", () => {
  it("é determinística pelo dia do momento e muda no dia seguinte", () => {
    const day = { year: 2026, month: 10, day: 23 };
    for (const id of ["wake", "commute", "midday", "sleep"] as MomentId[]) {
      const a = pickDaily(AFFIRMATIONS, id, day);
      expect(pickDaily(AFFIRMATIONS, id, day).id).toBe(a.id);
      expect(pickDaily(AFFIRMATIONS, id, addDays(day, 1)).id).not.toBe(a.id);
      expect(a.moment).toBe(id);
    }
  });

  it("mantém a distribuição da prévia original (âncora 01/01/2026)", () => {
    // 01/01/2026 → índice 0 de cada momento.
    expect(pickDaily(AFFIRMATIONS, "wake", { year: 2026, month: 1, day: 1 }).id).toBe("wake-prosperidade-01");
  });

  it("falha claramente sem conteúdo", () => {
    expect(() => pickDaily([], "wake", { year: 2026, month: 1, day: 1 })).toThrow(/Sem conteúdo/);
  });
});
