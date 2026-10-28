"use client";

import { createContext, use, useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { savePreferences, type FormState } from "@/app/actions";
import { clearLocalPrefs, readLocalPrefs, toInput, writeLocalPrefs, type Prefs } from "@/lib/prefs";
import { onboardingSchema } from "@/lib/validation";

export type Account = { email: string | null; prefs: Prefs | null };

type Ctx = {
  /** false até ler o aparelho (visitante) — evita piscar a tela errada. */
  ready: boolean;
  prefs: Prefs | null;
  account: Account | null;
  save: (p: Prefs) => Promise<FormState>;
  /** Preferências do aparelho foram levadas para a conta agora. */
  imported: boolean;
};

const PrefsContext = createContext<Ctx | null>(null);

export function PrefsProvider({ account, children }: { account: Account | null; children: React.ReactNode }) {
  const router = useRouter();
  const [local, setLocal] = useState<Prefs | null>(null);
  const [ready, setReady] = useState(Boolean(account?.prefs));
  const [imported, setImported] = useState(false);
  const importing = useRef(false);

  useEffect(() => {
    const stored = readLocalPrefs();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- leitura do aparelho só existe no navegador
    setLocal(stored);
    setReady(true);
    if (account?.prefs) writeLocalPrefs(account.prefs);
    // Conta nova sem preferências: leva as do aparelho (migração ao cadastro).
    if (account && !account.prefs && stored && !importing.current) {
      importing.current = true;
      void savePreferences(toInput(stored)).then((r) => {
        if (r.status === "success") {
          setImported(true);
          router.refresh();
        }
      });
    }
  }, [account, router]);

  // Conta sem preferências ainda: usa as do aparelho enquanto elas são levadas para a conta.
  const prefs = account ? (account.prefs ?? local) : local;

  const save = useCallback(
    async (p: Prefs): Promise<FormState> => {
      const input = toInput(p);
      if (account) {
        const result = await savePreferences(input);
        if (result.status === "success") {
          writeLocalPrefs(p);
          router.refresh();
        }
        return result;
      }
      const parsed = onboardingSchema.safeParse(input);
      if (!parsed.success) {
        const errors: Record<string, string> = {};
        for (const issue of parsed.error.issues) errors[String(issue.path.at(-1) ?? "form")] ??= issue.message;
        return { status: "error", message: "Revise os campos destacados.", fieldErrors: errors };
      }
      if (!writeLocalPrefs(p)) return { status: "error", message: "Este navegador não permite guardar dados. Crie uma conta para salvar." };
      setLocal(p);
      return { status: "success", message: "Salvo neste aparelho." };
    },
    [account, router],
  );

  return <PrefsContext value={{ ready, prefs, account, save, imported }}>{children}</PrefsContext>;
}

export function usePrefs() {
  const ctx = use(PrefsContext);
  if (!ctx) throw new Error("usePrefs fora do PrefsProvider");
  return ctx;
}

export { clearLocalPrefs };
