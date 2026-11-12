"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { checkoutAction, getCartProducts, type CartProduct } from "@/app/actions";
import { useCart } from "@/components/CartProvider";
import { ProductArt } from "@/components/ProductArt";
import { formatPrice } from "@/lib/format";

export function CartView({ loggedIn }: { loggedIn: boolean }) {
  const { items, loaded, setQuantity, remove, clear } = useCart();
  const router = useRouter();
  const [products, setProducts] = useState<Map<number, CartProduct> | null>(null);
  const [reload, setReload] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const idsKey = items
    .map((i) => i.productId)
    .sort((a, b) => a - b)
    .join(",");

  useEffect(() => {
    if (!loaded) return;
    const ids = idsKey ? idsKey.split(",").map(Number) : [];
    let cancelled = false;
    getCartProducts(ids).then((list) => {
      if (!cancelled) setProducts(new Map(list.map((p) => [p.id, p])));
    });
    return () => {
      cancelled = true;
    };
  }, [idsKey, loaded, reload]);

  if (!loaded || products === null) {
    return <p className="muted">Cargando tu carrito…</p>;
  }

  const lines = items
    .map((item) => ({ item, product: products.get(item.productId) }))
    .filter((l): l is { item: (typeof items)[number]; product: CartProduct } => !!l.product);
  const missing = items.length - lines.length;
  const total = lines.reduce((sum, l) => sum + l.product.priceCents * l.item.quantity, 0);
  const units = lines.reduce((n, l) => n + l.item.quantity, 0);
  const stockProblem = lines.some((l) => l.item.quantity > l.product.stock);

  if (lines.length === 0) {
    return (
      <div className="empty">
        <p>Tu carrito está vacío.</p>
        <Link href="/" className="btn btn--primary">
          Ver productos
        </Link>
      </div>
    );
  }

  const checkout = () => {
    setError(null);
    startTransition(async () => {
      const result = await checkoutAction(lines.map((l) => ({ productId: l.item.productId, quantity: l.item.quantity })));
      if (result.ok) {
        clear();
        router.push(`/pedido/${result.orderId}?nuevo=1`);
      } else {
        setError(result.error);
        if (result.needsLogin) router.push("/ingresar?next=/carrito");
        else setReload((n) => n + 1);
      }
    });
  };

  return (
    <div className="cart">
      <ul className="cart-lines">
        {lines.map(({ item, product }) => {
          const over = item.quantity > product.stock;
          return (
            <li key={product.id} className="cart-line">
              <Link href={`/producto/${product.id}`} className="cart-thumb">
                <ProductArt
                  uid={`k${product.id}`}
                  category={product.category}
                  hue={product.hue}
                  name={product.name}
                  imageUrl={product.imageUrl}
                />
              </Link>
              <div className="cart-line-info">
                <Link href={`/producto/${product.id}`} className="cart-line-name">
                  {product.name}
                </Link>
                <span className="muted">{formatPrice(product.priceCents)} c/u</span>
                {over && (
                  <span className="stock stock--out">
                    {product.stock === 0 ? "Agotado" : `Solo quedan ${product.stock}`}
                  </span>
                )}
                <div className="cart-line-actions">
                  <div className="stepper stepper--sm">
                    <button
                      type="button"
                      onClick={() => setQuantity(product.id, item.quantity - 1)}
                      aria-label={`Quitar uno de ${product.name}`}
                    >
                      −
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity(product.id, item.quantity + 1)}
                      disabled={item.quantity >= product.stock}
                      aria-label={`Agregar uno de ${product.name}`}
                    >
                      +
                    </button>
                  </div>
                  {over && product.stock > 0 && (
                    <button type="button" className="link" onClick={() => setQuantity(product.id, product.stock)}>
                      Ajustar a {product.stock}
                    </button>
                  )}
                  <button type="button" className="link link--danger" onClick={() => remove(product.id)}>
                    Quitar
                  </button>
                </div>
              </div>
              <strong className="cart-line-total">{formatPrice(product.priceCents * item.quantity)}</strong>
            </li>
          );
        })}
      </ul>

      <aside className="summary">
        <h2>Resumen</h2>
        {missing > 0 && <p className="muted">Se quitaron productos que ya no están disponibles.</p>}
        <div className="summary-row">
          <span>
            Productos ({units})
          </span>
          <span>{formatPrice(total)}</span>
        </div>
        <div className="summary-row">
          <span>Envío</span>
          <span>Gratis</span>
        </div>
        <div className="summary-row summary-total">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
        {error && (
          <p className="alert alert--error" role="alert">
            {error}
          </p>
        )}
        {loggedIn ? (
          <button
            type="button"
            className="btn btn--primary btn--block"
            onClick={checkout}
            disabled={pending || stockProblem}
          >
            {pending ? "Registrando pedido…" : "Confirmar pedido"}
          </button>
        ) : (
          <Link href="/ingresar?next=/carrito" className="btn btn--primary btn--block">
            Inicia sesión para comprar
          </Link>
        )}
        {stockProblem && <p className="muted small">Ajusta las cantidades marcadas para continuar.</p>}
        <p className="muted small">No se realiza ningún cobro: el pedido queda registrado.</p>
      </aside>
    </div>
  );
}
