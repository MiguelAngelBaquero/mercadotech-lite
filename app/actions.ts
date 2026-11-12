"use server";

import { redirect } from "next/navigation";
import { createSession, destroySession, getCurrentUser } from "@/lib/auth";
import { getProductsByIds, isCategory, type Product } from "@/lib/catalog";
import { getDb, tx } from "@/lib/db";
import { hashPassword, verifyPassword } from "@/lib/password";

export type FormState = {
  error?: string;
  success?: string;
  values?: Record<string, string>;
  key?: number;
};

const field = (fd: FormData, name: string) => {
  const v = fd.get(name);
  return typeof v === "string" ? v : "";
};

/** Solo permite redirigir a rutas internas (evita redirecciones abiertas). */
function safeNext(value: string): string {
  return value.startsWith("/") && !value.startsWith("//") && !value.startsWith("/\\") ? value : "/";
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ---------- Cuenta ----------

export async function registerAction(_prev: FormState, fd: FormData): Promise<FormState> {
  const name = field(fd, "name").trim();
  const email = field(fd, "email").trim().toLowerCase();
  const password = field(fd, "password");
  const values = { name, email };

  if (name.length < 2 || name.length > 80) return { error: "Escribe tu nombre (de 2 a 80 caracteres).", values };
  if (!EMAIL_RE.test(email) || email.length > 200) return { error: "Ese correo no es válido.", values };
  if (password.length < 8 || password.length > 200)
    return { error: "La contraseña debe tener al menos 8 caracteres.", values };

  const db = getDb();
  let userId: number;
  try {
    const result = db
      .prepare("INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)")
      .run(name, email, hashPassword(password));
    userId = Number(result.lastInsertRowid);
  } catch (err) {
    if (err instanceof Error && /UNIQUE/i.test(err.message)) {
      return { error: "Ya existe una cuenta con ese correo. Inicia sesión.", values };
    }
    throw err;
  }
  await createSession(userId);
  redirect(safeNext(field(fd, "next")));
}

export async function loginAction(_prev: FormState, fd: FormData): Promise<FormState> {
  const email = field(fd, "email").trim().toLowerCase();
  const password = field(fd, "password");
  const user = getDb().prepare("SELECT id, password_hash FROM users WHERE email = ?").get(email) as
    | { id: number; password_hash: string }
    | undefined;

  if (!user || !verifyPassword(password, user.password_hash)) {
    return { error: "Correo o contraseña incorrectos.", values: { email } };
  }
  await createSession(user.id);
  redirect(safeNext(field(fd, "next")));
}

export async function logoutAction() {
  await destroySession();
  redirect("/");
}

// ---------- Carrito y compra ----------

export type CartProduct = Pick<Product, "id" | "name" | "category" | "priceCents" | "stock" | "imageUrl" | "hue">;

/** Datos actuales (precio y stock) de los productos que están en el carrito. */
export async function getCartProducts(ids: unknown): Promise<CartProduct[]> {
  if (!Array.isArray(ids)) return [];
  const clean = [...new Set(ids.filter((id): id is number => Number.isSafeInteger(id) && id > 0))].slice(0, 100);
  return getProductsByIds(clean).map(({ id, name, category, priceCents, stock, imageUrl, hue }) => ({
    id,
    name,
    category,
    priceCents,
    stock,
    imageUrl,
    hue,
  }));
}

export type CheckoutResult = { ok: true; orderId: number } | { ok: false; error: string; needsLogin?: boolean };

class CheckoutError extends Error {}

/**
 * Registra el pedido y descuenta el stock en una sola transacción.
 * No cobra nada. Los precios se toman de la base, nunca del navegador.
 */
export async function checkoutAction(items: unknown): Promise<CheckoutResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Inicia sesión para terminar tu compra.", needsLogin: true };

  if (!Array.isArray(items) || items.length === 0) return { ok: false, error: "Tu carrito está vacío." };
  if (items.length > 50) return { ok: false, error: "El carrito tiene demasiados productos." };

  const quantities = new Map<number, number>();
  for (const item of items) {
    const id = (item as { productId?: unknown })?.productId;
    const qty = (item as { quantity?: unknown })?.quantity;
    if (!Number.isSafeInteger(id) || !Number.isSafeInteger(qty) || (id as number) <= 0 || (qty as number) < 1) {
      return { ok: false, error: "El carrito tiene datos inválidos." };
    }
    const total = (quantities.get(id as number) ?? 0) + (qty as number);
    if (total > 99) return { ok: false, error: "Máximo 99 unidades por producto." };
    quantities.set(id as number, total);
  }

  const db = getDb();
  try {
    const orderId = tx(db, () => {
      const lines: { id: number; name: string; price: number; qty: number }[] = [];
      for (const [id, qty] of quantities) {
        const p = db.prepare("SELECT id, name, price_cents, stock FROM products WHERE id = ?").get(id) as
          | { id: number; name: string; price_cents: number; stock: number }
          | undefined;
        if (!p) throw new CheckoutError("Uno de los productos ya no está disponible. Revisa tu carrito.");
        if (p.stock < qty) {
          throw new CheckoutError(
            p.stock === 0
              ? `"${p.name}" se agotó. Quítalo del carrito para continuar.`
              : `Solo quedan ${p.stock} unidad${p.stock === 1 ? "" : "es"} de "${p.name}".`,
          );
        }
        lines.push({ id: p.id, name: p.name, price: p.price_cents, qty });
      }

      const total = lines.reduce((sum, l) => sum + l.price * l.qty, 0);
      const order = db.prepare("INSERT INTO orders (user_id, total_cents) VALUES (?, ?)").run(user.id, total);
      const newOrderId = Number(order.lastInsertRowid);

      const decrement = db.prepare("UPDATE products SET stock = stock - ? WHERE id = ? AND stock >= ?");
      const addItem = db.prepare(
        "INSERT INTO order_items (order_id, product_id, name, unit_price_cents, quantity) VALUES (?, ?, ?, ?, ?)",
      );
      for (const l of lines) {
        if (decrement.run(l.qty, l.id, l.qty).changes !== 1) {
          throw new CheckoutError(`No hay stock suficiente de "${l.name}".`);
        }
        addItem.run(newOrderId, l.id, l.name, l.price, l.qty);
      }
      return newOrderId;
    });
    return { ok: true, orderId };
  } catch (err) {
    if (err instanceof CheckoutError) return { ok: false, error: err.message };
    console.error("checkout failed", err);
    return { ok: false, error: "No pudimos registrar tu pedido. Intenta otra vez." };
  }
}

