"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getUserClaims } from "@/lib/auth";
import { onboardingSchema } from "@/lib/validation";

export type FormState = {
  status: "idle" | "error" | "success";
  message?: string;
  fieldErrors?: Partial<Record<string, string>>;
};

/**
 * Salva todas as preferências na conta. Recebe o objeto inteiro (horários, tipos
 * de mensagem e nome) e valida no servidor; o id vem do JWT verificado e a RLS
 * restringe a atualização ao próprio perfil.
 */
export async function savePreferences(input: unknown): Promise<FormState> {
  const parsed = onboardingSchema.safeParse(input);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) errors[String(issue.path.at(-1) ?? "form")] ??= issue.message;
    return { status: "error", message: "Revise os campos destacados.", fieldErrors: errors };
  }
  const claims = await getUserClaims();
  if (!claims) return { status: "error", message: "Sua sessão terminou. Entre novamente." };

  const { schedule: s, messages: m, name } = parsed.data;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .update({
      time_zone: s.timeZone,
      wake_time: s.wake,
      commute_time: s.commute,
      midday_time: s.midday,
      sleep_time: s.sleep,
      message_types: m.types,
      include_quotes: m.includeQuotes,
      display_name: name.displayName,
    })
    .eq("id", claims.id)
    .select("id");
  if (error || !data?.length) {
    return { status: "error", message: "Não foi possível salvar agora. Suas escolhas continuam aqui; tente novamente." };
  }
  revalidatePath("/", "layout");
  return { status: "success", message: "Salvo." };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/conta");
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
  revalidatePath("/", "layout");
  redirect("/?conta=excluida");
}
