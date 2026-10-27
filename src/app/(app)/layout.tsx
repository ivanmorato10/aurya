import { Brand } from "@/components/Logo";
import { TabBar } from "@/components/TabBar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TabBar />
      <div className="shell">
        <header className="topbar">
          <Brand href="/hoje" />
        </header>
        <main id="conteudo" tabIndex={-1}>
          {children}
        </main>
      </div>
    </>
  );
}
