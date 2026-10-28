"use client";

import { useRouter } from "next/navigation";
import { CloseBar } from "@/components/ui/TopBar";

/** Volta para a tela anterior (Início ou Afirmações); sem histórico, vai para o Início. */
export function BackBar() {
  const router = useRouter();
  return <CloseBar label="Voltar" onClose={() => (window.history.length > 1 ? router.back() : router.push("/hoje"))} />;
}
