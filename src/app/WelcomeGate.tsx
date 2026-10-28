"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { clearLocalPrefs, usePrefs } from "@/components/PrefsProvider";

/** Quem já configurou o app neste aparelho vai direto para Hoje. */
export function WelcomeGate({ deleted }: { deleted: boolean }) {
  const { ready, prefs } = usePrefs();
  const router = useRouter();
  useEffect(() => {
    if (deleted) clearLocalPrefs();
    else if (ready && prefs) router.replace("/hoje");
  }, [deleted, ready, prefs, router]);
  return null;
}
