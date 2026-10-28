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

// Google e Apple aparecem só quando habilitados no Supabase (NEXT_PUBLIC_AUTH_PROVIDERS=google,apple).
const PROVIDERS = (process.env.NEXT_PUBLIC_AUTH_PROVIDERS ?? "")
  .split(",")
  .map((p) => p.trim())
  .filter((p): p is "google" | "apple" => p === "google" || p === "apple");

export function LoginForm({ next, linkError }: { next: string; linkError: string | null }) {
  const router = useRouter();
  const [step, setStep] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(
    linkError === "link" ? "O link de acesso expirou ou já foi usado. Peça um novo código." : linkError === "oauth" ? "Não foi possível entrar por esse provedor. Tente novamente ou use seu e-mail." : null,
  );
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

  async function oauth(provider: "google" | "apple") {
    if (busy) return;
    setBusy(true);
    setError(null);
    const redirect = new URL("/auth/callback", window.location.origin);
    redirect.searchParams.set("next", next);
    const { error } = await createClient().auth.signInWithOAuth({ provider, options: { redirectTo: redirect.toString() } });
    if (error) {
      setError(authMessage(error));
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
      <form onSubmit={onEmail} noValidate style={{ display: "contents" }}>
        <h1 className="large-title">Entrar ou criar conta</h1>
        <p className="body-2">Opcional: com uma conta, suas preferências ficam guardadas e você pode usar em outros aparelhos.</p>
        {PROVIDERS.length > 0 && (
          <div style={{ display: "grid", gap: 10, marginTop: 20 }}>
            {PROVIDERS.includes("apple") && (
              <button type="button" className="btn btn-provider btn-block" onClick={() => oauth("apple")} disabled={busy}>
                Continuar com Apple
              </button>
            )}
            {PROVIDERS.includes("google") && (
              <button type="button" className="btn btn-provider btn-block" onClick={() => oauth("google")} disabled={busy}>
                Continuar com Google
              </button>
            )}
            <p className="divider">ou com seu e-mail</p>
          </div>
        )}
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
            placeholder="voce@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={Boolean(error)}
          />
        </div>
        <div className="footer-cta">
          <button className="btn btn-primary btn-block" type="submit" disabled={busy}>
            {busy ? <span className="spinner" aria-hidden="true" /> : null}
            {busy ? "Enviando código…" : "Receber código"}
          </button>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={onCode} noValidate style={{ display: "contents" }}>
      <h1 className="large-title">Digite o código</h1>
      <p className="body-2">
        Enviado para <strong style={{ color: "#fff" }}>{email}</strong>. Confira também o spam — o e-mail traz um link que entra direto.
      </p>
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
        />
      </div>
      <div className="btn-row" style={{ marginTop: 12 }}>
        <button type="button" className="btn btn-text" onClick={resend} disabled={busy || cooldown > 0}>
          {cooldown > 0 ? `Reenviar em ${cooldown}s` : "Reenviar código"}
        </button>
        <button
          type="button"
          className="btn btn-text"
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
      <div className="footer-cta">
        <button className="btn btn-primary btn-block" type="submit" disabled={busy}>
          {busy ? <span className="spinner" aria-hidden="true" /> : null}
          {busy ? "Confirmando…" : "Entrar"}
        </button>
      </div>
    </form>
  );
}
