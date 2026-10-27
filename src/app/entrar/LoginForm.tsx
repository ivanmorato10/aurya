"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { emailSchema, otpSchema } from "@/lib/validation";

const RESEND_SECONDS = 60;

function authMessage(error: unknown): string {
  const e = error as { status?: number; code?: string; message?: string } | null;
  if (typeof navigator !== "undefined" && !navigator.onLine) return "Sem conexão. Verifique a internet e tente de novo.";
  if (e?.status === 429 || e?.code === "over_email_send_rate_limit" || e?.code === "over_request_rate_limit") {
    return "Muitas tentativas em pouco tempo. Aguarde alguns minutos e tente novamente.";
  }
  if (e?.code === "otp_expired" || e?.code === "invalid_credentials" || e?.status === 403) {
    return "Código inválido ou expirado. Confira o e-mail mais recente ou peça um novo código.";
  }
  if (e?.code === "signup_disabled") return "Novos cadastros estão temporariamente fechados.";
  return "Não foi possível concluir agora. Tente novamente em instantes.";
}

export function LoginForm({ next, linkError }: { next: string; linkError: boolean }) {
  const router = useRouter();
  const [step, setStep] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(linkError ? "O link de acesso expirou ou já foi usado. Peça um novo código." : null);
  const [info, setInfo] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const codeRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  useEffect(() => {
    if (step === "code") codeRef.current?.focus();
  }, [step]);

  async function sendCode(target: string) {
    const supabase = createClient();
    const redirect = new URL("/auth/confirm", window.location.origin);
    redirect.searchParams.set("next", next);
    const { error } = await supabase.auth.signInWithOtp({
      email: target,
      options: { shouldCreateUser: true, emailRedirectTo: redirect.toString() },
    });
    if (error) throw error;
  }

  async function onEmail(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;
    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) {
      setError(parsed.error.issues[0].message);
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await sendCode(parsed.data);
      setEmail(parsed.data);
      setStep("code");
      setCooldown(RESEND_SECONDS);
      setInfo(`Enviamos um código para ${parsed.data}.`);
    } catch (err) {
      setError(authMessage(err));
    } finally {
      setBusy(false);
    }
  }

  async function onCode(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;
    const parsed = otpSchema.safeParse(code);
    if (!parsed.success) {
      setError(parsed.error.issues[0].message);
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const { error } = await createClient().auth.verifyOtp({ email, token: parsed.data, type: "email" });
      if (error) throw error;
      setInfo("Acesso confirmado. Abrindo seu espaço…");
      router.replace(next);
      router.refresh();
    } catch (err) {
      setError(authMessage(err));
      setBusy(false);
    }
  }

  async function resend() {
    if (busy || cooldown > 0) return;
    setBusy(true);
    setError(null);
    try {
      await sendCode(email);
      setCooldown(RESEND_SECONDS);
      setInfo(`Enviamos um novo código para ${email}.`);
    } catch (err) {
      setError(authMessage(err));
    } finally {
      setBusy(false);
    }
  }

  const feedback = (
    <>
      {error && (
        <p className="alert alert-error" role="alert">
          {error}
        </p>
      )}
      {info && !error && (
        <p className="alert alert-success" role="status">
          {info}
        </p>
      )}
    </>
  );

  if (step === "email") {
    return (
      <form onSubmit={onEmail} noValidate className="stack">
        {feedback}
        <div className="field">
          <label htmlFor="email">Seu e-mail</label>
          <input
            id="email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            autoCapitalize="none"
            spellCheck={false}
            required
            maxLength={254}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={Boolean(error)}
          />
          <span className="hint">Se ainda não tiver conta, ela é criada no primeiro acesso.</span>
        </div>
        <button className="btn btn-primary btn-block" type="submit" disabled={busy}>
          {busy ? <span className="spinner" aria-hidden="true" /> : null}
          {busy ? "Enviando código…" : "Receber código"}
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={onCode} noValidate className="stack">
      {feedback}
      <div className="field">
        <label htmlFor="code">Código de acesso</label>
        <input
          ref={codeRef}
          id="code"
          name="code"
          className="otp-input"
          inputMode="numeric"
          autoComplete="one-time-code"
          pattern="[0-9]*"
          maxLength={10}
          required
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
          aria-invalid={Boolean(error)}
          aria-describedby="code-hint"
        />
        <span id="code-hint" className="hint">
          Confira a caixa de entrada e o spam. O e-mail também traz um link que entra direto.
        </span>
      </div>
      <button className="btn btn-primary btn-block" type="submit" disabled={busy}>
        {busy ? <span className="spinner" aria-hidden="true" /> : null}
        {busy ? "Confirmando…" : "Entrar"}
      </button>
      <div className="btn-row">
        <button type="button" className="btn btn-quiet" onClick={resend} disabled={busy || cooldown > 0}>
          {cooldown > 0 ? `Reenviar em ${cooldown}s` : "Reenviar código"}
        </button>
        <button
          type="button"
          className="btn btn-quiet"
          disabled={busy}
          onClick={() => {
            setStep("email");
            setCode("");
            setError(null);
            setInfo(null);
          }}
        >
          Trocar e-mail
        </button>
      </div>
    </form>
  );
}
