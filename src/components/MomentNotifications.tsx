"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefs } from "@/components/PrefsProvider";
import { activeOccurrence, localNow, pickForPrefs } from "@/lib/schedule";
import type { Affirmation } from "@/lib/content";

const STORAGE_KEY = "aurya.moment-notifications.v1";

export function MomentNotifications({ affirmations, showSettings = false }: { affirmations: Affirmation[]; showSettings?: boolean }) {
  const { prefs } = usePrefs();
  const [enabled, setEnabled] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission | "unsupported">("unsupported");
  const [message, setMessage] = useState("");
  const lastSent = useRef("");

  useEffect(() => {
    if (!("Notification" in window)) return;
    setPermission(Notification.permission);
    setEnabled(window.localStorage.getItem(STORAGE_KEY) === "on");
  }, []);

  useEffect(() => {
    if (!enabled || !prefs || permission !== "granted") return;
    const tick = () => {
      if (document.visibilityState !== "visible") return;
      const now = localNow(prefs.timeZone);
      const occurrence = activeOccurrence(prefs.schedule, now);
      if (occurrence.day.year !== now.year || occurrence.day.month !== now.month || occurrence.day.day !== now.day) return;
      const scheduled = prefs.schedule[occurrence.moment];
      const [hour, minute] = scheduled.split(":").map(Number);
      if (now.minute !== hour * 60 + minute) return;
      const key = [now.year, now.month, now.day, occurrence.moment].join("-");
      if (lastSent.current === key || window.localStorage.getItem("aurya.sent." + key) === "yes") return;
      const item = pickForPrefs(affirmations, occurrence.moment, occurrence.day, { types: prefs.types, includeQuotes: prefs.includeQuotes });
      lastSent.current = key;
      window.localStorage.setItem("aurya.sent." + key, "yes");
      try {
        const n = new Notification("AURYA · Seu momento chegou", { body: item.text, icon: "/icon.svg", tag: "aurya-" + key });
        n.onclick = () => { window.focus(); window.location.assign("/reflexao/" + encodeURIComponent(item.id)); n.close(); };
      } catch { setMessage("Este navegador não conseguiu exibir a notificação."); }
    };
    tick();
    const id = window.setInterval(tick, 15000);
    return () => window.clearInterval(id);
  }, [enabled, permission, prefs, affirmations]);

  const enable = async () => {
    if (!("Notification" in window)) { setMessage("Notificações indisponíveis neste navegador."); return; }
    const result = await Notification.requestPermission();
    setPermission(result);
    if (result === "granted") {
      window.localStorage.setItem(STORAGE_KEY, "on");
      setEnabled(true);
      setMessage("Avisos ativados enquanto o AURYA estiver aberto. Para receber com o app fechado, ainda será necessário configurar push.");
    } else setMessage("Permissão não concedida. Você pode alterá-la nas configurações do navegador.");
  };
  const disable = () => { window.localStorage.setItem(STORAGE_KEY, "off"); setEnabled(false); setMessage("Avisos desativados neste aparelho."); };

  if (!showSettings) return null;
  return <section className="aurya-notification-preferences" aria-label="Avisos dos momentos">
    <h2 className="section-title">Avisos dos momentos</h2>
    <p className="body-2">Receba um aviso com a frase do momento enquanto o AURYA estiver aberto. Avisos com o aplicativo fechado ainda não estão disponíveis.</p>
    {permission === "unsupported" ? <p className="caption">Este navegador não oferece notificações nesta modalidade.</p> :
      <button type="button" className="btn btn-primary btn-block" onClick={enabled ? disable : enable}>{enabled && permission === "granted" ? "Desativar avisos" : "Ativar avisos"}</button>}
    {message && <p className="caption" role="status">{message}</p>}
  </section>;
}
