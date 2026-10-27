import Link from "next/link";
import { PublicFrame } from "@/components/PublicFrame";

export default function NotFound() {
  return (
    <PublicFrame>
      <h1>Página não encontrada.</h1>
      <p className="lead">O endereço pode estar incompleto.</p>
      <Link href="/" className="btn btn-primary btn-block">
        Ir para o início
      </Link>
    </PublicFrame>
  );
}
