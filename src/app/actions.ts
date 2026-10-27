"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getUserClaims } from "@/lib/auth";
import { profileSchema, safeNextPath } from "@/lib/validation";

export type FormState = {
  status: "idle" | "error" | "success";
  message?: string;
  fieldErrors?: Partial<Record<string, string>>;
  values?: Record<string, string>;
};

const FIELDS = ["displayName", "timeZone", "wake", "commute", "midday", "sleep"] as const;

export async function saveProfile(_prev: FormState, formData: FormData): Promise<FormState> {
  const values = Object.fromEntries(FIELDS.map((f) => [f, String(formData.get(f) ?? "")]));
  const claims = await getUserClaims();
  if (!claims) return { status: "error", message: "Sua sessão terminou. Entre novamente.", values };

  const parsed = profileSchema.safeParse(values);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) fieldErrors[String(issue.path[0])] ??= issue.message;
    return { status: "error", message: "Revise os campos destacados.", fieldErrors, values };
  }

  const p = parsed.data;
  const supabase = await createClient();
  // O id vem do JWT verificado; a RLS também restringe a atualização ao próprio perfil.
  const { data, error } = await supabase
    .from("profiles")
    .update({
      display_name: p.displayName,
      time_zone: p.timeZone,
      wake_time: p.wake,
      commute_time: p.commute,
      midday_time: p.midday,
      sleep_time: p.sleep,
    })
    .eq("id", claims.id)
    .select("id");

  if (error || !data?.length) {
    return { status: "error", message: "Não foi possível salvar agora. Seus dados continuam no formulário; tente novamente.", values };
  }

  revalidatePath("/", "layout");
  if (formData.get("intent") === "onboarding") redirect(safeNextPath(formData.get("next")));
  return { status: "success", message: "Horários salvos.", values };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function deleteAccount(_prev: FormState, formData: FormData): Promise<FormState> {
  const claims = await getUserClaims();
  if (!claims) return { status: "error", message: "Sua sessão terminou. Entre novamente." };
  if (String(formData.get("confirm") ?? "").trim().toUpperCase() !== "EXCLUIR") {
    return { status: "error", message: "Digite EXCLUIR para confirmar." };
  }
  const supabase = await createClient();
  const { error } = await supabase.rpc("delete_my_account");
  if (error) return { status: "error", message: "Não foi possível excluir a conta agora. Tente novamente." };
  // A conta já não existe; limpar os cookies locais da sessão.
  await supabase.auth.signOut({ scope: "local" }).catch(() => undefined);
  redirect("/?conta=excluida");
}
