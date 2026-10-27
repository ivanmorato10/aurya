import Link from "next/link";

export default function ReflexaoNotFound() {
  return (
    <div className="card stack" role="alert">
      <h2>Esta reflexão não está disponível.</h2>
      <p className="note">O link pode estar incompleto ou o texto foi retirado do catálogo.</p>
      <Link href="/hoje" className="btn btn-primary btn-block">
        Ir para o momento atual
      </Link>
    </div>
  );
}
