import Link from "next/link";
import { categoryLabel, type Product } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { ProductArt } from "./ProductArt";

export function ProductCard({ product }: { product: Product }) {
  const soldOut = product.stock === 0;
  return (
    <Link href={`/producto/${product.id}`} className={`card${soldOut ? " card--soldout" : ""}`}>
      <div className="card-media">
        <ProductArt
          uid={`c${product.id}`}
          category={product.category}
          hue={product.hue}
          name={product.name}
          imageUrl={product.imageUrl}
        />
        {soldOut ? (
          <span className="tag tag--muted">Agotado</span>
        ) : product.stock <= 5 ? (
          <span className="tag tag--warn">¡Últimas {product.stock}!</span>
        ) : null}
      </div>
      <div className="card-body">
        <span className="card-cat">{categoryLabel(product.category)}</span>
        <h3 className="card-title">{product.name}</h3>
        <span className="card-price">{formatPrice(product.priceCents)}</span>
      </div>
    </Link>
  );
}
