import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { CATEGORIES, categoryLabel, listProducts } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { ProductForm } from "./ProductForm";

export const metadata: Metadata = { title: "Administración — MercadoTech" };

export default async function AdminPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/ingresar?next=/admin");
  if (!user.isAdmin) {
    return (
      <div className="empty">
        <p>Esta página es solo para el administrador de la tienda.</p>
        <Link href="/" className="btn">
          Volver al catálogo
        </Link>
      </div>
    );
  }

  const products = listProducts();

  return (
    <div className="admin">
      <section>
        <h1 className="page-title">Nuevo producto</h1>
        <ProductForm categories={CATEGORIES.map((c) => ({ slug: c.slug, label: c.label }))} />
      </section>
      <section>
        <h2 className="section-title">Catálogo ({products.length})</h2>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Categoría</th>
                <th className="num">Precio</th>
                <th className="num">Stock</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>
                    <Link href={`/producto/${p.id}`} className="link">
                      {p.name}
                    </Link>
                  </td>
                  <td>{categoryLabel(p.category)}</td>
                  <td className="num">{formatPrice(p.priceCents)}</td>
                  <td className={`num ${p.stock === 0 ? "stock--out" : p.stock <= 5 ? "stock--low" : ""}`}>
                    {p.stock}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
