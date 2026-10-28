import { AFFIRMATIONS } from "@/lib/content";
import { MomentNotifications } from "@/components/MomentNotifications";
import { TabBar } from "@/components/TabBar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="app app--tabs">
        <main id="conteudo" tabIndex={-1} className="screen">
          {children}
        </main>
      </div>
      <MomentNotifications affirmations={AFFIRMATIONS} />
      <TabBar />
    </>
  );
}
