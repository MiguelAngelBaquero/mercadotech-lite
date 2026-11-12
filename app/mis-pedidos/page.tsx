import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { formatDate, formatPrice } from "@/lib/format";

export const metadata: Metadata = { title: "Mis pedidos — MercadoTech" };

export default async function MyOrdersPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/ingresar?next=/mis-pedidos");

  const orders = getDb()
    .prepare(
      `SELECT o.id, o.total_cents, o.created_at, COALESCE(SUM(i.quantity), 0) AS units
         FROM orders o LEFT JOIN order_items i ON i.order_id = o.id
        WHERE o.user_id = ?
        GROUP BY o.id
        ORDER BY o.id DESC`,
    )
    .all(user.id) as { id: number; total_cents: number; created_at: string; units: number }[];

  return (
    <div className="narrow">
      <h1 className="page-title">Mis pedidos</h1>
      <p className="muted">Hola, {user.name}.</p>
      {orders.length === 0 ? (
        <div className="empty">
          <p>Todavía no tienes pedidos.</p>
          <Link href="/" className="btn btn--primary">
            Ver productos
          </Link>
        </div>
      ) : (
        <ul className="order-list">
          {orders.map((o) => (
            <li key={o.id}>
              <Link href={`/pedido/${o.id}`} className="panel order-row">
                <span>
                  <strong>Pedido #{o.id}</strong>
                  <span className="muted small block">
                    {formatDate(o.created_at)} · {o.units} producto{o.units === 1 ? "" : "s"}
                  </span>
                </span>
                <strong>{formatPrice(o.total_cents)}</strong>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
