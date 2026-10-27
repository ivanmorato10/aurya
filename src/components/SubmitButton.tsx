"use client";

import { useFormStatus } from "react-dom";

/** Botão de envio que bloqueia cliques repetidos enquanto a action roda. */
export function SubmitButton({
  children,
  pendingLabel,
  className = "btn btn-primary btn-block",
  name,
  value,
}: {
  children: React.ReactNode;
  pendingLabel: string;
  className?: string;
  name?: string;
  value?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className={className} disabled={pending} aria-disabled={pending} name={name} value={value}>
      {pending ? (
        <>
          <span className="spinner" aria-hidden="true" />
          {pendingLabel}
        </>
      ) : (
        children
      )}
    </button>
  );
}
