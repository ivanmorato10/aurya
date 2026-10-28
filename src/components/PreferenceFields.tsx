"use client";

import type { MomentId, Schedule } from "@/lib/schedule";
import { CategoryIcon, IconGlobe, IconQuote } from "./Icons";
import { Scene } from "./Scene";

export type ScheduleValues = Schedule & { timeZone: string };

/** Quatro horários + fuso, em lista de ajustes. */
export function ScheduleFields({
  values,
  onChange,
  moments,
  timeZones,
  errors = {},
  detected = false,
}: {
  values: ScheduleValues;
  onChange: (v: ScheduleValues) => void;
  moments: { id: MomentId; label: string }[];
  timeZones: string[];
  errors?: Partial<Record<string, string>>;
  detected?: boolean;
}) {
  const scheduleError = errors.schedule ?? moments.map((m) => errors[m.id]).find(Boolean);
  return (
    <>
      <ul className="list">
        {moments.map((m) => (
          <li key={m.id} data-moment={m.id}>
            <label className="row" htmlFor={`t-${m.id}`}>
              <span className="thumb" aria-hidden="true">
                <Scene moment={m.id} />
              </span>
              <span className="row-main row-title">{m.label}</span>
              <input
                id={`t-${m.id}`}
                name={m.id}
                type="time"
                step={60}
                required
                value={values[m.id]}
                onChange={(e) => onChange({ ...values, [m.id]: e.target.value })}
                aria-invalid={Boolean(errors[m.id] || errors.schedule)}
              />
            </label>
          </li>
        ))}
      </ul>
      {scheduleError && (
        <p className="field-error" role="alert">
          {scheduleError}
        </p>
      )}
      <div className="field">
        <label htmlFor="timeZone">
          <IconGlobe className="inline-icon" /> Fuso horário
        </label>
        <select id="timeZone" name="timeZone" value={values.timeZone} onChange={(e) => onChange({ ...values, timeZone: e.target.value })}>
          {timeZones.map((tz) => (
            <option key={tz} value={tz}>
              {tz.replaceAll("_", " ")}
            </option>
          ))}
        </select>
        <span className="hint">{detected ? "Detectado no seu aparelho. " : ""}A frase troca no horário local deste fuso.</span>
        {errors.timeZone && <p className="field-error">{errors.timeZone}</p>}
      </div>
    </>
  );
}

export type MessageValues = { types: string[]; includeQuotes: boolean };

/** Tipos de mensagem (múltipla escolha) + citações. */
export function MessageFields({
  values,
  onChange,
  categories,
  error,
}: {
  values: MessageValues;
  onChange: (v: MessageValues) => void;
  categories: { id: string; label: string; description: string }[];
  error?: string;
}) {
  const toggle = (id: string, on: boolean) =>
    onChange({ ...values, types: on ? [...values.types, id] : values.types.filter((t) => t !== id) });
  return (
    <>
      <fieldset style={{ border: 0, padding: 0, margin: 0 }}>
        <legend className="sr-only">Tipos de mensagem</legend>
        <div className="choices">
          {categories.map((c) => (
            <label className="choice" key={c.id}>
              <input type="checkbox" name="types" value={c.id} checked={values.types.includes(c.id)} onChange={(e) => toggle(c.id, e.target.checked)} />
              <span className="choice-icon" aria-hidden="true">
                <CategoryIcon id={c.id} />
              </span>
              <span className="row-main">
                <span className="row-title" style={{ display: "block" }}>
                  {c.label}
                </span>
                <span className="caption">{c.description}</span>
              </span>
              <span className="choice-check" aria-hidden="true" />
            </label>
          ))}
        </div>
      </fieldset>
      {error && (
        <p className="field-error" role="alert">
          {error}
        </p>
      )}
      <label className="inline-toggle" htmlFor="includeQuotes">
        <span style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <span className="choice-icon" aria-hidden="true">
            <IconQuote />
          </span>
          <span>
            <span style={{ display: "block" }}>Citações de Napoleon Hill</span>
            <span className="caption">Frases originais traduzidas, com fonte.</span>
          </span>
        </span>
        <span className="switch">
          <input
            id="includeQuotes"
            name="includeQuotes"
            type="checkbox"
            role="switch"
            checked={values.includeQuotes}
            onChange={(e) => onChange({ ...values, includeQuotes: e.target.checked })}
          />
          <span />
        </span>
      </label>
      <p className="hint">Se um momento não tiver frase do tipo escolhido, mostramos outra afirmação daquele momento.</p>
    </>
  );
}
