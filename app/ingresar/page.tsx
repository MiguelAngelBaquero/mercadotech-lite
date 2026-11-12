import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/AuthForms";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = { title: "Ingresar — MercadoTech" };

type Props = { searchParams: Promise<{ next?: string }> };

export default async function LoginPage({ searchParams }: Props) {
  const { next } = await searchParams;
  const target = typeof next === "string" && next.startsWith("/") && !next.startsWith("//") ? next : "/";
  if (await getCurrentUser()) redirect(target);

  return (
    <div className="auth">
      <h1 className="page-title">Ingresar</h1>
      <p className="muted">Entra a tu cuenta para terminar tu compra y ver tus pedidos.</p>
      <LoginForm next={target} />
    </div>
  );
}
