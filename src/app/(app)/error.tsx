"use client";

export default function AppError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="card stack" role="alert">
      <h2>Algo não carregou.</h2>
      <p className="note">Pode ser a conexão ou uma instabilidade momentânea. Seus dados estão preservados.</p>
      <button className="btn btn-primary btn-block" onClick={reset}>
        Tentar novamente
      </button>
    </div>
  );
}
