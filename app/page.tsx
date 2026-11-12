import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { CATEGORIES, isCategory, listProducts } from "@/lib/catalog";

type Props = { searchParams: Promise<{ cat?: string; q?: string }> };

export default async function CatalogPage({ searchParams }: Props) {
  const params = await searchParams;
  const category = isCategory(params.cat) ? params.cat : undefined;
  const q = typeof params.q === "string" ? params.q.trim().slice(0, 80) : "";
  const products = listProducts({ category, q: q || undefined });

  const hrefFor = (cat?: string) => {
    const sp = new URLSearchParams();
    if (cat) sp.set("cat", cat);
    if (q) sp.set("q", q);
    const s = sp.toString();
    return s ? `/?${s}` : "/";
  };

  return (
    <>
      <section className="hero">
        <p className="hero-eyebrow">Envíos a todo el Perú</p>
        <h1>La tecnología que necesitas, en soles y sin vueltas.</h1>
        <form className="search" action="/" role="search">
          {category && <input type="hidden" name="cat" value={category} />}
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="¿Qué estás buscando?"
            aria-label="Buscar productos"
          />
          <button type="submit" className="btn btn--primary">
            Buscar
          </button>
        </form>
      </section>

      <nav className="chips" aria-label="Categorías">
        <Link href={hrefFor()} className={`chip${!category ? " chip--active" : ""}`}>
          Todo
        </Link>
        {CATEGORIES.map((c) => (
          <Link
            key={c.slug}
            href={hrefFor(c.slug)}
            className={`chip${category === c.slug ? " chip--active" : ""}`}
          >
            {c.label}
          </Link>
        ))}
      </nav>

      {q && (
        <p className="muted results-note">
          {products.length} resultado{products.length === 1 ? "" : "s"} para “{q}”.{" "}
          <Link href={hrefFor(category)} className="link">
            Limpiar búsqueda
          </Link>
        </p>
      )}

      {products.length === 0 ? (
        <div className="empty">
          <p>No encontramos productos con esos filtros.</p>
          <Link href="/" className="btn">
            Ver todo el catálogo
          </Link>
        </div>
      ) : (
        <div className="grid">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </>
  );
}
