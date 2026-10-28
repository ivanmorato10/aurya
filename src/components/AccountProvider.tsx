import { getAccount } from "@/lib/auth";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { PrefsProvider } from "./PrefsProvider";

/** Lê a sessão no servidor (se houver) e entrega ao provider do cliente. */
export async function AccountProvider({ children }: { children: React.ReactNode }) {
  let account = null;
  if (hasSupabaseEnv()) {
    try {
      account = await getAccount();
    } catch {
      account = null;
    }
  }
  return <PrefsProvider account={account}>{children}</PrefsProvider>;
}
