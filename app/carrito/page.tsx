import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/auth";
import { CartView } from "./CartView";

export const metadata: Metadata = { title: "Carrito — MercadoTech" };

export default async function CartPage() {
  const user = await getCurrentUser();
  return (
    <>
      <h1 className="page-title">Tu carrito</h1>
      <CartView loggedIn={!!user} />
    </>
  );
}
