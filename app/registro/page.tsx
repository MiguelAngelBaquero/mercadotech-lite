import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { RegisterForm } from "@/components/AuthForms";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = { title: "Crear cuenta — MercadoTech" };

type Props = { searchParams: Promise<{ next?: string }> };

export default async function RegisterPage({ searchParams }: Props) {
  const { next } = await searchParams;
  const target = typeof next === "string" && next.startsWith("/") && !next.startsWith("//") ? next : "/";
  if (await getCurrentUser()) redirect(target);

  return (
    <div className="auth">
      <h1 className="page-title">Crear cuenta</h1>
      <p className="muted">Regístrate en menos de un minuto.</p>
      <RegisterForm next={target} />
    </div>
  );
}
