import { getDb } from "./db";

export const CATEGORIES = [
  { slug: "laptops", label: "Laptops" },
  { slug: "celulares", label: "Celulares" },
  { slug: "tablets", label: "Tablets" },
  { slug: "audio", label: "Audio" },
  { slug: "monitores", label: "Monitores" },
  { slug: "wearables", label: "Wearables" },
  { slug: "accesorios", label: "Accesorios" },
] as const;

export type CategorySlug = (typeof CATEGORIES)[number]["slug"];

export function isCategory(value: unknown): value is CategorySlug {
  return CATEGORIES.some((c) => c.slug === value);
}

export function categoryLabel(slug: string): string {
  return CATEGORIES.find((c) => c.slug === slug)?.label ?? slug;
}

export type Product = {
  id: number;
  name: string;
  description: string;
  category: string;
  priceCents: number;
  stock: number;
  imageUrl: string | null;
  hue: number;
};

type ProductRow = {
  id: number;
  name: string;
  description: string;
  category: string;
  price_cents: number;
  stock: number;
  image_url: string | null;
  hue: number;
};

// Objeto plano (las filas de node:sqlite no tienen prototipo) para pasarlo a componentes cliente.
function toProduct(r: ProductRow): Product {
  return {
    id: r.id,
    name: r.name,
    description: r.description,
    category: r.category,
    priceCents: r.price_cents,
    stock: r.stock,
    imageUrl: r.image_url,
    hue: r.hue,
  };
}

const COLUMNS = "id, name, description, category, price_cents, stock, image_url, hue";

export function listProducts(filter: { category?: string; q?: string } = {}): Product[] {
  const where: string[] = [];
  const args: string[] = [];
  if (filter.category) {
    where.push("category = ?");
    args.push(filter.category);
  }
  if (filter.q) {
    const escaped = filter.q.replace(/[\\%_]/g, (c) => `\\${c}`);
    where.push("(name LIKE ? ESCAPE '\\' OR description LIKE ? ESCAPE '\\')");
    args.push(`%${escaped}%`, `%${escaped}%`);
  }
  const sql = `SELECT ${COLUMNS} FROM products ${where.length ? `WHERE ${where.join(" AND ")}` : ""}
               ORDER BY stock = 0, id DESC`;
  return (getDb().prepare(sql).all(...args) as ProductRow[]).map(toProduct);
}

export function getProduct(id: number): Product | null {
  if (!Number.isSafeInteger(id) || id <= 0) return null;
  const row = getDb().prepare(`SELECT ${COLUMNS} FROM products WHERE id = ?`).get(id) as ProductRow | undefined;
  return row ? toProduct(row) : null;
}

export function getProductsByIds(ids: number[]): Product[] {
  if (ids.length === 0) return [];
  const placeholders = ids.map(() => "?").join(",");
  return (
    getDb().prepare(`SELECT ${COLUMNS} FROM products WHERE id IN (${placeholders})`).all(...ids) as ProductRow[]
  ).map(toProduct);
}
