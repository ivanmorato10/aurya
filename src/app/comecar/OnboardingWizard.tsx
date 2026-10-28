"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { FormState } from "@/app/actions";
import { MessageFields, ScheduleFields, type MessageValues, type ScheduleValues } from "@/components/PreferenceFields";
import { IconBack } from "@/components/Icons";
import { usePrefs } from "@/components/PrefsProvider";
import { CATEGORY_IDS, type CategoryId } from "@/lib/categories";
import { EXAMPLE_SCHEDULE, isValidSchedule, type MomentId } from "@/lib/schedule";

const STEP_OF_FIELD: Record<string, number> = {
  wake: 0, commute: 0, midday: 0, sleep: 0, schedule: 0, timeZone: 0, types: 1, includeQuotes: 1, displayName: 2,
};

const TITLES = [
  ["Seus horários", "Quando cada frase deve aparecer? Ela fica com você até o próximo momento."],
  ["O que você quer receber?", "Escolha um ou mais tipos. Você pode mudar quando quiser em Ajustes."],
  ["Como podemos chamar você?", "Opcional. Aparece só para você, na saudação."],
];

function Wizard({
  next,
  moments,
  categories,
  timeZones,
}: {
  next: string;
  moments: { id: MomentId; label: string }[];
  categories: { id: string; label: string; description: string }[];
  timeZones: string[];
}) {
  const router = useRouter();
  const { prefs, save, account } = usePrefs();
  const [step, setStep] = useState(0);
  const [schedule, setSchedule] = useState<ScheduleValues>(() =>
    prefs ? { timeZone: prefs.timeZone, ...prefs.schedule } : { timeZone: "America/Sao_Paulo", ...EXAMPLE_SCHEDULE },
  );
  const [messages, setMessages] = useState<MessageValues>(() =>
    prefs ? { types: prefs.types, includeQuotes: prefs.includeQuotes } : { types: [...CATEGORY_IDS], includeQuotes: true },
  );
  const [displayName, setDisplayName] = useState(prefs?.displayName ?? "");
  const [detected, setDetected] = useState(false);
  const [busy, setBusy] = useState(false);
  const [state, setState] = useState<FormState>({ status: "idle" });
  const errors = state.fieldErrors ?? {};

  // Sugere o fuso do aparelho no primeiro uso (a pessoa pode trocar).
  useEffect(() => {
    if (prefs) return;
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz && timeZones.includes(tz)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- leitura única do fuso do aparelho após hidratar
      setSchedule((s) => ({ ...s, timeZone: tz }));
      setDetected(true);
    }
  }, [prefs, timeZones]);

  const fail = (fieldErrors: Record<string, string>) => {
    setState({ status: "error", fieldErrors });
    const first = Object.keys(fieldErrors)[0];
    if (first in STEP_OF_FIELD) setStep(STEP_OF_FIELD[first]);
  };

  const advance = () => {
    if (step === 0 && !isValidSchedule(schedule)) return fail({ schedule: "Use quatro horários diferentes." });
    if (step === 1 && messages.types.length === 0) return fail({ types: "Escolha pelo menos um tipo de mensagem." });
    setState({ status: "idle" });
    setStep((s) => s + 1);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 2) return advance();
    if (busy) return;
    setBusy(true);
    const { timeZone, ...times } = schedule;
    const result = await save({
      schedule: times,
      timeZone,
      types: messages.types as CategoryId[],
      includeQuotes: messages.includeQuotes,
      displayName: displayName.trim() || null,
    });
    if (result.status === "success") {
      router.push(next);
      return;
    }
    setBusy(false);
    if (result.fieldErrors) fail(result.fieldErrors as Record<string, string>);
    else setState(result);
  };

  return (
    <form onSubmit={onSubmit} noValidate style={{ display: "contents" }}>
      <div className="navbar" style={{ gap: 8 }}>
        {step > 0 ? (
          <button type="button" className="icon-btn" aria-label="Voltar" onClick={() => setStep((s) => s - 1)}>
            <IconBack />
          </button>
        ) : (
          <Link href="/" className="icon-btn" aria-label="Voltar">
            <IconBack />
          </Link>
        )}
        <div className="progress" role="progressbar" aria-valuemin={1} aria-valuemax={3} aria-valuenow={step + 1} aria-label="Progresso">
          <i style={{ width: `${((step + 1) / 3) * 100}%` }} />
        </div>
        <span />
      </div>

      <p className="kicker" style={{ marginTop: 18 }}>
        Passo {step + 1} de 3
      </p>
      <h1 className="large-title">{TITLES[step][0]}</h1>
      <p className="body-2" style={{ marginBottom: 20 }}>
        {TITLES[step][1]}
      </p>

      {state.status === "error" && state.message && (
        <p className="alert alert-error" role="alert">
          {state.message}
        </p>
      )}

      <div hidden={step !== 0}>
        <ScheduleFields
          values={schedule}
          onChange={(v) => {
            setSchedule(v);
            setState({ status: "idle" });
          }}
          moments={moments}
          timeZones={timeZones}
          errors={errors}
          detected={detected}
        />
      </div>
      <div hidden={step !== 1}>
        <MessageFields
          values={messages}
          onChange={(v) => {
            setMessages(v);
            setState({ status: "idle" });
          }}
          categories={categories}
          error={errors.types}
        />
      </div>
      <div hidden={step !== 2}>
        <div className="field" style={{ marginTop: 0 }}>
          <label htmlFor="displayName">Seu nome (opcional)</label>
          <input id="displayName" name="displayName" maxLength={60} autoComplete="given-name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
          {errors.displayName && <p className="field-error">{errors.displayName}</p>}
        </div>
        {!account && (
          <p className="alert alert-info">Sem cadastro: suas escolhas ficam neste aparelho. Você pode criar uma conta depois, em Ajustes.</p>
        )}
      </div>

      <div className="footer-cta">
        <button type="submit" className="btn btn-primary btn-block" disabled={busy}>
          {busy && <span className="spinner" aria-hidden="true" />}
          {step < 2 ? "Continuar" : busy ? "Preparando…" : "Começar"}
        </button>
      </div>
    </form>
  );
}

type WizardProps = Parameters<typeof Wizard>[0];

/** Espera ler as preferências para começar com os valores já salvos (se houver). */
export function OnboardingWizard(props: WizardProps) {
  const { ready } = usePrefs();
  if (!ready) return <div className="skeleton" style={{ height: 420, marginTop: 70 }} aria-busy="true" />;
  return <Wizard {...props} />;
}
