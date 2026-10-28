"use client";

import Link from "next/link";
import { useState } from "react";
import type { FormState } from "@/app/actions";
import { MessageFields, ScheduleFields, type MessageValues, type ScheduleValues } from "./PreferenceFields";
import { usePrefs } from "./PrefsProvider";
import type { Prefs } from "@/lib/prefs";
import type { CategoryId } from "@/lib/categories";
import type { MomentId } from "@/lib/schedule";

function Feedback({ state }: { state: FormState }) {
  if (!state.message) return null;
  return (
    <p className={`alert ${state.status === "success" ? "alert-success" : "alert-error"}`} role={state.status === "success" ? "status" : "alert"}>
      {state.message}
    </p>
  );
}

/** Formulário que altera parte das preferências e salva o conjunto (aparelho ou conta). */
function usePartialSave() {
  const { prefs, save } = usePrefs();
  const [state, setState] = useState<FormState>({ status: "idle" });
  const [busy, setBusy] = useState(false);
  const submit = async (patch: (p: Prefs) => Prefs) => {
    if (!prefs || busy) return;
    setBusy(true);
    const result = await save(patch(prefs));
    setState(result.status === "success" ? { status: "success", message: "Alterações salvas." } : result);
    setBusy(false);
  };
  return { prefs, state, busy, submit };
}

function SaveButton({ busy, label = "Salvar alterações" }: { busy: boolean; label?: string }) {
  return (
    <div className="footer-cta">
      <button type="submit" className="btn btn-primary btn-block" disabled={busy}>
        {busy && <span className="spinner" aria-hidden="true" />}
        {busy ? "Salvando…" : label}
      </button>
    </div>
  );
}

function ScheduleFormInner({ moments, timeZones }: { moments: { id: MomentId; label: string }[]; timeZones: string[] }) {
  const { prefs, state, busy, submit } = usePartialSave();
  const [values, setValues] = useState<ScheduleValues | null>(prefs ? { timeZone: prefs.timeZone, ...prefs.schedule } : null);
  if (!values) return null;
  return (
    <form
      noValidate
      style={{ display: "contents" }}
      onSubmit={(e) => {
        e.preventDefault();
        const { timeZone, ...schedule } = values;
        void submit((p) => ({ ...p, timeZone, schedule }));
      }}
    >
      <Feedback state={state} />
      <ScheduleFields values={values} onChange={setValues} moments={moments} timeZones={timeZones} errors={state.fieldErrors} />
      <SaveButton busy={busy} />
    </form>
  );
}

function MessagesFormInner({ categories }: { categories: { id: string; label: string; description: string }[] }) {
  const { prefs, state, busy, submit } = usePartialSave();
  const [values, setValues] = useState<MessageValues | null>(prefs ? { types: prefs.types, includeQuotes: prefs.includeQuotes } : null);
  if (!values) return null;
  return (
    <form
      noValidate
      style={{ display: "contents" }}
      onSubmit={(e) => {
        e.preventDefault();
        void submit((p) => ({ ...p, types: values.types as CategoryId[], includeQuotes: values.includeQuotes }));
      }}
    >
      <Feedback state={state} />
      <MessageFields values={values} onChange={setValues} categories={categories} error={state.fieldErrors?.types} />
      <SaveButton busy={busy} />
    </form>
  );
}

function NameFormInner() {
  const { prefs, state, busy, submit } = usePartialSave();
  const [value, setValue] = useState(prefs?.displayName ?? "");
  if (!prefs) return null;
  return (
    <form
      noValidate
      style={{ display: "contents" }}
      onSubmit={(e) => {
        e.preventDefault();
        void submit((p) => ({ ...p, displayName: value.trim() || null }));
      }}
    >
      <Feedback state={state} />
      <div className="field" style={{ marginTop: 0 }}>
        <label htmlFor="displayName">Como podemos chamar você?</label>
        <input id="displayName" name="displayName" maxLength={60} autoComplete="given-name" value={value} onChange={(e) => setValue(e.target.value)} />
        {state.fieldErrors?.displayName && <p className="field-error">{state.fieldErrors.displayName}</p>}
        <span className="hint">Opcional. Aparece só para você, na saudação.</span>
      </div>
      <SaveButton busy={busy} label="Salvar" />
    </form>
  );
}

/** Espera ler as preferências (aparelho ou conta) antes de montar o formulário. */
function Gate({ children }: { children: React.ReactNode }) {
  const { ready, prefs } = usePrefs();
  if (!ready) return <div className="skeleton" style={{ height: 260 }} aria-busy="true" />;
  if (!prefs)
    return (
      <Link href="/comecar?next=/conta" className="btn btn-primary btn-block">
        Configurar meus momentos
      </Link>
    );
  return <>{children}</>;
}

export function ScheduleForm(props: { moments: { id: MomentId; label: string }[]; timeZones: string[] }) {
  return (
    <Gate>
      <ScheduleFormInner {...props} />
    </Gate>
  );
}

export function MessagesForm(props: { categories: { id: string; label: string; description: string }[] }) {
  return (
    <Gate>
      <MessagesFormInner {...props} />
    </Gate>
  );
}

export function NameForm() {
  return (
    <Gate>
      <NameFormInner />
    </Gate>
  );
}
