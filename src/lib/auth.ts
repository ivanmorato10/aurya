import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "./supabase/server";
import { isValidSchedule, isValidTimeZone, type Schedule } from "./schedule";

export type Profile = {
  id: string;
  email: string | null;
  displayName: string | null;
  timeZone: string;
  schedule: Schedule | null;
};

const hhmm = (v: string | null) => (v ? v.slice(0, 5) : "");

/** Id verificado pela assinatura do JWT (getClaims), nunca por dado enviado pelo navegador. */
export const getUserClaims = cache(async () => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims?.sub) return null;
  return { id: data.claims.sub as string, email: (data.claims.email as string | undefined) ?? null };
});

export const getProfile = cache(async (): Promise<Profile | null> => {
  const claims = await getUserClaims();
  if (!claims) return null;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, display_name, time_zone, wake_time, commute_time, midday_time, sleep_time")
    .eq("id", claims.id)
    .maybeSingle();
  if (error) throw new Error("Não foi possível carregar o perfil.");
  if (!data) return null;
  const schedule = {
    wake: hhmm(data.wake_time),
    commute: hhmm(data.commute_time),
    midday: hhmm(data.midday_time),
    sleep: hhmm(data.sleep_time),
  };
  return {
    id: data.id,
    email: claims.email,
    displayName: data.display_name,
    timeZone: isValidTimeZone(data.time_zone) ? data.time_zone : "America/Sao_Paulo",
    schedule: isValidSchedule(schedule) ? schedule : null,
  };
});

/** Exige sessão; envia para o login preservando o destino. */
export async function requireProfile(nextPath: string): Promise<Profile> {
  const profile = await getProfile();
  if (!profile) redirect(`/entrar?next=${encodeURIComponent(nextPath)}`);
  return profile;
}

/** Exige sessão e os quatro horários definidos. */
export async function requireReadyProfile(nextPath: string): Promise<Profile & { schedule: Schedule }> {
  const profile = await requireProfile(nextPath);
  if (!profile.schedule) redirect(`/comecar?next=${encodeURIComponent(nextPath)}`);
  return profile as Profile & { schedule: Schedule };
}
