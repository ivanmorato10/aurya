"use client";

import { useActionState, useState } from "react";
import { deleteAccount, type FormState } from "@/app/actions";
import { SubmitButton } from "@/components/SubmitButton";

export function DeleteAccount() {
  const [open, setOpen] = useState(false);
  const [state, action] = useActionState<FormState, FormData>(deleteAccount, { status: "idle" });

  if (!open) {
    return (
      <button className="btn btn-danger btn-block" onClick={() => setOpen(true)}>
        Excluir minha conta
      </button>
    );
  }

  return (
    <form action={action} className="card stack" aria-labelledby="excluir-titulo">
      <h3 id="excluir-titulo">Excluir conta definitivamente</h3>
      <p className="note" style={{ margin: 0 }}>
        Apaga sua conta, e-mail, nome e horários. Não é possível desfazer.
      </p>
      <div className="field" style={{ marginTop: 0 }}>
        <label htmlFor="confirm">Digite EXCLUIR para confirmar</label>
        <input id="confirm" name="confirm" autoComplete="off" autoCapitalize="characters" required aria-invalid={state.status === "error"} />
      </div>
      {state.message && (
        <p className="alert alert-error" role="alert">
          {state.message}
        </p>
      )}
      <div className="btn-row">
        <button type="button" className="btn" onClick={() => setOpen(false)}>
          Cancelar
        </button>
        <SubmitButton className="btn btn-danger" pendingLabel="Excluindo…">
          Excluir
        </SubmitButton>
      </div>
    </form>
  );
}
