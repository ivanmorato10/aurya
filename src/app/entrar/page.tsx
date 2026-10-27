import type { Metadata } from "next";
import { PublicFrame } from "@/components/PublicFrame";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { safeNextPath } from "@/lib/validation";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "Entrar" };

export default async function EntrarPage({ searchParams }: { searchParams: Promise<{ next?: string; erro?: string }> }) {
  const params = await searchParams;
  const next = safeNextPath(params.next);
  return (
    <PublicFrame>
      <span className="eyebrow">Acesso</span>
      <h1>Entre com seu e-mail.</h1>
      <p className="lead">Enviamos um código de uso único. Sem senha para lembrar.</p>
      {hasSupabaseEnv() ? (
        <LoginForm next={next} linkError={params.erro === "link"} />
      ) : (
        <p className="alert alert-error" role="alert">
          O acesso está temporariamente indisponível. Tente novamente mais tarde.
        </p>
      )}
    </PublicFrame>
  );
}
