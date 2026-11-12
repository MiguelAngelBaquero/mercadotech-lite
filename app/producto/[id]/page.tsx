import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductArt } from "@/components/ProductArt";
import { categoryLabel, getProduct } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { AddToCart } from "./AddToCart";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = getProduct(Number((await params).id));
  return { title: product ? `${product.name} — MercadoTech` : "Producto no encontrado — MercadoTech" };
}

export default async function ProductPage({ params }: Props) {
  const product = getProduct(Number((await params).id));
  if (!product) notFound();

  return (
    <>
      <nav className="breadcrumb" aria-label="Ruta">
        <Link href="/">Catálogo</Link>
        <span aria-hidden="true">/</span>
        <Link href={`/?cat=${product.category}`}>{categoryLabel(product.category)}</Link>
      </nav>

      <article className="detail">
        <div className="detail-media">
          <ProductArt
            uid={`d${product.id}`}
            category={product.category}
            hue={product.hue}
            name={product.name}
            imageUrl={product.imageUrl}
          />
        </div>
        <div className="detail-info">
          <span className="card-cat">{categoryLabel(product.category)}</span>
          <h1 className="detail-title">{product.name}</h1>
          <p className="detail-price">{formatPrice(product.priceCents)}</p>
          <p className={`stock ${product.stock === 0 ? "stock--out" : product.stock <= 5 ? "stock--low" : ""}`}>
            {product.stock === 0
              ? "Agotado"
              : product.stock <= 5
                ? `Solo quedan ${product.stock} en stock`
                : `En stock (${product.stock} disponibles)`}
          </p>
          <p className="detail-desc">{product.description}</p>
          <AddToCart productId={product.id} stock={product.stock} />
          <ul className="perks">
            <li>Garantía oficial de 12 meses</li>
            <li>Recojo en tienda o envío a domicilio</li>
            <li>Comprobante electrónico</li>
          </ul>
        </div>
      </article>
    </>
  );
}
