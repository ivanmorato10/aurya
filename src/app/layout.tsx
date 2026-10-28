import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Fraunces } from "next/font/google";
import { Orbs } from "@/components/Decor";
import "./globals.css";

const bricolage = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-bricolage", display: "swap" });
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces", display: "swap", style: ["italic"], axes: ["SOFT", "WONK"] });

export const metadata: Metadata = {
  title: { default: "AURYA · um instante de presença", template: "%s · AURYA" },
  description: "Uma afirmação para cada um dos quatro momentos do seu dia: ao acordar, a caminho, no meio do dia e antes de dormir.",
  applicationName: "AURYA",
  appleWebApp: { capable: true, title: "AURYA", statusBarStyle: "black-translucent" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#fff6ee",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${bricolage.variable} ${fraunces.variable}`}>
      <body>
        <a className="skip-link" href="#conteudo">
          Pular para o conteúdo
        </a>
        <Orbs />
        {children}
      </body>
    </html>
  );
}