// ---------- Administración ----------

export async function createProductAction(_prev: FormState, fd: FormData): Promise<FormState> {
  const user = await getCurrentUser();
  if (!user?.isAdmin) return { error: "Necesitas una cuenta de administrador." };

  const name = field(fd, "name").trim();
  const description = field(fd, "description").trim();
  const category = field(fd, "category");
  const priceRaw = field(fd, "price").trim().replace(",", ".");
  const stockRaw = field(fd, "stock").trim();
  const imageUrl = field(fd, "imageUrl").trim();
  const values = { name, description, category, price: field(fd, "price"), stock: stockRaw, imageUrl };
  const fail = (error: string): FormState => ({ error, values, key: Date.now() });

  if (name.length < 2 || name.length > 120) return fail("El nombre debe tener entre 2 y 120 caracteres.");
  if (description.length < 10 || description.length > 2000)
    return fail("La descripción debe tener entre 10 y 2000 caracteres.");
  if (!isCategory(category)) return fail("Elige una categoría.");
  if (!/^\d{1,7}(\.\d{1,2})?$/.test(priceRaw)) return fail("El precio debe ser un número, por ejemplo 1299.90.");
  const priceCents = Math.round(Number(priceRaw) * 100);
  if (priceCents <= 0) return fail("El precio debe ser mayor que cero.");
  if (!/^\d{1,6}$/.test(stockRaw)) return fail("El stock debe ser un número entero (0 o más).");
  if (imageUrl && !/^(https?:\/\/|\/)\S+$/i.test(imageUrl))
    return fail("La imagen debe ser una URL que empiece con http://, https:// o /.");

  const hue = Math.floor(Math.random() * 360);
  getDb()
    .prepare(
      "INSERT INTO products (name, description, category, price_cents, stock, image_url, hue) VALUES (?, ?, ?, ?, ?, ?, ?)",
    )
    .run(name, description, category, priceCents, Number(stockRaw), imageUrl || null, hue);

  return { success: `"${name}" ya está en el catálogo.`, key: Date.now() };
}
