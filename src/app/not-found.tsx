import Link from "next/link";
import { AppFrame } from "@/components/Screen";

export default function NotFound() {
  return (
    <AppFrame>
      <div style={{ margin: "auto 0" }}>
        <h1 className="large-title">Página não encontrada</h1>
        <p className="body-2">O endereço pode estar incompleto.</p>
      </div>
      <div className="footer-cta">
        <Link href="/" className="btn btn-primary btn-block">
          Ir para o início
        </Link>
      </div>
    </AppFrame>
  );
}
