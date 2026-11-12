"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/components/CartProvider";

export function AddToCart({ productId, stock }: { productId: number; stock: number }) {
  const { add, quantityOf, loaded } = useCart();
  const inCart = quantityOf(productId);
  const available = Math.max(0, Math.min(stock, 99) - inCart);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const effectiveQty = Math.min(qty, Math.max(available, 1));

  if (stock === 0) {
    return (
      <div className="buy-box">
        <button className="btn btn--primary btn--block" disabled>
          Agotado
        </button>
      </div>
    );
  }

  return (
    <div className="buy-box">
      <div className="buy-row">
        <div className="stepper" aria-label="Cantidad">
          <button
            type="button"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            disabled={effectiveQty <= 1}
            aria-label="Quitar uno"
          >
            −
          </button>
          <span aria-live="polite">{effectiveQty}</span>
          <button
            type="button"
            onClick={() => setQty((q) => Math.min(available, q + 1))}
            disabled={effectiveQty >= available}
            aria-label="Agregar uno"
          >
            +
          </button>
        </div>
        <button
          type="button"
          className="btn btn--primary btn--grow"
          disabled={!loaded || available === 0}
          onClick={() => {
            add(productId, effectiveQty, Math.min(stock, 99));
            setQty(1);
            setAdded(true);
          }}
        >
          {available === 0 ? "Ya tienes todo el stock" : "Agregar al carrito"}
        </button>
      </div>
      {(added || inCart > 0) && (
        <p className="buy-note">
          {added ? "¡Agregado! " : ""}Tienes {inCart} en tu carrito.{" "}
          <Link href="/carrito" className="link">
            Ver carrito →
          </Link>
        </p>
      )}
    </div>
  );
}
