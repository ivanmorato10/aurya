import Link from "next/link";

export default function ReflexaoNotFound() {
  return (
    <div role="alert" style={{ margin: "auto 0" }}>
      <h1 className="large-title">Esta reflexão não está disponível.</h1>
      <p className="body-2">O link pode estar incompleto ou o texto foi retirado do catálogo.</p>
      <Link href="/hoje" className="btn btn-primary btn-block" style={{ marginTop: 20 }}>
        Ir para o momento atual
      </Link>
    </div>
  );
}
