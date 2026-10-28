import type { Metadata } from "next";
import { PublicFrame } from "@/components/PublicFrame";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { safeNextPath } from "@/lib/validation";
import { LoginForm } from "./LoginForm";
import { Aury } from "@/components/Aury";

export const metadata: Metadata = { title: "Entrar" };

export default async function EntrarPage({ searchParams }: { searchParams: Promise<{ next?: string; erro?: string }> }) {
  const params = await searchParams;
  const next = safeNextPath(params.next);
  return (
    <PublicFrame>
      <div className="auth-hero">
        <Aury moment="wake" size={88} />
        <div>
          <span className="eyebrow">Acesso</span>
          <h1>
            Bom te <span className="hl">ver</span>.
          </h1>
        </div>
      </div>
      <p className="lead" style={{ marginTop: 14 }}>Digite seu e-mail e enviamos um código de uso único. Sem senha para lembrar.</p>
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
