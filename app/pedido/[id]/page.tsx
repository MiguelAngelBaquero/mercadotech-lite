import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { formatDate, formatPrice } from "@/lib/format";

export const metadata: Metadata = { title: "Pedido — MercadoTech" };

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ nuevo?: string }> };

export default async function OrderPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { nuevo } = await searchParams;
  const user = await getCurrentUser();
  if (!user) redirect(`/ingresar?next=/pedido/${encodeURIComponent(id)}`);

  const orderId = Number(id);
  if (!Number.isSafeInteger(orderId) || orderId <= 0) notFound();

  const db = getDb();
  const order = db.prepare("SELECT id, user_id, total_cents, created_at FROM orders WHERE id = ?").get(orderId) as
    | { id: number; user_id: number; total_cents: number; created_at: string }
    | undefined;
  // Cada cliente ve solo sus pedidos; el administrador ve todos.
  if (!order || (order.user_id !== user.id && !user.isAdmin)) notFound();

  const items = db
    .prepare("SELECT product_id, name, unit_price_cents, quantity FROM order_items WHERE order_id = ?")
    .all(orderId) as { product_id: number; name: string; unit_price_cents: number; quantity: number }[];

  return (
    <div className="narrow">
      {nuevo && (
        <div className="success-hero">
          <div className="success-icon" aria-hidden="true">
            ✓
          </div>
          <h1>¡Pedido registrado!</h1>
          <p className="muted">Gracias por tu compra. No se realizó ningún cobro.</p>
        </div>
      )}
      <section className="panel">
        <div className="panel-head">
          <h2>Pedido #{order.id}</h2>
          <span className="muted">{formatDate(order.created_at)}</span>
        </div>
        <ul className="order-items">
          {items.map((it) => (
            <li key={it.product_id}>
              <span>
                <Link href={`/producto/${it.product_id}`} className="link">
                  {it.name}
                </Link>{" "}
                <span className="muted">× {it.quantity}</span>
              </span>
              <span>{formatPrice(it.unit_price_cents * it.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="summary-row summary-total">
          <span>Total</span>
          <span>{formatPrice(order.total_cents)}</span>
        </div>
      </section>
      <div className="actions-row">
        <Link href="/" className="btn btn--primary">
          Seguir comprando
        </Link>
        <Link href="/mis-pedidos" className="btn">
          Mis pedidos
        </Link>
      </div>
    </div>
  );
}
