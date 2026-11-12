"use client";

import Link from "next/link";
import { useActionState } from "react";
import { loginAction, registerAction, type FormState } from "@/app/actions";

const initial: FormState = {};

function nextQuery(next: string) {
  return next && next !== "/" ? `?next=${encodeURIComponent(next)}` : "";
}

export function LoginForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState(loginAction, initial);
  return (
    <form action={action} className="form">
      <input type="hidden" name="next" value={next} />
      <label>
        Correo
        <input name="email" type="email" autoComplete="email" required defaultValue={state.values?.email} />
      </label>
      <label>
        Contraseña
        <input name="password" type="password" autoComplete="current-password" required />
      </label>
      {state.error && (
        <p className="alert alert--error" role="alert">
          {state.error}
        </p>
      )}
      <button className="btn btn--primary btn--block" disabled={pending}>
        {pending ? "Ingresando…" : "Ingresar"}
      </button>
      <p className="muted center">
        ¿No tienes cuenta?{" "}
        <Link href={`/registro${nextQuery(next)}`} className="link">
          Regístrate
        </Link>
      </p>
    </form>
  );
}

export function RegisterForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState(registerAction, initial);
  return (
    <form action={action} className="form">
      <input type="hidden" name="next" value={next} />
      <label>
        Nombre
        <input name="name" autoComplete="name" required minLength={2} maxLength={80} defaultValue={state.values?.name} />
      </label>
      <label>
        Correo
        <input name="email" type="email" autoComplete="email" required defaultValue={state.values?.email} />
      </label>
      <label>
        Contraseña
        <input name="password" type="password" autoComplete="new-password" required minLength={8} />
        <span className="hint">Mínimo 8 caracteres.</span>
      </label>
      {state.error && (
        <p className="alert alert--error" role="alert">
          {state.error}
        </p>
      )}
      <button className="btn btn--primary btn--block" disabled={pending}>
        {pending ? "Creando cuenta…" : "Crear cuenta"}
      </button>
      <p className="muted center">
        ¿Ya tienes cuenta?{" "}
        <Link href={`/ingresar${nextQuery(next)}`} className="link">
          Inicia sesión
        </Link>
      </p>
    </form>
  );
}
