/** Estados de tela: carregando, vazio e erro — sempre com texto, nunca só ícone. */
export function LoadingState({ label = "Carregando…", height = 320 }: { label?: string; height?: number }) {
  return (
    <div aria-busy="true" aria-live="polite">
      <span className="sr-only">{label}</span>
      <div className="skeleton" style={{ height }} />
    </div>
  );
}

export function EmptyState({ title, text, action }: { title: string; text?: string; action?: React.ReactNode }) {
  return (
    <div className="state">
      <p className="title">{title}</p>
      {text && <p className="caption">{text}</p>}
      {action}
    </div>
  );
}

export function ErrorState({ title = "Algo não carregou", text = "Pode ser a conexão. Seus dados estão preservados.", onRetry }: { title?: string; text?: string; onRetry?: () => void }) {
  return (
    <div className="state" role="alert">
      <p className="title">{title}</p>
      <p className="caption">{text}</p>
      {onRetry && (
        <button type="button" className="btn btn-primary" onClick={onRetry}>
          Tentar novamente
        </button>
      )}
    </div>
  );
}
