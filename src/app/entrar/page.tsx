import type { Metadata } from "next";
import { AppFrame, NavBar } from "@/components/Screen";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { safeNextPath } from "@/lib/validation";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "Entrar" };

export default async function EntrarPage({ searchParams }: { searchParams: Promise<{ next?: string; erro?: string }> }) {
  const params = await searchParams;
  const next = safeNextPath(params.next);
  return (
    <AppFrame>
      <NavBar back={next === "/conta" ? "/conta" : "/"} />
      {hasSupabaseEnv() ? (
        <LoginForm next={next} linkError={params.erro ?? null} />
      ) : (
        <>
          <h1 className="large-title">Entrar</h1>
          <p className="alert alert-error" role="alert">
            O acesso está temporariamente indisponível. Tente novamente mais tarde.
          </p>
        </>
      )}
    </AppFrame>
  );
}
