import type { Metadata } from "next";
import Link from "next/link";
import { signOut } from "@/app/actions";
import { ProfileForm } from "@/components/ProfileForm";
import { SubmitButton } from "@/components/SubmitButton";
import { requireReadyProfile } from "@/lib/auth";
import { MOMENTS } from "@/lib/content";
import { timeZoneList } from "@/lib/timezones";
import { DeleteAccount } from "./DeleteAccount";

export const metadata: Metadata = { title: "Conta" };

export default async function ContaPage() {
  const profile = await requireReadyProfile("/conta");
  return (
    <div>
      <span className="eyebrow">Conta</span>
      <h1>Seu ritmo.</h1>
      <p className="lead">
        Conectado como <strong>{profile.email}</strong>.
      </p>

      <ProfileForm
        intent="settings"
        moments={MOMENTS}
        timeZones={timeZoneList(profile.timeZone)}
        detectTimeZone={false}
        initial={{ displayName: profile.displayName ?? "", timeZone: profile.timeZone, ...profile.schedule }}
      />

      <section className="section stack" aria-label="Sessão e dados">
        <form action={signOut}>
          <SubmitButton className="btn btn-block" pendingLabel="Saindo…">
            Sair
          </SubmitButton>
        </form>
        <DeleteAccount />
        <p className="small">
          <Link href="/privacidade">Como tratamos seus dados</Link>
        </p>
      </section>
    </div>
  );
}
