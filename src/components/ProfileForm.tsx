"use client";

import { useActionState, useEffect, useState } from "react";
import { saveProfile, type FormState } from "@/app/actions";
import { SubmitButton } from "./SubmitButton";
import type { MomentId } from "@/lib/schedule";
import { Aury } from "./Aury";

type Values = { displayName: string; timeZone: string } & Record<MomentId, string>;

export function ProfileForm({
  intent,
  next = "/hoje",
  initial,
  moments,
  timeZones,
  detectTimeZone,
}: {
  intent: "onboarding" | "settings";
  next?: string;
  initial: Values;
  moments: { id: MomentId; label: string }[];
  timeZones: string[];
  detectTimeZone: boolean;
}) {
  const [state, action] = useActionState<FormState, FormData>(saveProfile, { status: "idle" });
  const [values, setValues] = useState<Values>(initial);
  const [detected, setDetected] = useState(false);
  const errors = state.fieldErrors ?? {};

  // No primeiro acesso, sugere o fuso do aparelho (a pessoa pode trocar).
  useEffect(() => {
    if (!detectTimeZone) return;
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz && timeZones.includes(tz)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- leitura única do fuso do aparelho após hidratar
      setValues((v) => ({ ...v, timeZone: tz }));
      setDetected(true);
    }
  }, [detectTimeZone, timeZones]);

  const set = (key: keyof Values) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setValues((v) => ({ ...v, [key]: e.target.value }));

  const scheduleError = errors.schedule ?? moments.map((m) => errors[m.id]).find(Boolean);

  return (
    <form action={action} noValidate>
      <input type="hidden" name="intent" value={intent} />
      <input type="hidden" name="next" value={next} />

      {state.message && (
        <p className={`alert ${state.status === "success" ? "alert-success" : "alert-error"}`} role={state.status === "success" ? "status" : "alert"}>
          {state.message}
        </p>
      )}

      <fieldset style={{ border: 0, padding: 0, margin: 0 }} aria-describedby="schedule-hint">
        <legend className="label">Seus quatro momentos</legend>
        <span id="schedule-hint" className="hint">
          Cada frase fica até o próximo horário. A ordem segue o relógio — rotinas noturnas funcionam.
        </span>
        <div className="time-grid">
          {moments.map((m) => (
            <div className="time-row" data-moment={m.id} key={m.id}>
              <Aury moment={m.id} size={48} animated={false} />
              <label htmlFor={`t-${m.id}`}>{m.label}</label>
              <input
                id={`t-${m.id}`}
                name={m.id}
                type="time"
                step={60}
                required
                value={values[m.id]}
                onChange={set(m.id)}
                aria-invalid={Boolean(errors[m.id] || errors.schedule)}
              />
            </div>
          ))}
        </div>
        {scheduleError && (
          <p className="field-error" role="alert">
            {scheduleError}
          </p>
        )}
      </fieldset>

      <div className="field">
        <label htmlFor="timeZone">Fuso horário</label>
        <select id="timeZone" name="timeZone" value={values.timeZone} onChange={set("timeZone")} aria-invalid={Boolean(errors.timeZone)}>
          {timeZones.map((tz) => (
            <option key={tz} value={tz}>
              {tz.replaceAll("_", " ")}
            </option>
          ))}
        </select>
        {detected && <span className="hint">Detectado no seu aparelho.</span>}
        {errors.timeZone && <p className="field-error">{errors.timeZone}</p>}
      </div>

      <div className="field">
        <label htmlFor="displayName">Como podemos chamar você? (opcional)</label>
        <input
          id="displayName"
          name="displayName"
          maxLength={60}
          autoComplete="given-name"
          value={values.displayName}
          onChange={set("displayName")}
          aria-invalid={Boolean(errors.displayName)}
        />
        {errors.displayName && <p className="field-error">{errors.displayName}</p>}
      </div>

      <div style={{ marginTop: 24 }}>
        <SubmitButton pendingLabel="Salvando…">{intent === "onboarding" ? "Começar" : "Salvar alterações"}</SubmitButton>
      </div>
    </form>
  );
}
