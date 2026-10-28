import { useId } from "react";

/** Campo de texto com rótulo, dica e erro associados por aria. */
export function TextField({ label, hint, error, id, ...input }: { label: string; hint?: string; error?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  const auto = useId();
  const fieldId = id ?? auto;
  const describedBy = [hint && `${fieldId}-hint`, error && `${fieldId}-error`].filter(Boolean).join(" ") || undefined;
  return (
    <div className="field">
      <label htmlFor={fieldId}>{label}</label>
      <input id={fieldId} aria-invalid={Boolean(error) || undefined} aria-describedby={describedBy} {...input} />
      {hint && (
        <span id={`${fieldId}-hint`} className="hint">
          {hint}
        </span>
      )}
      {error && (
        <p id={`${fieldId}-error`} className="field-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
