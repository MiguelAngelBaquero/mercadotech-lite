import Link from "next/link";

export default function NotFound() {
  return (
    <div className="empty">
      <h1 className="page-title">No encontramos esta página</h1>
      <p className="muted">Puede que el producto o el pedido ya no exista.</p>
      <Link href="/" className="btn btn--primary">
        Ir al catálogo
      </Link>
    </div>
  );
}
