import type { Metadata } from "next";
import { AppFrame } from "@/components/Screen";
import { Hero } from "@/components/ui/Hero";
import { CloseBar } from "@/components/ui/TopBar";
import { IMAGES } from "@/lib/images";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { safeNextPath } from "@/lib/validation";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "Entrar" };

export default async function EntrarPage({ searchParams }: { searchParams: Promise<{ next?: string; erro?: string }> }) {
  const params = await searchParams;
  const next = safeNextPath(params.next);
  return (
    <AppFrame>
      <Hero image={IMAGES.opening} fallback="sleep" size="medium" position="center 25%" top={<CloseBar href={next === "/conta" ? "/conta" : "/"} />} />
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
