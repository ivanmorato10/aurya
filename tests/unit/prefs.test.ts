import { describe, expect, it } from "vitest";
import { parsePrefs, toInput, type Prefs } from "@/lib/prefs";

const prefs: Prefs = {
  schedule: { wake: "06:45", commute: "08:15", midday: "13:00", sleep: "23:00" },
  timeZone: "America/Sao_Paulo",
  types: ["gratidao"],
  includeQuotes: false,
  displayName: "Ana",
};

describe("preferências guardadas no aparelho", () => {
  it("ida e volta mantém os valores", () => {
    expect(parsePrefs(JSON.parse(JSON.stringify(toInput(prefs))))).toEqual(prefs);
  });

  it("dados corrompidos ou adulterados são descartados", () => {
    for (const bad of [null, "x", {}, { ...toInput(prefs), messages: { types: [], includeQuotes: true } }, { ...toInput(prefs), schedule: { ...toInput(prefs).schedule, sleep: "06:45" } }]) {
      expect(parsePrefs(bad)).toBeNull();
    }
  });
});
