import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { AccountProvider } from "@/components/AccountProvider";
import "./globals.css";

// Fontes do Brand Kit (licença OFL), servidas pelo próprio app via next/font.
const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["300", "400", "500"], style: ["normal", "italic"], variable: "--font-cormorant", display: "swap" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  title: { default: "AURYA · um instante de presença", template: "%s · AURYA" },
  description: "Uma afirmação para cada um dos quatro momentos do seu dia: ao acordar, a caminho, no meio do dia e antes de dormir.",
  applicationName: "AURYA",
  appleWebApp: { capable: true, title: "AURYA", statusBarStyle: "black-translucent" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#101C2C",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${cormorant.variable} ${inter.variable}`}>
      <body>
        <a className="skip-link" href="#conteudo">
          Pular para o conteúdo
        </a>
        <AccountProvider>{children}</AccountProvider>
      </body>
    </html>
  );
}
