"use client";

import { useActionState } from "react";
import { deleteAccount, type FormState } from "@/app/actions";
import { SubmitButton } from "@/components/SubmitButton";

export function DeleteAccount() {
  const [state, action] = useActionState<FormState, FormData>(deleteAccount, { status: "idle" });
  return (
    <form action={action} style={{ display: "contents" }}>
      <div className="field" style={{ marginTop: 0 }}>
        <label htmlFor="confirm">Digite EXCLUIR para confirmar</label>
        <input id="confirm" name="confirm" autoComplete="off" autoCapitalize="characters" required aria-invalid={state.status === "error"} />
      </div>
      {state.message && (
        <p className="alert alert-error" role="alert">
          {state.message}
        </p>
      )}
      <div className="footer-cta">
        <SubmitButton className="btn btn-danger btn-block" pendingLabel="Excluindo…">
          Excluir definitivamente
        </SubmitButton>
      </div>
    </form>
  );
}
