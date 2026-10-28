"use client";

export default function AppError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div role="alert" style={{ margin: "auto 0" }}>
      <h1 className="large-title">Algo não carregou</h1>
      <p className="body-2">Pode ser a conexão ou uma instabilidade momentânea. Seus dados estão preservados.</p>
      <button className="btn btn-primary btn-block" style={{ marginTop: 20 }} onClick={reset}>
        Tentar novamente
      </button>
    </div>
  );
}
